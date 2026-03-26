# ServicesOverview Redesign — Design Spec

## Context

La sezione servizi attuale ha 4 card in griglia 2x2 che risultano generiche e piatte. Non comunicano personalita e non invogliano a cliccare. L'obiettivo e dare piu impatto visivo con card piu grandi, layout a due colonne interne, e micro-animazioni Lottie uniche per servizio (monocromatiche di default, colorate all'hover).

## Layout Card

Ogni card ha **due colonne interne** (`grid grid-cols-[3fr_2fr]`):

- **Sinistra (3fr):** tag servizio (monospace accent), titolo, descrizione, prezzo "a partire da", CTA "Vedi pacchetti ->"
- **Destra (2fr):** animazione Lottie (o fallback icona Lucide ingrandita), centrata verticalmente, container `max-h-48 aspect-square`

Le icone Lucide attuali vengono rimosse come elemento primario e usate solo come fallback quando il file Lottie non e disponibile.

**Griglia esterna:** rimane `grid-cols-1 sm:grid-cols-2` ma con `gap-6`. Le card sono piu alte grazie al contenuto a due colonne.

**Mobile:** le due colonne interne diventano colonna singola (`grid-cols-1`) — animazione sopra, testo sotto.

## Architettura Componente

Estrarre ogni card in un sub-componente `ServiceCard` con il proprio `useRef` per il Lottie. Questo permette gestione indipendente di hover/play/stop per ogni card senza array di refs.

## Animazione e Interazione

**Default (nessun hover):**
- Lottie ferma al primo frame (`autoplay: false`, `loop: false`)
- CSS `filter: grayscale(1) brightness(0.7)` — monocromatica, tono scuro
- Transition: `transition-[filter] duration-500`

**Hover sulla card (desktop):**
- CSS filter transiziona a `grayscale(0) brightness(1)` — colori originali
- Lottie parte in loop via `lottieRef.current.play()`
- La card mantiene gli effetti hover attuali (border-accent, surface/60)

**Mouse leave:**
- Lottie si ferma via `lottieRef.current.stop()`
- Filter torna monocromatico

**Touch devices (mobile/tablet):**
- Rilevamento via `window.matchMedia('(hover: hover)')` — se false, usa modalita touch
- Lottie in autoplay loop quando la card entra nel viewport (IntersectionObserver, threshold `0.3`)
- Mostrata a colori (no grayscale) poiche non c'e hover
- Si ferma quando la card esce dal viewport per risparmiare risorse
- Observer cleanup nel return del useEffect, e disconnessione se dati Lottie non ancora caricati
- Container Lottie su mobile: `max-h-32 sm:max-h-48` per proporzioni migliori su schermi stretti

**Fallback (no file Lottie):**
- Icona Lucide ingrandita (48-64px) con lo stesso effetto filter grayscale/color

**`prefers-reduced-motion`:**
- Lottie resta ferma al primo frame, mostrata a colori (no grayscale, poiche la transizione del filter e essa stessa movimento)

## Caricamento Lottie

- I file JSON vengono posizionati in `public/lottie/`
- Caricati via `fetch()` al mount del sub-componente `ServiceCard`
- Durante il caricamento: mostra fallback icona Lucide
- Se il fetch fallisce: fallback silenzioso all'icona Lucide (nessun errore visibile)
- I dati vengono salvati in state del componente

## Modifiche Dati

**`app/data/packages.ts`:**
- Aggiungere campo `lottie?: string` al type `ServiceCategory`
- Aggiungere il path ai dati di ogni categoria (es. `lottie: "/lottie/globe.json"`)
- Lasciare vuoto per ora — fallback icona Lucide si attiva. L'integrazione dei file Lottie reali e un task separato futuro.

## File da Modificare

- `app/components/ServicesOverview.tsx` — refactor: estrarre `ServiceCard` sub-componente, layout due colonne interne, Lottie con play/stop hover, effetto filter grayscale, IntersectionObserver per mobile
- `app/data/packages.ts` — aggiunta campo `lottie` al type e ai dati

## Verifica

1. `npm run dev` — card visibili con fallback icone Lucide ingrandite, monocromatiche
2. Hover su card (desktop): colori si accendono (filter transition), hover styles esistenti funzionano
3. Mobile: layout colonna singola, animazione a colori, autoplay quando visibile
4. Testare `prefers-reduced-motion`: animazione ferma, colori visibili
5. Quando file Lottie disponibili: sostituire path, verificare play/stop all'hover (task futuro)
6. `npm run build` — nessun errore
