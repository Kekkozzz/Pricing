# Navbar Scroll Shrink — Design Spec

## Context

La navbar attuale e fissa con effetto glassmorphism ma non reagisce allo scroll. L'obiettivo e renderla piu minimal e distintiva: quando l'utente scrolla oltre l'hero, la navbar si contrae progressivamente verso sinistra fino a diventare un quadrato flottante con un simbolo geometrico. Scrollando verso l'alto, si ri-espande.

## Approccio Scelto

**GSAP ScrollTrigger** — coerente con i pattern gia presenti nel progetto (CaseStudies parallax), supporto browser universale, animazione fluida legata allo scroll.

## Stati della Navbar

### 1. Espansa (default)
- Barra piena come oggi: logo a sinistra, link a destra, glassmorphism
- Attiva quando lo scroll e nella zona Hero

### 2. Contratta (quadrato flottante)
- Quadrato 48x48px, posizione flottante `top: 16px, left: 16px`
- Contiene un simbolo geometrico: `<div>` 12px quadrato ruotato 45deg (rombo) in accent color (`#c9b99a`)
- Background: `rgba(5,5,5, 0.8)` + `backdrop-blur-xl`
- Bordo: `1px solid var(--border)`, `border-radius: 16px`
- Leggera `box-shadow: 0 4px 12px rgba(0,0,0,0.3)` per profondita
- z-index: rimane `z-50` (invariato)

### 3. Ri-espansa su scroll-up
- Quando l'utente scrolla verso l'alto (sotto l'hero), la navbar si ri-espande con animazione tween (0.5s, `power3.inOut`)
- Quando riprende a scrollare giu, si ri-contrae

## ScrollTrigger Setup

- **Trigger element:** la sezione Hero — aggiungere `id="hero"` alla `<section>` in `Hero.tsx`
- **start:** `"top top"` — il trigger inizia quando il top dell'hero raggiunge il top del viewport
- **end:** `"bottom top"` — il trigger finisce quando il bottom dell'hero esce dal top del viewport
- **scrub:** `1` — animazione legata allo scroll con 1s di smoothing

## Timeline GSAP (scrub nella zona Hero)

L'animazione opera sull'elemento `<nav>` esterno. L'inner container `max-w-6xl` viene animato in larghezza insieme al nav padre.

| Scroll %  | Cosa succede                                                                 |
|-----------|------------------------------------------------------------------------------|
| 0% → 40%  | Link desktop sfumano in opacita (1 → 0) con stagger, gap si riduce         |
| 30% → 70% | Testo brand sfuma, larghezza navbar si riduce da 100% verso sinistra        |
| 60% → 90% | Border-bottom scompare, border-radius cresce a 16px, margini si aggiungono  |
| 80% → 100%| Simbolo geometrico (rombo div) appare (opacita 0 → 1), dimensione finale 48x48px |

## Scroll-up Detection (sotto l'Hero)

- `ScrollTrigger.onUpdate` legge `self.direction` (-1 = up, 1 = down)
- Threshold: 30px di scroll cumulativo nella stessa direzione prima di triggerare
- Sotto l'hero: toggle animato (non scrub) con `gsap.to()` durata 0.5s
- Nella zona hero: lo scrub originale gestisce tutto automaticamente
- **Navigazione programmatica:** quando si clicca un link nav, si setta un flag `isNavigating = true` che sopprime la direction detection. Il flag si resetta dopo il completamento dello smooth scroll (evento `scrollend` o timeout 1s)

## Accessibilita

- Quadrato contratto: `aria-label="Apri navigazione"`, `role="button"`, `tabIndex={0}`
- Keyboard: Enter/Space sul quadrato contratto espande la navbar
- Link nascosti nello stato contratto: `aria-hidden="true"`, `tabIndex={-1}`
- `prefers-reduced-motion`: se attivo, le animazioni GSAP vengono disabilitate e la navbar usa un toggle istantaneo (classe CSS) invece dello scrub

## Mobile

- L'hamburger menu svanisce durante lo shrink (stessa timeline dei link)
- Quadrato flottante contratto: tap ri-espande la navbar mostrando i link mobile (riutilizza lo stato `menuOpen` esistente, settandolo a `true`)
- Tap su un link: naviga alla sezione, poi la navbar si ri-contrae (setta `menuOpen = false` e triggera contrazione)
- Tap fuori dalla navbar ri-espansa: si ri-contrae (`menuOpen = false`)

## File da Modificare

- `app/components/Navbar.tsx` — refactor completo: refs, useEffect con GSAP ScrollTrigger, div rombo come simbolo, scroll-direction logic
- `app/components/Hero.tsx` — aggiungere `id="hero"` alla `<section>` root
- `app/globals.css` — eventuale aggiunta variabili CSS per dimensioni quadrato (se necessario)

## Scroll-padding-top

Quando la navbar e contratta, `scroll-padding-top: 6rem` in `globals.css` non serve piu (il quadrato flottante non copre il contenuto). Gestire con una CSS custom property su `<html>`:
- Stato espansa: `--scroll-pad: 6rem`
- Stato contratta: `--scroll-pad: 1rem`
- In `globals.css`: `scroll-padding-top: var(--scroll-pad, 6rem)`
- Il toggle avviene in JS quando cambia lo stato della navbar

## Note Implementative

- Cleanup: usare `gsap.context()` con `return () => ctx.revert()` nel useEffect (pattern gia usato in CaseStudies)
- `ScrollTrigger.refresh()` su resize del viewport (debounce 200ms)
- Il callback `onUpdate` non deve leggere il DOM oltre i valori forniti da GSAP per evitare layout thrashing
- Hamburger button: la CSS transition va scopata a `transition-transform` (non `transition-all`) per evitare conflitti con l'opacita animata da GSAP

## Verifica

1. `npm run dev` — testare visivamente:
   - Scrub progressivo nella zona hero (contrazione fluida)
   - Quadrato flottante con rombo accent visibile dopo l'hero
   - Ri-espansione su scroll-up, ri-contrazione su scroll-down
   - Click su link nav mentre contratto: naviga correttamente senza jitter
   - Mobile: hamburger scompare, tap su quadrato ri-espande con link
   - Tap fuori: ri-contrae
2. Testare a diversi viewport (specialmente intorno al breakpoint `md` 768px)
3. Testare navigazione da tastiera (Tab → quadrato → Enter → link visibili)
4. Testare con `prefers-reduced-motion` attivo
5. Verificare `scroll-padding-top` si adatti quando navbar e contratta
6. `npm run build` — nessun errore
