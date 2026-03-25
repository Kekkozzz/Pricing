# Configuratore Wizard Apple-Style

## Contesto

Sostituire la sezione pricing attuale (tabs + 3 card colonne) con un configuratore wizard step-by-step ispirato al checkout Apple. Layout split: pannello visivo sticky a sinistra che si aggiorna dinamicamente, step del wizard a destra con navigazione Avanti/Indietro.

## Layout Generale

Split orizzontale 45%/55% su desktop. Su mobile, il pannello sinistro diventa un header compatto fisso in alto con prezzo e servizio scelto, gli step occupano tutto lo schermo sotto.

### Pannello Sinistro (sticky)

Si aggiorna ad ogni step:
- **Step 1**: Placeholder "Di cosa hai bisogno?" + area prezzo vuota
- **Step 2**: Icona servizio + nome + prezzo tier selezionato
- **Step 3**: + mini-lista feature incluse con checkmark
- **Step 4**: + contatore add-on + prezzo totale aggiornato (base + ricorrente)
- **Step 5**: Riepilogo completo: servizio, tier, feature principali, add-on, prezzo totale

### Pannello Destro (wizard steps)

Progress dots in alto (5 pallini). Navigazione Avanti/Indietro in basso. Solo uno step visibile alla volta con transizione fade.

## I 5 Step

### Step 1 — Scegli il servizio

4 opzioni radio verticali, ognuna con:
- Icona Lucide (Globe, ShoppingBag, Zap, TrendingUp)
- Nome servizio
- Prezzo "a partire da"
- Radio button a destra

Click seleziona, poi "Avanti" per procedere.

Dati: `categories` da `app/data/packages.ts`

### Step 2 — Scegli il piano

3 opzioni radio verticali (Base/Pro/Premium) con:
- Nome tier
- Info rapida (es. "5-8 pagine · Custom · 5-7 giorni")
- Prezzo
- Badge "★" sul tier Pro

Dati: `categories[selected].tiers`

### Step 3 — Feature incluse

Lista read-only delle feature del tier scelto:
- Righe con nome feature a sinistra, valore a destra
- Valori booleani mostrati come ✓ (accent) o — (muted)
- Valori stringa mostrati come testo

Scopo: confermare al cliente cosa include il piano. Non è interattivo — è informativo.

Dati: `categories[selected].features` filtrate per il tier scelto

### Step 4 — Add-on opzionali

Lista checkbox verticale degli add-on disponibili per la categoria:
- Checkbox a sinistra
- Nome + descrizione breve
- Prezzo a destra
- Selezionati: bordo accent, sfondo accent/5, checkbox pieno
- Non selezionati: bordo muted, checkbox vuoto

Il prezzo totale nel pannello sinistro si aggiorna in tempo reale.

Dati: `categories[selected].addOns`

### Step 5 — Riepilogo e Contatto

Il pannello sinistro mostra il riepilogo finale completo.

Il pannello destro mostra i 4 canali di contatto:
1. **Form** — apre form inline (nome, email, telefono, messaggio) con pacchetto pre-compilato
2. **Prenota Call** — link Calendly esterno
3. **WhatsApp** — link wa.me con messaggio pre-compilato
4. **Email** — mailto con subject pre-compilato

Il bottone "Indietro" diventa "Modifica selezione" e torna allo Step 1.

## State Management

```
type WizardState = {
  currentStep: 1 | 2 | 3 | 4 | 5;
  selectedCategory: number | null;    // index in categories[]
  selectedTier: "base" | "pro" | "premium" | null;
  selectedAddOns: string[];           // addon names
};
```

State gestito con `useState` nel componente principale. Nessuna libreria esterna.

## File da Modificare/Creare

| File | Azione |
|---|---|
| `app/components/PricingSection.tsx` | Riscrivere completamente — diventa il wizard |
| `app/components/ContactHub.tsx` | Rimuovere (i contatti sono ora nello Step 5) |
| `app/page.tsx` | Rimuovere ContactHub, tenere solo il wizard come pricing + contatto |

## Transizioni

- Fade orizzontale tra step (CSS transition, opacity + translateX leggero)
- Il pannello sinistro si aggiorna con transizione fade verticale
- Progress dots: pallino pieno = completato/attivo, vuoto = futuro

## Responsive (Mobile)

- Il pannello sinistro diventa un header compatto sticky in alto:
  - Icona + nome servizio + prezzo totale su una riga
  - Progress dots sotto
- Gli step occupano tutta la larghezza sotto l'header
- Navigazione Avanti/Indietro come bottoni full-width in basso (sticky)

## Verifica

1. `npm run build` senza errori
2. Navigare tutti i 5 step selezionando diverse combinazioni
3. Verificare che il prezzo si aggiorna correttamente con add-on
4. Testare navigazione Avanti/Indietro (le selezioni si mantengono)
5. Testare i 4 canali contatto (form, Calendly, WhatsApp, email) con messaggi pre-compilati
6. Testare responsive mobile (header compatto + step full-width)
