# Pagine Dettaglio Servizi — Design Spec

## Contesto

Edizioni Duepuntozero ha 4 categorie di servizio (Siti Web, Shop & SaaS, Web App, Mobile App) presentate nel wizard configuratore, ma senza pagine descrittive dedicate. I clienti non hanno modo di approfondire i servizi prima di entrare nel wizard. Serve una landing page per ogni servizio che combini contenuto tecnico-funzionale e commerciale-persuasivo, con sezioni espandibili per tier.

**Target:** Mix PMI/professionisti + startup/tech — linguaggio accessibile con approfondimenti tecnici.

**Analisi competitor:** I prezzi attuali sono aggressivamente competitivi rispetto al mercato italiano (Web App €2.999 vs media €8.000+, Mobile App €3.999 vs media €10.000+). Il pricing trasparente è un forte differenziatore (solo ~15-20% delle agenzie italiane lo fa). Possibile revisione prezzi dopo implementazione.

---

## Architettura

### Route
```
/servizi/siti-web      → Siti Web
/servizi/shop-saas     → Shop & SaaS
/servizi/web-app       → Web App
/servizi/mobile-app    → Mobile App
```

### File Structure
```
app/
├── servizi/
│   ├── layout.tsx              # Layout condiviso servizi (navbar, footer)
│   ├── components/
│   │   ├── ServiceHero.tsx          # Hero riutilizzabile
│   │   ├── ProblemSolution.tsx      # Sezione problema/soluzione
│   │   ├── TierSelector.tsx         # Tab selector Base/Pro/Premium
│   │   ├── FeatureDeepDive.tsx      # Accordion feature
│   │   ├── UseCases.tsx             # Cards target/use case
│   │   ├── ProcessSteps.tsx         # Processo di lavoro (condiviso)
│   │   ├── ComparisonTable.tsx      # Tabella "Perché noi" (condiviso)
│   │   ├── AddOnsSection.tsx        # Add-on cards
│   │   ├── ServiceFAQ.tsx           # FAQ accordion
│   │   └── ServiceCTA.tsx           # CTA finale → wizard
│   ├── siti-web/
│   │   └── page.tsx
│   ├── shop-saas/
│   │   └── page.tsx
│   ├── web-app/
│   │   └── page.tsx
│   └── mobile-app/
│       └── page.tsx
```

### Dati
I dati di ogni servizio (testi, tier, feature, FAQ, use case) saranno definiti in `app/data/service-details.ts` — un file separato da `packages.ts` per evitare di appesantire il file esistente. I prezzi e le feature comparative restano in `packages.ts` (single source of truth per il wizard).

---

## Struttura Pagina (10 sezioni)

Ogni pagina servizio segue lo stesso template con contenuto specifico:

### 1. Hero
- Label numerata ("01 — Siti Web")
- Headline persuasiva con accent color
- Descrizione 1-2 righe
- CTA primaria → wizard configuratore
- Badge prezzo "Da €XXX"
- Animazione Lottie: stessi file JSON usati in ServicesOverview (`/Website.json`, `/Saas.json`, `/WebA.json`, `/Mobile.json`) ma renderizzati più grandi (max 300px) e senza effetto grayscale — colori pieni, autoplay loop

### 2. Problema / Soluzione
- Layout 2 colonne
- Colonna sx: 4 pain point con dati concreti (bold)
- Colonna dx: 4 soluzioni corrispondenti
- Tono: urgenza misurata, non allarmista

### 3. Tier Selector (Tab interattivi)
- 3 tab: Base / Pro / Premium
- Tab attivo mostra: nome, tagline, prezzo, descrizione, lista feature incluse
- Badge "Più scelto" sul tier Pro
- Ogni tab ha CTA → wizard pre-selezionato al tier corrispondente

### 4. Feature Deep-Dive (Accordion)
- Lista di tutte le feature con icona, nome e spiegazione dettagliata
- Ogni item si espande/collassa al click
- Indica in quale tier è disponibile la feature

### 5. Per Chi È (Use Cases)
- Grid 2x2 di card
- Ogni card: titolo target, descrizione, tier consigliato
- Specifico per servizio

### 6. Add-On
- Grid cards per ogni add-on del servizio
- Icona, nome, prezzo (con /mese o una tantum), descrizione breve

### 7. Come Lavoriamo (condiviso)
- 4 step: Briefing → Design → Sviluppo → Lancio
- Timeline visuale con numeri
- Stesso contenuto per tutti i servizi

### 8. Perché Noi (condiviso)
- Tabella comparativa: Noi vs Freelancer vs Grande Agenzia
- Righe: Prezzo, Preview AI, Tempi, Prezzo trasparente, Supporto
- Highlight colonna "Noi"

### 9. FAQ
- Accordion con 5-7 domande specifiche per servizio
- Risposte concise, orientate alla conversione

### 10. CTA Finale
- Headline, sottotitolo, bottone → wizard configuratore
- Gradient background subtle

---

## Contenuto per Servizio

### SITI WEB (`/servizi/siti-web`)

**Hero:**
- Label: "01 — Siti Web"
- Headline: "Il tuo sito web, chiavi in mano."
- Descrizione: "Siti responsive, veloci e ottimizzati per Google. Dal biglietto da visita digitale al sito corporate completo — design su misura, consegna in giorni, non mesi."
- Prezzo: "Da €499 · Consegna da 3 giorni"

**Problema/Soluzione:**
- Pain: 75% clienti giudica credibilità dal sito / sito lento perde 53% traffico mobile / senza SEO invisibile su Google / grandi agenzie chiedono €3.000-€15.000
- Soluzione: design premium accessibile / performance ottimizzate / SEO inclusa / consegna in 3-10 giorni

**Tier:**
- **Base €499** — "Il tuo biglietto da visita digitale" — Perfetto per chi inizia. 1-3 pagine, design template, responsive, form contatto, 1 revisione, 3-5 giorni.
- **Pro €999** — "Il sito che lavora per te" (Più scelto) — Design custom, 5-8 pagine, SEO base, CMS, Google Analytics, 3 revisioni, 5-7 giorni.
- **Premium €1.999** — "La tua presenza digitale definitiva" — Pagine illimitate, design premium su misura, SEO avanzata, blog, revisioni illimitate, 7-10 giorni.

**Feature Deep-Dive:**
- Design Responsive: adattamento automatico a ogni dispositivo, test su desktop/tablet/smartphone
- SEO On-Page: meta title, description, heading structure, alt text, sitemap XML, robots.txt, schema markup (Premium)
- CMS: gestione contenuti in autonomia (Pro/Premium)
- Google Analytics: GA4 con eventi chiave configurati (Pro/Premium)
- Blog: categorie, tag, ricerca, paginazione, content marketing (Premium)

**Use Cases:**
- Attività Locali (ristoranti, studi, negozi) → Base/Pro
- Professionisti & Freelancer (portfolio, personal branding) → Base/Pro
- Startup & MVP (landing page, validazione, lead) → Pro
- PMI & Aziende (corporate, blog aziendale, lead gen) → Premium

**Add-On:**
- Manutenzione €49/mese: aggiornamenti, backup settimanali, monitoraggio 24/7
- Hosting gestito €9/mese: server veloce, SSL, CDN, backup automatici
- Copywriting €199 una tantum: testi professionali e persuasivi per ogni pagina

**FAQ:**
1. Quanto tempo ci vuole? → Base 3-5gg, Pro 5-7gg, Premium 7-10gg (dall'approvazione design)
2. Cosa devo fornire? → Logo, testi (o add-on Copywriting), immagini, info attività
3. Posso aggiornare da solo? → Pro/Premium sì (CMS), Base richiede intervento
4. Dominio e hosting inclusi? → Dominio a carico cliente (~€10/anno), hosting add-on €9/mese
5. Se non mi piace il design? → Revisioni incluse + preview AI prima di iniziare
6. Come funziona il pagamento? → 50% ordine, 50% consegna

---

### SHOP & SAAS (`/servizi/shop-saas`)

**Hero:**
- Label: "02 — Shop & SaaS"
- Headline: "Vendi online, dal giorno uno."
- Descrizione: "Shop completo con pagamenti sicuri, checkout Stripe e area clienti. Dalla landing con checkout alla piattaforma SaaS completa."
- Prezzo: "Da €999 · Consegna da 5 giorni"

**Problema/Soluzione:**
- Pain: l'e-commerce italiano cresce del 13% annuo, chi non vende online perde quote / piattaforme come Shopify costano €300+/mese con personalizzazione limitata / integrare pagamenti è complesso e rischioso / gestire abbonamenti ricorrenti richiede infrastruttura
- Soluzione: shop pronto con Stripe integrato / proprietà totale della piattaforma / checkout sicuro PCI-compliant / abbonamenti e automazioni (Pro/Premium)

**Tier:**
- **Base €999** — "Inizia a vendere subito" — Landing page + checkout Stripe per fino a 3 prodotti. Email transazionali, 1 revisione, 5-7 giorni.
- **Pro €1.999** — "Il tuo shop completo" (Più scelto) — Shop fino a 20 prodotti, abbonamenti ricorrenti, area clienti base, coupon/sconti, 3 revisioni, 7-10 giorni.
- **Premium €3.999** — "La tua piattaforma SaaS" — Prodotti illimitati, area clienti avanzata, webhook e automazioni, coupon, revisioni illimitate, 10-15 giorni.

**Feature Deep-Dive:**
- Checkout Stripe: pagamenti sicuri, carte di credito/debito, Apple Pay, Google Pay, PCI DSS compliant
- Abbonamenti Ricorrenti: gestione piani, upgrade/downgrade, fatturazione automatica (Pro/Premium)
- Area Clienti: login, storico ordini, gestione profilo. Base: solo tracking. Avanzata: dashboard personalizzata (Premium)
- Coupon e Sconti: percentuale, importo fisso, scadenza, uso singolo/multiplo (Pro/Premium)
- Webhook e Automazioni: integrazione con CRM, email marketing, Zapier, custom workflows (Premium)
- Email Transazionali: conferma ordine, spedizione, fattura — template personalizzabili

**Use Cases:**
- Negozi Fisici che vanno online (prodotti fisici, ritiro in store) → Base/Pro
- Creatori Digitali (corsi, ebook, template, asset) → Pro
- Startup SaaS (abbonamenti, area clienti, automazioni) → Premium
- Aziende B2B (catalogo, preventivi, area riservata) → Pro/Premium

**Add-On:**
- Manutenzione €79/mese: aggiornamenti, monitoraggio, ottimizzazione performance
- Migrazione dati €499 una tantum: trasferimento catalogo, clienti e ordini dalla piattaforma attuale
- Formazione €299 una tantum: sessioni 1-on-1 per gestire la piattaforma in autonomia

**FAQ:**
1. Posso vendere prodotti digitali e fisici? → Sì, tutti i tier supportano entrambi
2. Come funzionano i pagamenti? → Stripe gestisce tutto: carte, wallet, addebiti. Ricevi i fondi sul tuo conto in 2-7 giorni
3. Posso migrare dal mio shop attuale? → Sì, con l'add-on Migrazione dati trasferiamo tutto
4. E le tasse/fatturazione? → Stripe calcola IVA automaticamente, integrazione con tool di fatturazione italiana
5. Quanti prodotti posso aggiungere dopo? → Entro i limiti del tier. Upgrade possibile in qualsiasi momento
6. È sicuro per i pagamenti? → Stripe è certificato PCI DSS Level 1 — lo standard più alto per la sicurezza pagamenti

---

### WEB APP (`/servizi/web-app`)

**Hero:**
- Label: "03 — Web App"
- Headline: "Digitalizza i tuoi processi."
- Descrizione: "Applicazioni web su misura con dashboard, autenticazione, notifiche e database ottimizzato. Dalla gestione interna alla piattaforma pubblica."
- Prezzo: "Da €2.999 · Consegna da 7 giorni"

**Problema/Soluzione:**
- Pain: fogli Excel e processi manuali costano ore ogni settimana / software generici non si adattano al tuo workflow / le grandi software house chiedono €20.000-€50.000+ / manutenzione e aggiornamenti sono un incubo senza supporto
- Soluzione: applicazione costruita sul tuo workflow / interfaccia intuitiva, zero formazione necessaria / prezzo trasparente e accessibile / supporto continuo e aggiornamenti inclusi

**Tier:**
- **Base €2.999** — "La tua prima web app" — Complessità semplice, fino a 100 utenti, autenticazione email/password, notifiche email, supporto email, 2 revisioni, 7-10 giorni.
- **Pro €5.999** — "Scala il tuo business" (Più scelto) — Complessità media, fino a 1.000 utenti, SSO/OAuth, dashboard, database ottimizzato, supporto prioritario, 5 revisioni, 10-15 giorni.
- **Premium Su preventivo** — "La soluzione enterprise" — Complessità elevata, utenti illimitati, autenticazione custom, dashboard avanzata, database scalabile, supporto dedicato, revisioni illimitate.

**Feature Deep-Dive:**
- Autenticazione: email/password (Base), SSO con Google/Microsoft/OAuth (Pro), sistemi custom con 2FA e RBAC (Premium)
- Dashboard: pannello con metriche, grafici e KPI personalizzati. Dati in tempo reale, export CSV/PDF (Pro/Premium)
- Database: PostgreSQL ottimizzato. Base: struttura standard. Pro: indici e query ottimizzate. Premium: sharding, replica, cache layer
- Notifiche: email transazionali (tutti), push notifications e notifiche in-app (Pro/Premium)
- API & Integrazioni: REST API documentata, webhook, integrazione con servizi terzi (Premium)

**Use Cases:**
- Gestione Interna (CRM, ticketing, inventario, prenotazioni) → Base/Pro
- Piattaforme Clienti (portali clienti, area riservata, reporting) → Pro
- Tool SaaS (applicazioni multi-tenant, billing, analytics) → Premium
- Automazione Processi (workflow, approvazioni, pipeline) → Pro/Premium

**Add-On:**
- Supporto dedicato €199/mese: assistenza prioritaria con SLA, canale diretto
- SLA 99.9% €149/mese: garanzia uptime con penali, monitoraggio proattivo
- Formazione team €499 una tantum: sessioni di training per tutto il team

**FAQ:**
1. Che tipo di web app potete realizzare? → Qualsiasi: CRM, gestionali, portali, piattaforme SaaS, tool interni. Partiamo dal tuo bisogno.
2. 100 utenti bastano? → Per il tier Base sì. Se cresci, l'upgrade a Pro (1.000 utenti) è semplice e senza downtime.
3. Posso integrare con i miei sistemi? → Pro: integrazioni standard (API, webhook). Premium: integrazioni custom con qualsiasi sistema.
4. Chi gestisce hosting e infrastruttura? → Noi, incluso nel servizio. Deploy su cloud con scaling automatico.
5. Come funziona il supporto? → Base: email (48h). Pro: prioritario (24h). Premium: dedicato con canale diretto.
6. E se ho bisogno di funzionalità aggiuntive dopo? → Sviluppo incrementale disponibile. Ogni feature aggiuntiva ha un preventivo separato.

---

### MOBILE APP (`/servizi/mobile-app`)

**Hero:**
- Label: "04 — Mobile App"
- Headline: "La tua app, su ogni schermo."
- Descrizione: "Applicazioni mobile native e cross-platform con design intuitivo, push notification e pubblicazione sugli store. iOS e Android, un unico investimento."
- Prezzo: "Da €3.999 · Consegna da 10 giorni"

**Problema/Soluzione:**
- Pain: gli utenti passano il 90% del tempo mobile nelle app, non nel browser / sviluppare per iOS E Android separatamente costa il doppio / pubblicare sugli store è un processo burocratico complesso / mantenere un'app aggiornata con ogni versione OS è costoso
- Soluzione: un'unica codebase per iOS e Android (Base) o nativa pura (Pro/Premium) / pubblicazione store gestita da noi / design UI/UX che segue le linee guida Apple e Google / manutenzione e aggiornamenti OS disponibili

**Tier:**
- **Base €3.999** — "La tua prima app" — Cross-platform (iOS + Android), complessità semplice, design template, push notification, pubblicazione store, 2 revisioni, 10-15 giorni.
- **Pro €7.999** — "L'app professionale" (Più scelto) — Nativa iOS + Android, complessità media, design custom UI/UX, modalità offline, autenticazione SSO/biometrica, API backend avanzata, 5 revisioni, 15-25 giorni.
- **Premium Su preventivo** — "L'app che cambia il gioco" — Nativa, complessità elevata, design premium su misura, autenticazione custom, API scalabile, revisioni illimitate.

**Feature Deep-Dive:**
- Cross-platform vs Nativa: Cross-platform (React Native/Flutter) = un codice, due piattaforme, costi ridotti. Nativa = performance massime, accesso completo a tutte le API del dispositivo (Pro/Premium)
- Push Notification: notifiche personalizzate, segmentazione utenti, scheduling, deep linking (tutti i tier)
- Modalità Offline: l'app funziona anche senza connessione, sincronizzazione automatica al ritorno online (Pro/Premium)
- Autenticazione: email/social login (Base), SSO/biometrica Face ID/Touch ID (Pro), sistemi custom (Premium)
- Pubblicazione Store: gestiamo tutto il processo di submission su App Store e Google Play, inclusi screenshot, descrizioni e metadata
- API Backend: endpoint REST per comunicazione app-server. Base: standard. Pro: ottimizzata con caching. Premium: scalabile con load balancing

**Use Cases:**
- App Vetrina/Companion (estensione del sito/shop, catalogo mobile) → Base
- App di Servizio (prenotazioni, ordini, delivery, loyalty program) → Pro
- App Core Business (la tua app È il prodotto — social, marketplace, tool) → Premium
- App Interne (comunicazione team, field service, reporting mobile) → Pro

**Add-On:**
- Manutenzione app €149/mese: aggiornamenti OS, bug fix, monitoraggio crash, ottimizzazione performance
- Analytics integrato €399 una tantum: dashboard analytics con metriche utenti, sessioni, retention, funnel
- Formazione team €499 una tantum: training per gestire contenuti e aggiornamenti dell'app

**FAQ:**
1. Meglio cross-platform o nativa? → Cross-platform (Base) è perfetta per app semplici, costa meno e si sviluppa più velocemente. Nativa (Pro/Premium) per performance critiche, animazioni complesse o accesso hardware avanzato.
2. Quanto costa pubblicare sugli store? → Apple Developer Program: €99/anno. Google Play: €25 una tantum. La pubblicazione è gestita da noi.
3. Posso aggiornare i contenuti dell'app? → Sì, con un CMS backend puoi modificare testi e immagini senza rilasciare nuove versioni.
4. L'app funziona su tutti i telefoni? → Supportiamo iOS 15+ e Android 10+, coprendo il 95%+ dei dispositivi attivi.
5. Come gestite gli aggiornamenti iOS/Android? → Con l'add-on Manutenzione, aggiorniamo l'app ad ogni major release OS (iOS 18, Android 15, ecc.).
6. Quanto tempo per un aggiornamento dell'app? → Bug fix: 24-48h. Nuove feature: preventivo separato con timeline dedicata.

---

## Sezioni Condivise

### Come Lavoriamo (tutte le pagine)
4 step identici:
1. **Briefing** — Call conoscitiva 30 minuti: capiamo il tuo business, obiettivi e requisiti
2. **Design** — Mockup e prototipo: vedi il risultato prima dello sviluppo, con revisioni incluse
3. **Sviluppo** — Codice pulito e testato: costruiamo la soluzione con tecnologie moderne
4. **Lancio** — Deploy e supporto: mettiamo online, testiamo tutto e ti affianchiamo nei primi giorni

### Perché Noi vs Alternative (tutte le pagine)

| Aspetto | Edizioni 2.0 | Freelancer | Grande Agenzia |
|---------|-------------|------------|----------------|
| Prezzo | Trasparente, fisso | Variabile | €3.000-€50.000+ |
| Preview AI | ✓ (unici in Italia) | ✗ | ✗ |
| Tempi | 3-25 giorni | 7-60 giorni | 30-180 giorni |
| Prezzo pubblico | ✓ | A volte | ✗ (solo preventivo) |
| Supporto post-lancio | Incluso/add-on | Limitato | A pagamento |
| Wizard configuratore | ✓ | ✗ | ✗ |

### CTA Finale (tutte le pagine)
- Headline: "Pronto a partire?"
- Sottotitolo: "Configura il tuo pacchetto in 2 minuti con il nostro wizard interattivo."
- CTA: "Configura ora →" (link a `/#pricing` con servizio pre-selezionato)

---

## Navigazione & SEO

### Navbar Update
Modificare `Navbar.tsx` per aggiungere voce "Servizi" con dropdown menu:
- Trigger: hover su desktop, click su mobile
- 4 voci: Siti Web (`/servizi/siti-web`), Shop & SaaS (`/servizi/shop-saas`), Web App (`/servizi/web-app`), Mobile App (`/servizi/mobile-app`)
- Dropdown: glassmorphism background (coerente col design esistente), stagger fadeUp per le voci
- Active state: evidenziare la voce corrente quando si è su una pagina servizio (match pathname)
- Mobile: nel menu hamburger, le 4 voci appaiono come sotto-lista indentata sotto "Servizi"

### SEO per pagina
Ogni pagina avrà:
- Meta title: "{Servizio} — Prezzi e Pacchetti | Edizioni Duepuntozero"
- Meta description specifica per servizio
- Open Graph tags
- Schema markup (Service, Offer, FAQPage)
- Breadcrumb: Home > Servizi > {Servizio}

### Link interni
- **ServicesOverview cards:** modificare `ServicesOverview.tsx` per linkare a `/servizi/{id}` invece di `#pricing` con custom event. Rimuovere il dispatch di `service-selected` event dal click della card.
- **Tier CTA → wizard:** modificare `PricingSection.tsx` per accettare query params `service` e `tier` dall'URL. All'init del wizard, parsare `window.location.search` per `service` (slug: `siti-web`, `shop-saas`, `web-app`, `mobile-app`) e `tier` (slug: `base`, `pro`, `premium`). Se presenti, auto-selezionare il servizio corrispondente (step 1) e il tier (step 2), avanzando direttamente allo step 3.
- **Tier "Su preventivo":** per Web App Premium e Mobile App Premium (prezzo custom), il CTA del tier non linka al wizard ma a `/#contatti` (sezione contatto) con un messaggio pre-compilato che indica il servizio e tier richiesto.

---

## Design System

Seguire al 100% il design system esistente:
- Background: `#050505`, foreground: `#e8e4df`, accent: `#c9b99a`
- Font: Instrument Serif (display), Geist (body), Geist Mono (label/tag)
- Pattern: noise overlay, stagger fadeUp animations, glassmorphism dove appropriato
- Componenti: `"use client"` per tutto ciò che è interattivo (tab, accordion, animazioni)

Usare la skill `/frontend-design` per l'implementazione dei componenti.

---

## Verifica

1. **Build:** `npm run build` deve passare senza errori
2. **Navigazione:** verificare che ogni route `/servizi/*` carichi correttamente
3. **Responsive:** testare su mobile (375px), tablet (768px), desktop (1440px)
4. **Tab/Accordion:** verificare interattività dei tier selector e feature accordion
5. **Link al wizard:** verificare che i CTA portino al wizard con servizio/tier pre-selezionato
6. **SEO:** verificare meta tag e schema markup con Lighthouse
7. **Performance:** Lighthouse score > 90 per ogni pagina
8. **Animazioni:** verificare stagger fadeUp e smooth scroll
