@AGENTS.md

# Pricing Configurator — Edizioni Duepuntozero

## Progetto

Sito pricing/configuratore per la web agency **Edizioni Duepuntozero** (Italia). Permette ai clienti di configurare il pacchetto servizi desiderato attraverso un wizard interattivo a 6 step e ottenere una preview AI del sito.

## Stack

- **Next.js 16.2.1** (App Router) — attenzione: breaking changes rispetto a versioni precedenti
- **React 19** con `"use client"` per tutti i componenti interattivi
- **TypeScript 5** (strict mode)
- **Tailwind CSS 4** (plugin `@tailwindcss/postcss`)
- **Three.js** + **GSAP** per visualizzazione 3D nel wizard
- **Gemini API** (`@google/genai`) per generazione preview AI

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
│   ├── Hero.tsx, Navbar.tsx, etc.    # Componenti pagina
│   └── CaseStudies.tsx              # Case studies
├── api/generate-preview/
│   └── image/route.ts                # POST: genera mockup immagine via Gemini
├── data/
│   ├── packages.ts                   # Servizi, tier, features, add-on (dati core)
│   ├── config.ts                     # Config sito (contatti, URL)
│   └── preview-prompts.ts           # Prompt strutturati Gemini (blueprint per servizio + direttive stile)
└── lib/
    └── gemini.ts                     # Client Gemini API (timeout, retry, classi errore custom)
```

## Design System

- **Tema dark luxury**: background `#050505`, foreground `#e8e4df`, accent `#c9b99a`
- **Font**: Instrument Serif (display), Geist (sans), Geist Mono (mono)
- **Pattern**: noise texture overlay, smooth scroll, stagger animations

## Convenzioni

- Tutti i componenti interattivi usano `"use client"`
- I dati dei servizi sono in `packages.ts` — struttura: `ServiceCategory` con `tiers` (base/pro/premium), `features[]`, `addOns[]`
- Le API routes seguono il pattern standard Next.js 16 App Router (`export async function POST(request: Request)`)
- Comunicazione tra componenti via custom events (`window.dispatchEvent`)

## AI Preview (Step 5)

- Usa SDK `@google/genai` (NON `@google/generative-ai` che è deprecato)
- Modello: `gemini-3.1-flash-image-preview` (solo generazione immagine mockup)
- Singola request: genera un'immagine mockup del sito, visualizzata inline con fullscreen (Fullscreen API)
- Prompt strutturato in `preview-prompts.ts`: blueprint layout per servizio + direttive stile con reference anchor (apple.com, linear.app, ecc.)
- Classi errore custom in `gemini.ts`: `GeminiTimeoutError`, `GeminiRateLimitError`, `GeminiNoImageError`
- Timeout: 90s per tentativo, max 1 retry, `maxDuration=120` sulla route
- Client-side: AbortController con timeout 120s + cleanup su unmount
- Rate limiting: 3/sessione (cookie) + 10/IP/ora (in-memory)
- API key in `GEMINI_API_KEY` env var

## Comandi

```bash
npm run dev      # Dev server
npm run build    # Build produzione
npm run lint     # ESLint
```
