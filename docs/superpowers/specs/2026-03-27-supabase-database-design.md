# Supabase Database Integration — Design Spec

## Context

Il pricing configurator di Edizioni Duepuntozero è attualmente stateless: tutti i dati del wizard vivono in React state e vengono persi al refresh. Il form di contatto invia a Formspree (esterno), il rate limiting è in-memory (perso al restart), e le immagini AI sono base64 in memoria.

Questa integrazione aggiunge persistenza completa tramite **Supabase** (PostgreSQL + Auth + Storage), abilitando: lead management, autenticazione utenti, rate limiting persistente, storage immagini AI e dashboard utente.

## Approccio Scelto

**Supabase JS Client diretto** — nessun ORM (né Prisma né Drizzle). Un'unica libreria (`@supabase/supabase-js` + `@supabase/ssr`) per database, auth e storage.

**Motivazione**: con 4 tabelle, un ORM aggiunge complessità senza benefici proporzionati. Il client Supabase comunica via PostgREST (HTTP), eliminando problemi di connection pool su serverless.

---

## Database Schema

### `public.profiles`

Estende `auth.users` di Supabase con dati applicativi.

```sql
CREATE TABLE public.profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name       TEXT,
  phone           TEXT,
  company_name    TEXT,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Trigger: crea profilo automaticamente alla registrazione
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### `public.quotes`

Ogni submission del wizard — il record principale dei lead.

```sql
CREATE TABLE public.quotes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  status          TEXT DEFAULT 'new'
                  CHECK (status IN ('new','contacted','in_progress','quoted','accepted','rejected','archived')),
  -- Package selection
  service_id      TEXT NOT NULL,
  service_name    TEXT NOT NULL,
  tier_key        TEXT NOT NULL,
  tier_name       TEXT NOT NULL,
  tier_price      INTEGER NOT NULL,
  add_ons         JSONB DEFAULT '[]',
  features        JSONB DEFAULT '[]',
  -- AI form data
  business_name   TEXT,
  sector          TEXT,
  style           TEXT,
  color_palette   TEXT[] DEFAULT '{}',
  description     TEXT,
  reference_urls  TEXT,
  -- Contact info (per lead anonimi)
  contact_name    TEXT,
  contact_email   TEXT,
  contact_phone   TEXT,
  contact_message TEXT,
  -- Totali calcolati
  total_one_time  INTEGER DEFAULT 0,
  total_monthly   INTEGER DEFAULT 0,
  -- Metadata
  ip_address      INET,
  user_agent      TEXT,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_quotes_user_id ON public.quotes(user_id);
CREATE INDEX idx_quotes_status ON public.quotes(status);
CREATE INDEX idx_quotes_created_at ON public.quotes(created_at DESC);
```

### `public.previews`

Immagini AI generate, collegate a quotes e storage.

```sql
CREATE TABLE public.previews (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id        UUID REFERENCES public.quotes(id) ON DELETE CASCADE,
  user_id         UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  storage_path    TEXT NOT NULL,
  prompt_hash     TEXT,
  prompt_input    JSONB,
  file_size_bytes INTEGER,
  mime_type       TEXT DEFAULT 'image/png',
  created_at      TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.previews ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_previews_user_id ON public.previews(user_id);
CREATE INDEX idx_previews_quote_id ON public.previews(quote_id);
```

### `public.rate_limits`

Rate limiting persistente — sostituisce la Map in-memory.

```sql
CREATE TABLE public.rate_limits (
  id              BIGSERIAL PRIMARY KEY,
  key             TEXT NOT NULL,
  action          TEXT NOT NULL,
  window_start    TIMESTAMPTZ NOT NULL,
  count           INTEGER DEFAULT 1,
  UNIQUE(key, action, window_start)
);

ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_rate_limits_lookup ON public.rate_limits(key, action, window_start);

-- RPC function: check e increment atomico
CREATE OR REPLACE FUNCTION public.check_and_increment_rate_limit(
  p_key TEXT,
  p_action TEXT,
  p_max_count INTEGER,
  p_window_interval INTERVAL
)
RETURNS BOOLEAN AS $$
DECLARE
  v_window_start TIMESTAMPTZ;
  v_current_count INTEGER;
BEGIN
  v_window_start := date_trunc('hour', now());

  INSERT INTO public.rate_limits (key, action, window_start, count)
  VALUES (p_key, p_action, v_window_start, 1)
  ON CONFLICT (key, action, window_start)
  DO UPDATE SET count = public.rate_limits.count + 1
  RETURNING count INTO v_current_count;

  RETURN v_current_count <= p_max_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Cleanup: righe > 24h (eseguire via pg_cron o scheduled function)
-- SELECT cron.schedule('cleanup-rate-limits', '0 * * * *',
--   $$DELETE FROM public.rate_limits WHERE window_start < now() - interval '24 hours'$$
-- );
```

### RLS Policies

```sql
-- profiles: utente vede/modifica solo il proprio profilo
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- quotes: utente vede le proprie; insert anonime via service role
CREATE POLICY "Users can view own quotes"
  ON public.quotes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own quotes"
  ON public.quotes FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Service role full access on quotes"
  ON public.quotes FOR ALL USING (auth.role() = 'service_role');

-- previews: utente vede le proprie
CREATE POLICY "Users can view own previews"
  ON public.previews FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service role full access on previews"
  ON public.previews FOR ALL USING (auth.role() = 'service_role');

-- rate_limits: solo service role
CREATE POLICY "Service role only"
  ON public.rate_limits FOR ALL USING (auth.role() = 'service_role');
```

---

## Supabase Storage

**Bucket**: `previews` (privato)

```
previews/
├── anonymous/{quote_id}/{uuid}.png
└── users/{user_id}/{quote_id}/{uuid}.png
```

**Policies**:
- Utenti autenticati possono leggere da `users/{their_user_id}/**`
- Accesso anonimo e admin via signed URLs generati server-side (scadenza 1h)
- Upload solo via service role (dal server)

---

## Struttura File Nuovi

```
app/
├── lib/supabase/
│   ├── server.ts            # createServerClient() — RSC, actions, routes
│   ├── client.ts            # createBrowserClient() — auth client-side
│   ├── middleware.ts         # helper per refresh token
│   └── types.ts             # Database types (generati con supabase gen types)
├── actions/
│   ├── quotes.ts            # createQuote(), getMyQuotes(), updateQuoteStatus()
│   ├── previews.ts          # savePreview(), getMyPreviews(), getSignedUrl()
│   └── rate-limit.ts        # checkRateLimit() — chiama RPC function
├── api/auth/callback/
│   └── route.ts             # OAuth callback (Google)
├── (auth)/
│   ├── login/page.tsx       # Login: email+password + Google OAuth
│   └── register/page.tsx    # Registrazione: email+password + Google OAuth
├── dashboard/
│   ├── layout.tsx           # Auth guard (redirect se non loggato)
│   ├── page.tsx             # Overview: quotes recenti + previews
│   ├── quotes/[id]/page.tsx # Dettaglio quote con stato
│   └── profile/page.tsx     # Visualizza/modifica profilo
middleware.ts                # Root: refresh auth token su ogni request
supabase/
└── migrations/
    └── 001_initial_schema.sql
```

---

## File Esistenti da Modificare

| File | Modifica |
|------|----------|
| `app/api/generate-preview/image/route.ts` | Sostituire rate limit in-memory con RPC Supabase; upload immagine a Storage; salvare record in `previews`; ritornare signed URL |
| `app/components/PricingSection.tsx` | Step 6: sostituire Formspree con server action `createQuote()`; aggiungere opzione "crea account" post-submit |
| `app/components/AIPreviewStep.tsx` | Ricevere signed URL invece di base64; collegare preview a quote_id |
| `app/layout.tsx` | Wrappare con Supabase auth provider se necessario |
| `app/data/config.ts` | Aggiungere config Supabase (URL, anon key) o rimuovere formspreeUrl |
| `.env.local` | Aggiungere `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` |
| `package.json` | Aggiungere `@supabase/supabase-js`, `@supabase/ssr` |

---

## Autenticazione

### Flusso Email + Password
1. Utente compila form registrazione (nome, email, password)
2. `supabase.auth.signUp({ email, password, options: { data: { full_name } } })`
3. Email di conferma inviata da Supabase
4. Click su link → `/api/auth/callback` → scambio code per session → redirect a `/dashboard`
5. Trigger DB crea riga in `profiles`

### Flusso Google OAuth
1. Click "Accedi con Google"
2. `supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: '/api/auth/callback' } })`
3. Redirect a Google → consenso → callback → session → `/dashboard`
4. Trigger DB crea riga in `profiles` con `full_name` dal profilo Google

### Middleware (Root)
- Intercetta ogni request
- Refresh del token JWT se scaduto
- Protegge `/dashboard/*` — redirect a `/login` se non autenticato

---

## Flusso Wizard Modificato

### Step 1-4: Invariati
React state come attualmente. Nessuna interazione con DB.

### Step 5: AI Preview (modificato)
1. Form compilato come ora
2. Check rate limit: chiama RPC `check_and_increment_rate_limit('ip:{ip}', 'preview_generate', 10, '1 hour')`
3. Se entro limite: chiama Gemini API come ora
4. Dopo generazione: decodifica base64 → upload a Supabase Storage
5. Salva record in `previews` (storage_path, prompt_input)
6. Ritorna signed URL al client (invece di base64 raw)
7. Se utente loggato: collega a `user_id`

### Step 6: Contatto (modificato)
1. Form come ora (nome, email, telefono, messaggio)
2. Submit chiama server action `createQuote()`:
   - Raccoglie dati da tutti gli step (passati come parametro)
   - Salva in `quotes` con tutti i campi
   - Se utente loggato: `user_id` = auth user; altrimenti: `user_id` = null, contact info salvate
   - Collega eventuali preview generate
3. Feedback: "Richiesta inviata! Crea un account per seguire lo stato."
4. Opzionale: CTA per registrarsi e "reclamare" il preventivo

---

## Dashboard Utente

### `/dashboard` — Overview
- Lista quotes recenti con stato (badge colorati)
- Ultime preview generate (thumbnails)
- Quick stats (numero preventivi, ultimo aggiornamento)

### `/dashboard/quotes/[id]` — Dettaglio Quote
- Riepilogo pacchetto selezionato (servizio, tier, add-on, prezzo)
- Dati AI form
- Preview collegate (galleria con fullscreen)
- Timeline stato (new → contacted → in_progress → quoted → accepted)

### `/dashboard/profile` — Profilo
- Visualizza/modifica: nome, telefono, azienda
- Email (read-only, gestita da auth)
- Cambio password
- Logout

---

## Dipendenze Nuove

```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2",
    "@supabase/ssr": "^0.5"
  }
}
```

Dev (CLI per migrations e type generation):
```bash
npx supabase init
npx supabase gen types typescript --project-id <id> > app/lib/supabase/types.ts
```

---

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...   # Solo server-side, mai esposta al client
```

---

## Fasi di Implementazione

### Fase 1: Foundation
Setup Supabase, client helpers, auth (email+password + Google), middleware, migration SQL.

### Fase 2: Lead Capture
Server action `createQuote()`, modifica PricingSection Step 6, rimpiazzo Formspree.

### Fase 3: Rate Limiting
RPC function atomica, modifica API route generate-preview, rimuovi Map in-memory.

### Fase 4: Image Storage
Bucket setup, upload post-generazione, signed URLs, modifica AIPreviewStep.

### Fase 5: Dashboard
Layout con auth guard, pagine overview/quotes/profile, galleria preview.

---

## Verifica

1. **Auth**: registrazione email+password → email conferma → login → session attiva; login Google → callback → session
2. **Lead capture**: completa wizard → submit → record in `quotes` visibile in Supabase dashboard
3. **Rate limiting**: genera 10+ preview → errore rate limit; riavvia server → contatore persistito
4. **Image storage**: genera preview → immagine in Storage bucket → signed URL funzionante
5. **Dashboard**: login → vedi quotes e preview; profilo modificabile; logout → redirect a login
6. **RLS**: utente A non vede quotes di utente B; lead anonimi non accessibili da client
7. **Build**: `npm run build` senza errori
