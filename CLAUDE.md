@AGENTS.md

# Pricing Configurator — Edizioni Duepuntozero

## Progetto

Sito pricing/configuratore per la web agency **Edizioni Duepuntozero** (Italia). Permette ai clienti di configurare il pacchetto servizi desiderato attraverso un wizard interattivo a 6 step e ottenere una preview AI del sito. Include autenticazione utenti, dashboard preventivi e persistenza dati tramite Supabase.

## Stack

- **Next.js 16.2.1** (App Router) — attenzione: breaking changes rispetto a versioni precedenti
- **React 19** con `"use client"` per tutti i componenti interattivi
- **TypeScript 5** (strict mode)
- **Tailwind CSS 4** (plugin `@tailwindcss/postcss`)
- **Three.js** + **GSAP** per visualizzazione 3D nel wizard
- **Gemini API** (`@google/genai`) per generazione preview AI
- **Supabase** (`@supabase/supabase-js` + `@supabase/ssr`) per database, auth e storage

## Struttura Chiave

```text
app/
├── page.tsx                          # Home page (assembla i componenti)
├── layout.tsx                        # Root layout con font e metadata
├── globals.css                       # Tailwind + design tokens + animazioni
├── components/
│   ├── PricingSection.tsx            # Wizard 6 step (componente principale)
│   ├── WizardScene.tsx               # Visualizzazione 3D (Three.js)
│   ├── AIPreviewStep.tsx             # Step 5: form input + generazione AI mockup
│   ├── PreviewLoading.tsx            # Animazione loading durante generazione
│   ├── AuthGateModal.tsx             # Modal auth gate prima della generazione AI
│   ├── Hero.tsx, Navbar.tsx, etc.    # Componenti pagina
│   └── CaseStudies.tsx              # Case studies
├── (auth)/
│   ├── login/page.tsx                # Login: email+password + Google OAuth + password reset
│   └── register/page.tsx             # Registrazione con email confirmation
├── dashboard/
│   ├── layout.tsx                    # Auth guard (redirect se non loggato)
│   ├── page.tsx                      # Overview: quotes recenti + stats
│   ├── error.tsx                     # Error boundary dashboard
│   ├── quotes/[id]/page.tsx          # Dettaglio quote con stato
│   └── profile/page.tsx              # Visualizza/modifica profilo + cambio password
├── actions/
│   ├── quotes.ts                     # Server actions: createQuote, getMyQuotes, getQuoteById
│   ├── previews.ts                   # Server actions: savePreview, getMyPreviews
│   └── rate-limit.ts                 # Rate limiting via Supabase RPC + fallback in-memory
├── api/
│   ├── generate-preview/image/route.ts  # POST: genera mockup immagine via Gemini
│   └── auth/callback/route.ts        # OAuth callback (Google)
├── data/
│   ├── packages.ts                   # Servizi, tier, features, add-on (dati core)
│   ├── config.ts                     # Config sito (contatti, URL)
│   └── preview-prompts.ts           # Prompt strutturati Gemini
├── lib/
│   ├── gemini.ts                     # Client Gemini API (timeout, retry, classi errore custom)
│   └── supabase/
│       ├── server.ts                 # createServerClient() + createServiceRoleClient()
│       ├── client.ts                 # createBrowserClient() per componenti client
│       ├── proxy.ts                  # Middleware: refresh sessione + protezione route
│       └── types.ts                  # Database TypeScript types
proxy.ts                              # Root middleware (re-export)
supabase/
└── migrations/
    ├── 001_initial_schema.sql        # Schema completo: profiles, quotes, previews, rate_limits
    └── 002_fix_quotes_rls_policy.sql # Fix RLS policy quote INSERT
```

## Design System

- **Tema dark luxury**: background `#050505`, foreground `#e8e4df`, accent `#c9b99a`
- **Font**: Instrument Serif (display), Geist (sans), Geist Mono (mono)
- **Pattern**: noise texture overlay, smooth scroll, stagger animations

## Convenzioni

- Tutti i componenti interattivi usano `"use client"`
- I dati dei servizi sono in `packages.ts` — struttura: `ServiceCategory` con `tiers` (base/pro/premium), `features[]`, `addOns[]`
- Le API routes seguono il pattern standard Next.js 16 App Router (`export async function POST(request: Request)`)
- Server actions in `app/actions/` con direttiva `"use server"`
- Comunicazione tra componenti via custom events (`window.dispatchEvent`)

## Autenticazione (Supabase Auth)

- Email+password + Google OAuth
- Middleware (`proxy.ts`) intercetta tutte le request: refresh JWT + protezione `/dashboard/*`
- Pagine auth in route group `(auth)` — login con password reset, register con email confirmation
- `AuthGateModal` nel wizard step 5: richiede login prima di generare preview AI
- Wizard state salvato in localStorage prima dei redirect OAuth, ripristinato al ritorno
- Dashboard protetta: redirect a `/login` se non autenticato

## Database (Supabase PostgreSQL)

- 4 tabelle: `profiles`, `quotes`, `previews`, `rate_limits` — tutte con RLS abilitato
- `profiles` estende `auth.users` con trigger automatico alla registrazione
- `quotes` — lead/preventivi dal wizard; insert anonime (user_id NULL) solo via service role
- `previews` — immagini AI in Supabase Storage (bucket privato, signed URLs 1h)
- `rate_limits` — RPC atomica `check_and_increment_rate_limit()` con fallback in-memory
- Client separation: `createServerClient()` per RSC/actions, `createServiceRoleClient()` per operazioni privilegiate, `createClient()` per browser

## AI Preview (Step 5)

- Usa SDK `@google/genai` (NON `@google/generative-ai` che è deprecato)
- Modello: `gemini-3.1-flash-image-preview` (solo generazione immagine mockup)
- Singola request: genera un'immagine mockup del sito, visualizzata inline con fullscreen (Fullscreen API)
- Prompt strutturato in `preview-prompts.ts`: blueprint layout per servizio + direttive stile con reference anchor (apple.com, linear.app, ecc.)
- Classi errore custom in `gemini.ts`: `GeminiTimeoutError`, `GeminiRateLimitError`, `GeminiNoImageError`
- Timeout: 90s per tentativo, max 1 retry, `maxDuration=180` sulla route
- Client-side: AbortController con timeout 120s + cleanup su unmount
- Rate limiting: 3/sessione + 10/IP/ora (Supabase RPC con fallback in-memory)
- Post-generazione: upload a Supabase Storage, record in `previews`, signed URL al client
- API key in `GEMINI_API_KEY` env var

## Environment Variables

```env
GEMINI_API_KEY=...
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...   # Solo server-side, mai esposta al client
```

## Comandi

```bash
npm run dev      # Dev server
npm run build    # Build produzione
npm run lint     # ESLint
```
