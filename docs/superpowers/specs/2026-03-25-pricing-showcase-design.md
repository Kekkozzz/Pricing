# Pricing Showcase — Edizioni Duepuntozero

## Contesto

Edizioni Duepuntozero (digital company nel settore editoriale/legale con sede a Roma e Molfetta) necessita di un sito standalone per presentare i pacchetti di servizi web ai clienti. Il sito serve sia come strumento di vendita durante meeting che come pagina pubblica raggiungibile autonomamente. Il target è un mix di PMI e medie aziende.

## Decisioni di Design

### Struttura: Hybrid Single-Page con Tabs

Una singola pagina con scroll verticale organizzata in sezioni. La sezione pricing usa tabs per switchare tra le 4 categorie di servizi. Questo bilancia la semplicità di navigazione (utile nelle presentazioni) con l'organizzazione per categoria (necessaria per 4 tipi di servizi diversi).

### Identità Visiva

- **Palette**: Nero/bianco minimalista, coerente col brand esistente (edizioniduepuntozero.it)
- **Font**: Geist Sans/Mono (già configurati nel progetto Next.js)
- **Tono**: Professionale, diretto, orientato alla trasparenza dei prezzi

### Stack Tecnico

- Next.js 16.2.1 (App Router)
- Tailwind CSS v4
- TypeScript
- Nessun backend necessario (contenuto statico, form via servizio esterno)

---

## Sezioni della Pagina

### 1. Navbar

Navbar fissa in alto, sfondo nero.

- **Sinistra**: Logo/nome "edizioniduepuntozero"
- **Destra**: Link anchor alle sezioni (Servizi, Pricing, Contatti)
- Comportamento sticky con blur su scroll

### 2. Hero — Split con Social Proof

Layout a due colonne su desktop, stack su mobile.

**Colonna sinistra:**
- Label "Servizi Web & Digitali" (uppercase, small, muted)
- Heading principale: titolo che comunica la value proposition
- Sottotitolo: 1-2 righe di descrizione
- CTA primario: "Scopri i pacchetti" (bottone bianco su nero) → scroll a pricing
- CTA secondario: "Parla con noi" (bottone outline) → scroll a contatti

**Colonna destra:**
- Griglia 2x2 di stat card con numeri chiave:
  - Progetti completati
  - Aree di servizio
  - Prezzi trasparenti (100%)
  - Tempo di risposta garantito (24h)
- Sfondo leggermente più chiaro delle card (rgba bianco)

### 3. Overview Servizi — Grid con Prezzi

Sfondo bianco/chiaro per contrasto con la hero.

- Titolo sezione: "Cosa possiamo fare per te"
- Griglia 2x2 (desktop) / 1 colonna (mobile)
- Ogni card contiene:
  - Icona del servizio
  - Nome: Siti Web / E-commerce / Web App / SEO & Marketing
  - Descrizione breve (1-2 righe)
  - Prezzo "a partire da" (es. "da €499")
- Click sulla card → scroll alla sezione pricing con il tab corrispondente pre-selezionato

### 4. Pricing — Card 3 Colonne con Tabs

Sfondo nero. Sezione principale del sito.

**Tabs di navigazione:**
- Barra con 4 tabs: Siti Web | E-commerce | Web App | SEO & Marketing
- Tab attivo: sfondo bianco, testo nero
- Tab inattivo: trasparente, testo muted
- Transizione animata al cambio tab

**Per ogni tab, 3 pricing card affiancate:**

Struttura di ogni card:
- Nome tier (es. Base / Pro / Premium)
- Prezzo (grande, in evidenza)
- Frequenza (es. "una tantum" o "/mese")
- Lista feature con ✓ (incluso) e ✗ (non incluso)
- CTA button → scroll a contatti con pacchetto pre-selezionato

La card centrale (Pro) è evidenziata:
- Badge "POPOLARE" in alto
- Bordo più visibile
- CTA con sfondo pieno (bianco)

**Contenuto dei pacchetti per categoria:**

#### Siti Web
| | Base | Pro | Premium |
|---|---|---|---|
| Pagine | 1-3 | 5-8 | Illimitate |
| Design | Template | Custom | Premium |
| Responsive | ✓ | ✓ | ✓ |
| Form contatto | ✓ | ✓ | ✓ |
| SEO | — | Base | Avanzata |
| Blog | — | — | ✓ |
| CMS | — | — | ✓ |

#### E-commerce
| | Base | Pro | Premium |
|---|---|---|---|
| Prodotti | Fino a 50 | Fino a 500 | Illimitati |
| Design | Template | Custom | Premium |
| Pagamenti | Stripe | Stripe + PayPal | Multi-gateway |
| Gestione ordini | Base | Avanzata | Completa |
| Inventario | — | ✓ | ✓ |
| Multi-lingua | — | — | ✓ |
| Prezzo | €1.499 | €2.999 | €4.999 |

#### Web App
| | Base | Pro | Premium |
|---|---|---|---|
| Complessità | Semplice | Media | Elevata |
| Utenti | Fino a 100 | Fino a 1.000 | Illimitati |
| Integrazioni API | 1 | Fino a 3 | Illimitate |
| Autenticazione | Base | SSO | Custom |
| Dashboard | — | ✓ | ✓ |
| Supporto | Email | Prioritario | Dedicato |
| Prezzo | €2.999 | €5.999 | Su preventivo |

#### SEO & Marketing
| | Base | Pro | Premium |
|---|---|---|---|
| Audit SEO | ✓ | ✓ | ✓ |
| Ottimizzazione on-page | ✓ | ✓ | ✓ |
| Content strategy | — | ✓ | ✓ |
| Social media | — | 2 canali | 4 canali |
| Report | Trimestrale | Mensile | Settimanale |
| Campagne ads | — | — | ✓ |
| Prezzo | €299/mese | €599/mese | €999/mese |

> Nota: i prezzi e le feature sono placeholder dimostrativi. Il cliente definirà i valori finali prima del go-live. La struttura 3-tier e il data model restano identici.

**Add-on (sotto le card):**
- Sezione con bordo tratteggiato
- Label "Add-on opzionali"
- Chips/tags con nome add-on e prezzo (es. "Manutenzione +€49/mese", "Hosting +€9/mese", "Copywriting +€199")
- Gli add-on sono specifici per categoria e cambiano con i tabs

### 5. Contatto — Hub con Riepilogo

Sfondo nero. Ultima sezione prima del footer.

**Riepilogo pacchetto (in alto):**
- Card con bordo sottile che mostra:
  - Categoria e tier selezionati (es. "Siti Web — Pro")
  - Add-on selezionati
  - Prezzo totale
- Visibile solo se il cliente ha cliccato un CTA dalla sezione pricing
- Se nessun pacchetto selezionato, mostra un messaggio generico

**4 canali di contatto (griglia 2x2):**

1. **Form di contatto** — Icona 📝, "Ti ricontattiamo noi"
   - Apre un modal/sezione con form (nome, email, telefono, messaggio)
   - Include il pacchetto selezionato come campo nascosto
   - Submission via Formspree (URL configurabile in `app/data/config.ts`). In development, log a console come fallback.
2. **Prenota Call** — Icona 📅, "Scegli data e ora"
   - Link esterno a Calendly (URL configurabile in `app/data/config.ts`)
3. **WhatsApp** — Icona 💬, "Risposta immediata"
   - Link wa.me con messaggio pre-compilato col pacchetto scelto (numero configurabile in `app/data/config.ts`)
4. **Email** — Icona ✉️, "Con riepilogo pacchetto"
   - Mailto con subject e body pre-compilati (indirizzo configurabile in `app/data/config.ts`)

### 6. Footer

Minimale, sfondo nero.
- Logo/nome azienda
- P.IVA e info legali
- Link privacy policy
- Copyright

---

## Comportamenti Interattivi

### Selezione pacchetto
- Il cliente clicca "Scegli" su una pricing card → il pacchetto viene memorizzato nello state
- Scroll automatico alla sezione contatto
- Il riepilogo si aggiorna con il pacchetto selezionato
- I link WhatsApp e email si aggiornano con il messaggio pre-compilato

### Tab switching
- Click su un tab nella sezione pricing → le card cambiano con transizione fade/slide
- Click su una card servizi nella sezione overview → scroll a pricing con tab pre-selezionato

### Responsive
- **Desktop (≥1024px)**: Layout completo, card affiancate, split hero
- **Tablet (768-1023px)**: Card pricing in colonna, hero stack
- **Mobile (<768px)**: Tutto in colonna singola, navbar hamburger

---

## File da Creare/Modificare

| File | Scopo |
|---|---|
| `app/layout.tsx` | Aggiornare metadata, font, tema colori |
| `app/globals.css` | Custom CSS variables, tema nero/bianco |
| `app/page.tsx` | Pagina principale con tutte le sezioni |
| `app/components/Navbar.tsx` | Navbar sticky |
| `app/components/Hero.tsx` | Hero split con social proof |
| `app/components/ServicesOverview.tsx` | Griglia servizi con prezzi |
| `app/components/PricingSection.tsx` | Tabs + card pricing + add-on |
| `app/components/ContactHub.tsx` | Hub contatto con riepilogo |
| `app/components/Footer.tsx` | Footer minimale |
| `app/data/packages.ts` | Dati dei pacchetti (prezzi, feature, add-on) |
| `app/data/config.ts` | URL configurabili (Formspree, Calendly, WhatsApp, email) |

---

## Verifica

1. `npm run dev` — il sito si avvia senza errori
2. Navigare tutte le sezioni e verificare il layout
3. Testare il tab switching nella sezione pricing
4. Testare il flusso selezione pacchetto → scroll a contatti → riepilogo aggiornato
5. Testare responsive su mobile/tablet (DevTools)
6. Verificare che i link WhatsApp e mailto generino messaggi corretti
7. `npm run build` — build di produzione senza errori
