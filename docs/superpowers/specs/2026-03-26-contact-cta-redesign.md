# ContactHub CTA Redesign — Design Spec

## Context

La sezione contatti attuale duplica il form presente nello step 6 del wizard pricing. I 4 canali di contatto in griglia 2x2 sono piatti e non creano impatto emotivo. L'obiettivo e trasformarla in un closer persuasivo con testimonial e CTA prominenti.

## Layout

Tutto centrato (`text-center`, `max-w-3xl mx-auto`), struttura verticale:

1. **Headline** — font-display, text-4xl md:text-5xl, tracking-tight
2. **Sottotitolo** — text-muted, text-base md:text-lg, una riga
3. **Testimonial carousel** — una citazione alla volta, crossfade ogni 5s
4. **Dot indicators** — cerchietti sotto il testimonial, attivo in accent, cliccabili
5. **CTA row** — due bottoni affiancati centrati:
   - Primario: "Configura il tuo pacchetto ->" → #pricing (bg-foreground)
   - Secondario: "Scrivici su WhatsApp" → wa.me link (border)

## Testimonial Carousel

**Dati:** array di 3-4 testimonial placeholder dentro il componente:

```
{ quote: string, name: string, role: string }
```

**Meccanica:**
- State `activeIndex`, cicla ogni 5s via `setInterval` con cleanup nel useEffect
- Crossfade CSS: `transition-opacity duration-700`, testimonial attivo `opacity-1`, altri `opacity-0`
- Container a altezza fissa per evitare layout shift
- Virgolette decorative grandi in accent/10 come sfondo dietro la citazione
- Sotto la citazione: nome e ruolo in text-xs text-muted

**Dot indicators:**
- Cerchietti piccoli (8px), default border-border, attivo bg-accent
- Click su dot: setta `activeIndex`, resetta il timer setInterval
- Transition colore duration-300

**`prefers-reduced-motion`:** cambio istantaneo (nessuna transition opacity).

## Codice da Rimuovere

- State: `formData`, `formStatus`, `showForm`, `selectedPackage`
- useEffect per `package-selected` event listener
- useEffect per smooth scroll al form
- Funzione `easeInOutCubic`, `handleSubmit`
- Array `channels`
- JSX: canali griglia, form inline, riepilogo pacchetto
- Import: `FileText`, `Calendar`, `MessageCircle`, `Mail` da lucide-react
- Import: `useState` per formData (mantenere per activeIndex)

## File da Modificare

- `app/components/ContactHub.tsx` — riscrittura completa

Nessun altro file cambia.

## Verifica

1. `npm run dev` — headline, testimonial carousel con crossfade, due CTA visibili
2. Auto-rotate ogni 5s con crossfade
3. Click dot: cambia testimonial, timer si resetta
4. CTA primario: scrolla a #pricing
5. CTA secondario: apre WhatsApp
6. `prefers-reduced-motion`: cambio istantaneo
7. `npm run build` — nessun errore
