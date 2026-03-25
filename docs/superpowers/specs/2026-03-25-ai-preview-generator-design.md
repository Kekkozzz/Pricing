# AI Preview Generator — Design Spec

## Context

Edizioni Duepuntozero (web agency Italia) ha un pricing configurator a 5 step. I clienti scelgono servizio, tier, features e add-on, ma non vedono cosa otterranno concretamente. L'obiettivo è aggiungere uno step AI che generi una preview visiva del sito, trasformando il configurator da "listino prezzi" a "esperienza di vendita".

## Decisioni di Design

| Decisione | Scelta |
|-----------|--------|
| Posizione nel wizard | Nuovo Step 5 dedicato (wizard diventa 6 step) |
| Tipo di output | Combinato: immagine mockup + HTML/CSS interattivo |
| Input utente | Form completo: nome, settore, stile, palette, descrizione, logo, riferimenti |
| AI backend | Gemini API: `gemini-3.1-flash-image-preview` (immagini) + `gemini-3.1-flash-lite-preview` (codice). Nota: questi sono i model ID specificati dall'utente per Marzo 2026. Verificare disponibilità in fase di implementazione e aggiornare se necessario. |
| Rendering preview | Modale/overlay fullscreen con iframe sandboxato |
| Gestione costi | L'agenzia paga tutto, con rate limiting per prevenire abusi |
| Approccio generazione | Sequenziale: prima immagine (~2-3s), poi codice HTML (~5-8s) |

## Flusso Utente

```
Step 1 (Servizio) → Step 2 (Tier) → Step 3 (Features) → Step 4 (Add-on)
  → Step 5 (AI Preview) ✨ → Step 6 (Contatto)
```

### Step 5 — AI Preview

1. L'utente vede un form con campi di personalizzazione (precompilati con contesto dagli step precedenti)
2. Compila: nome attività, settore, stile, palette colori, descrizione, logo (opzionale), siti di riferimento (opzionale)
3. Clicca "Genera Preview AI"
4. **Fase 1**: animazione di loading → immagine mockup appare (~2-3 sec)
5. **Fase 2**: bottone "Esplora Preview Interattiva" diventa disponibile (~5-8 sec)
6. Click sul bottone → modale fullscreen con HTML/CSS navigabile in iframe
7. L'utente può chiudere il modale e tornare al form, oppure procedere allo Step 6

## Architettura

### Data Flow — Due Request Separate

Il client fa **due chiamate HTTP separate e sequenziali** all'API route. Questo semplifica l'implementazione e permette di mostrare l'immagine appena disponibile senza aspettare l'HTML.

```
Browser (Step 5)
  │
  ├─ [Request 1] POST /api/generate-preview/image
  │    Body: { serviceName, tier, features, addOns, businessName,
  │            sector, style, colorPalette, description, logo?, referenceUrls? }
  │    Response: { imageBase64: string }
  │
  │  → Browser mostra immagine mockup
  │
  ├─ [Request 2] POST /api/generate-preview/html
  │    Body: { stessi dati di Request 1 }
  │    Response: { html: string }  (HTML già sanitizzato server-side)
  │
  ▼
Browser
  ├─ Mostra immagine inline (da Request 1)
  └─ Renderizza HTML in iframe sandboxato dentro modale fullscreen (da Request 2)
```

Implementazione: un singolo `route.ts` con due handler, oppure due route file separati (`image/route.ts` e `html/route.ts`). La scelta verrà fatta in fase di planning.

### Nuovi File

| File | Scopo |
|------|-------|
| `app/api/generate-preview/route.ts` | API Route: orchestrazione chiamate Gemini, rate limiting, sanitizzazione |
| `app/components/AIPreviewStep.tsx` | Componente Step 5: form input + logica generazione + display risultati |
| `app/components/PreviewModal.tsx` | Modale fullscreen: iframe sandboxato per HTML interattivo |
| `app/components/PreviewLoading.tsx` | Animazione di loading durante generazione (skeleton + progress) |
| `app/data/preview-prompts.ts` | Template prompt per Gemini, parametrizzati per servizio/tier |
| `app/lib/gemini.ts` | Client Gemini API: configurazione condivisa, helper per chiamate |

### File Esistenti da Modificare

| File | Modifica |
|------|----------|
| `app/components/PricingSection.tsx` | Aggiungere Step 5 (AI Preview) al wizard: aggiornare `totalSteps` da 5 a 6, aggiornare la logica `canNext` (linee ~104-108) per gestire il nuovo step, aggiornare le label degli step nella progress bar, inserire il render di `<AIPreviewStep>` nel flusso condizionale |
| `app/data/packages.ts` | Nessuna modifica necessaria — i dati servizio/tier sono già accessibili |

## Componenti nel Dettaglio

### AIPreviewStep.tsx

Form con i seguenti campi:
- **Nome Attività** (text input, required)
- **Settore** (chip selector: Ristorazione, Moda, Tech, Salute, Immobiliare, Educazione, Altro con input custom)
- **Stile Preferito** (chip selector: Minimal, Moderno, Corporate, Creativo, Elegante)
- **Palette Colori** (color picker con preset + custom)
- **Descrizione Attività** (textarea, opzionale ma consigliato)
- **Logo** (file upload, opzionale, max 2MB, PNG/SVG/JPG)
- **Siti di Riferimento** (text input, opzionale)

Il contesto degli step precedenti (servizio scelto, tier, features attive, add-on) viene passato automaticamente come prop dal wizard parent.

Stato interno:
- `idle` → `generating-image` → `image-ready` → `generating-html` → `complete`
- Gestione errori con retry

### PreviewModal.tsx

- Overlay fullscreen con backdrop blur
- Header con nome attività e bottone chiudi
- Iframe con `sandbox="allow-same-origin"` (permette caricamento Google Fonts e immagini esterne, ma no JS, no forms, no popups)
- Toolbar in basso: "Scarica HTML" (download del file HTML raw generato), "Rigenera", "Procedi al Contatto"
- Responsive: su mobile, occupa tutto lo schermo senza padding

### PreviewLoading.tsx

- Animazione elegante in tema con il design del sito (dark/gold)
- Messaggi rotanti tipo: "Sto progettando la tua homepage...", "Scelgo il layout migliore...", "Applico i tuoi colori..."
- Progress bar indicativa (non reale, ma plausibile)
- Transizione smooth all'immagine quando arriva

### preview-prompts.ts

Template prompt strutturati per tipo di servizio:
- **Siti Web**: prompt focalizzato su brochure/vetrina, hero, about, servizi, contatti
- **Shop & SaaS**: prompt con product grid, cart preview, checkout flow
- **Web App**: prompt con dashboard, sidebar, data tables
- **SEO & Marketing**: prompt con landing page, CTA, analytics dashboard mockup

Ogni template riceve: nome, settore, stile, colori, descrizione, features del tier scelto.

### gemini.ts

- Inizializzazione client con API key da `process.env.GEMINI_API_KEY`
- Helper `generateImage(prompt)` → base64 string
- Helper `generateHTML(prompt)` → HTML string
- Gestione errori e retry (max 2 tentativi)
- Timeout: 15s per immagine, 30s per HTML

## Prompt Engineering

### Prompt Immagine (gemini-3.1-flash-image-preview)

```
Genera un mockup screenshot professionale di una homepage per: [nome attività].
Settore: [settore]. Stile: [stile].
Colori principali: [palette].
Tipo di sito: [servizio] — tier [tier].
Features incluse: [lista features].
[descrizione attività se fornita]

Il mockup deve apparire come uno screenshot reale di un sito web moderno,
visto in un browser desktop. Alta qualità, professionale, realistico.
```

### Prompt HTML (gemini-3.1-flash-lite-preview)

```
Genera il codice HTML+CSS completo per una homepage di: [nome attività].
Settore: [settore]. Stile: [stile].

Requisiti:
- HTML5 semantico con CSS inline (tutto in un singolo file HTML)
- Responsive design (mobile-first)
- Palette colori: [palette]
- Font da Google Fonts appropriato allo stile
- Sezioni: Hero, About, Servizi/Prodotti, Contatti
- Testi realistici in italiano, pertinenti al settore
- Immagini placeholder via picsum.photos o unsplash source
- Nessun JavaScript necessario, solo HTML+CSS
- Il codice deve essere completo e renderizzabile standalone

[Adattamenti specifici per tipo servizio e tier]
```

## Sicurezza

| Misura | Implementazione |
|--------|-----------------|
| API Key protection | `GEMINI_API_KEY` in env vars, mai esposta al client |
| Rate limiting | 3 preview/sessione (cookie), 10/IP/ora. Implementazione in-memory Map (sufficiente per single-instance Node.js; se deploy serverless, sostituire con KV store o header-based limiting) |
| HTML sanitization | DOMPurify server-side per rimuovere script malevoli dall'output Gemini |
| Iframe sandboxing | `sandbox="allow-same-origin"` — permette caricamento risorse esterne (Google Fonts, immagini placeholder) ma blocca JS, form submission, popups e navigazione |
| Input validation | Max length su tutti i campi, file upload max 2MB, URL validation |
| CORS | API route accessibile solo dallo stesso dominio |

## Loading & Error States

| Stato | UI |
|-------|-----|
| Idle | Form visibile, bottone "Genera Preview AI" attivo |
| Generating Image | PreviewLoading con messaggi animati |
| Image Ready | Immagine mockup visibile + bottone "Esplora Interattiva" (loading) |
| Generating HTML | Bottone con spinner "Preparando preview interattiva..." |
| Complete | Immagine + bottone "Esplora Preview Interattiva" attivo |
| Error (Image) | Messaggio errore + retry, oppure skip diretto a HTML |
| Error (HTML) | Messaggio errore + retry, l'immagine resta visibile |
| Rate Limited | Messaggio "Hai raggiunto il limite di preview. Contattaci per vedere di più!" |

## Costi Stimati

| Modello | Costo/chiamata | Note |
|---------|-----------------|------|
| gemini-3.1-flash-image-preview | ~$0.045 | Per immagine mockup |
| gemini-3.1-flash-lite-preview | ~$0.01-0.03 | Per generazione HTML (~2K token output) |
| **Totale per preview** | **~$0.05-0.08** | Circa €0.05-0.07 |

Con rate limiting a 10/IP/ora, anche con traffico significativo i costi restano gestibili.

## Dipendenze da Aggiungere

| Package | Scopo |
|---------|-------|
| `@google/generative-ai` | SDK ufficiale Gemini |
| `isomorphic-dompurify` | Sanitizzazione HTML server-side |

## Aspetti Non in Scope

- Salvataggio delle preview generate (sono effimere, generate on-demand)
- Account utente / storico preview
- Modifica in-browser dell'HTML generato (editor)
- A/B testing di diverse preview
- Analytics sulle preview generate
