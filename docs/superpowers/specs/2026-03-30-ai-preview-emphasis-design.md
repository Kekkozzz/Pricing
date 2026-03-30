# Design: Enfasi Preview AI come Vantaggio Competitivo

## Obiettivo

Comunicare la feature "Preview AI" come differenziatore esclusivo su tutti i touchpoint del sito. Tono: esclusività + innovazione. Approccio "Show, Don't Tell" — mostrare il risultato, non spiegare la tecnologia.

## 1. Micro-interventi

### 1a. Hero Homepage (`app/components/Hero.tsx`)

Aggiungere un badge/pill sotto il sottotitolo, prima dei CTA:

- Testo: `Preview AI inclusa — vedi il tuo progetto prima di iniziare`
- Stile: `text-[10px] uppercase tracking-[0.35em] text-accent font-mono`, con un marker `✦` (tracking coerente con il tagline hero soprastante)
- Posizione: tra il paragrafo e i bottoni CTA
- Animazione: `animate-fade-up stagger-4` (i CTA diventano stagger-5)

### 1b. Card Servizi (`app/components/ServicesOverview.tsx`)

In ogni ServiceCard, sotto la riga "da €X", aggiungere:

- Testo: `Preview AI inclusa`
- Stile: `text-accent text-[10px] font-mono uppercase tracking-[0.2em]`
- Coerente con la tipografia dei label esistenti

### 1c. Price Label Pagine Servizio (`app/data/service-details.ts`)

Appendere `· Preview AI inclusa` al campo `priceLabel` di ogni servizio:

- Siti Web: "Da €499 · Consegna da 3 giorni · Preview AI inclusa" (rimosso "Prezzo trasparente, senza sorprese" per uniformare a 3 segmenti)
- Shop & SaaS: "Da €999 · Consegna da 5 giorni · Preview AI inclusa"
- Web App: "Da €2.999 · Consegna da 7 giorni · Preview AI inclusa"
- Mobile App: "Da €3.999 · Consegna da 10 giorni · Preview AI inclusa"

## 2. Sezione Dedicata Homepage

### Posizione

Tra CaseStudies e PricingSection in `app/page.tsx`.

### Nuovo componente: `app/components/AIShowcase.tsx`

Layout due colonne su desktop (`md:grid-cols-2`), stack su mobile.

**Colonna sinistra — Copy:**
- Label: `✦ Solo da noi` — mono, accent, uppercase, tracking wide
- Headline: `Vedi il tuo sito prima di iniziarlo.` — font-display, text-3xl/4xl
- Paragrafo: 2-3 righe sul vantaggio competitivo. Configuri, descrivi, generi. Nessun'altra agenzia lo offre.
- CTA: `Prova ora →` — link ad `#pricing`, stile primary button (bg-foreground)

**Colonna destra — Mockup:**
- Immagine statica di un mockup generato (file in `public/ai-showcase.png`), alt: "Preview AI generata per un sito di esempio"
- Racchiusa in un frame browser stilizzato:
  - Barra: `bg-surface/40 border-b border-border rounded-t px-4 py-2.5` con 3 pallini (`bg-muted/30 w-2.5 h-2.5 rounded-full`) e testo URL `tuosito.it` in `text-[10px] text-muted font-mono`
  - Contenuto: `rounded-b border border-border overflow-hidden`
- Badge sopra il frame: `Generato in 30 secondi` — accent, mono, piccolo
- Hover: `hover:scale-[1.02] transition-transform duration-500 hover:shadow-[0_8px_30px_rgba(201,185,154,0.08)]`
- Se `ai-showcase.png` non esiste, il componente non renderizza nulla (conditional render con check import)

**Mobile:** Stack verticale, copy sopra, mockup sotto full-width.

**Design system:** background `#050505`, accent `#c9b99a`, font display Instrument Serif, mono Geist Mono. Divider line in basso come le altre sezioni.

**Componente:** Server Component (nessun state o interattività JS — solo CSS hover). No `"use client"`.

**Animazioni:** `animate-fade-up` con stagger su label, headline, paragrafo, CTA e frame mockup.

## 3. FAQ Pagine Servizio

### Nuova FAQ per ogni servizio (`app/data/service-details.ts`)

Aggiungere come ultima domanda (7° FAQ) in ogni servizio:

**Siti Web:**
- Q: "Posso vedere un'anteprima del mio sito prima di iniziare?"
- A: "Sì. Durante la configurazione del pacchetto, puoi generare una preview AI personalizzata. Descrivi la tua attività, scegli lo stile e i colori — e vedrai un mockup del tuo sito in pochi secondi. Incluso in tutti i pacchetti."

**Shop & SaaS:**
- Q: "Posso vedere un'anteprima della mia piattaforma prima di iniziare?"
- A: "Sì. Durante la configurazione del pacchetto, puoi generare una preview AI personalizzata. Descrivi la tua attività, scegli lo stile e i colori — e vedrai un mockup della tua piattaforma in pochi secondi. Incluso in tutti i pacchetti."

**Web App:**
- Q: "Posso vedere un'anteprima della mia web app prima di iniziare?"
- A: "Sì. Durante la configurazione del pacchetto, puoi generare una preview AI personalizzata. Descrivi il tuo progetto, scegli lo stile e i colori — e vedrai un mockup della tua web app in pochi secondi. Incluso in tutti i pacchetti."

**Mobile App:**
- Q: "Posso vedere un'anteprima della mia app prima di iniziare?"
- A: "Sì. Durante la configurazione del pacchetto, puoi generare una preview AI personalizzata. Descrivi il tuo progetto, scegli lo stile e i colori — e vedrai un mockup della tua app in pochi secondi. Incluso in tutti i pacchetti."

## File coinvolti

| File | Modifica |
| --- | --- |
| `app/components/Hero.tsx` | Badge AI sotto sottotitolo |
| `app/components/ServicesOverview.tsx` | Riga "Preview AI inclusa" nelle card |
| `app/data/service-details.ts` | priceLabel + FAQ per 4 servizi |
| `app/components/AIShowcase.tsx` | Nuovo componente sezione dedicata |
| `app/page.tsx` | Import + posizionamento AIShowcase |
| `public/ai-showcase.png` | Immagine mockup di esempio (da fornire) |

## Dipendenze

- L'utente deve fornire o generare un mockup di esempio (`ai-showcase.png`) per la sezione dedicata
- Nessuna dipendenza tecnica aggiuntiva — tutto HTML/CSS/Tailwind

## Verifica

- `npm run build` senza errori
- Controllo visivo homepage: badge hero, card servizi, nuova sezione, wizard
- Controllo visivo pagine servizio: priceLabel aggiornato, nuova FAQ
- Test responsive: 375px, 768px, 1024px+
