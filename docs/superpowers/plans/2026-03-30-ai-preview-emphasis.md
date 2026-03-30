# AI Preview Emphasis Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Communicate the AI preview feature as an exclusive competitive advantage across all site touchpoints.

**Architecture:** Additive changes only — micro-interventions in 3 existing components, 1 new Server Component (AIShowcase), and data additions in service-details.ts. No backend changes.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind CSS 4, next/image

**Spec:** `docs/superpowers/specs/2026-03-30-ai-preview-emphasis-design.md`

---

## File Structure

| File | Action | Responsibility |
| --- | --- | --- |
| `app/components/Hero.tsx` | Modify | Add AI badge between subtitle and CTAs |
| `app/components/ServicesOverview.tsx` | Modify | Add "Preview AI inclusa" line in ServiceCard |
| `app/data/service-details.ts` | Modify | Update priceLabels + add FAQ entries |
| `app/components/AIShowcase.tsx` | Create | New dedicated homepage section |
| `app/page.tsx` | Modify | Import and place AIShowcase |

---

### Task 1: Hero Badge

**Files:**
- Modify: `app/components/Hero.tsx:33-37`

- [ ] **Step 1: Add AI badge between subtitle paragraph and CTA buttons**

Insert after the `<p>` subtitle (line 37, after `mb-10`), before the CTA `<div>`:

```tsx
<p className="animate-fade-up stagger-4 text-[10px] uppercase tracking-[0.35em] text-accent font-mono mb-8">
  ✦ Preview AI inclusa — vedi il tuo progetto prima di iniziare
</p>
```

Update the CTA div stagger class from `stagger-4` to `stagger-5`:

```tsx
<div className="animate-fade-up stagger-5 flex flex-col sm:flex-row gap-4">
```

Update the Lottie container stagger class from `stagger-5` to `stagger-6` to avoid collision:

```tsx
<div className="animate-fade-up stagger-6" aria-hidden="true" role="presentation">
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds, no errors.

- [ ] **Step 3: Commit**

```bash
git add app/components/Hero.tsx
git commit -m "feat: add AI preview badge to homepage hero"
```

---

### Task 2: ServiceCard Badge

**Files:**
- Modify: `app/components/ServicesOverview.tsx:105-107`

- [ ] **Step 1: Add "Preview AI inclusa" line in ServiceCard**

In the ServiceCard component, after the price line (`da {cat.startingPrice}`), add:

```tsx
<p className="text-[10px] uppercase tracking-[0.2em] text-accent font-mono mb-4">
  Preview AI inclusa
</p>
```

Reduce the `mb-6` on the price `<p>` to `mb-2` so the new line sits between price and "Vedi pacchetti" with proper spacing.

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add app/components/ServicesOverview.tsx
git commit -m "feat: add AI preview badge to service cards"
```

---

### Task 3: Price Labels + FAQ

**Files:**
- Modify: `app/data/service-details.ts:89,265,445,618` (priceLabels)
- Modify: `app/data/service-details.ts:220-251,402-432,576-605,756-787` (FAQ arrays)

- [ ] **Step 1: Update priceLabel for all 4 services**

```
Siti Web:    "Da €499 · Consegna da 3 giorni · Preview AI inclusa"
Shop & SaaS: "Da €999 · Consegna da 5 giorni · Preview AI inclusa"
Web App:     "Da €2.999 · Consegna da 7 giorni · Preview AI inclusa"
Mobile App:  "Da €3.999 · Consegna da 10 giorni · Preview AI inclusa"
```

- [ ] **Step 2: Add 7th FAQ to each service**

Append to each service's `faq` array:

**Siti Web:**
```ts
{
  question: "Posso vedere un'anteprima del mio sito prima di iniziare?",
  answer:
    "Sì. Durante la configurazione del pacchetto, puoi generare una preview AI personalizzata. Descrivi la tua attività, scegli lo stile e i colori — e vedrai un mockup del tuo sito in pochi secondi. Incluso in tutti i pacchetti.",
},
```

**Shop & SaaS:**
```ts
{
  question: "Posso vedere un'anteprima della mia piattaforma prima di iniziare?",
  answer:
    "Sì. Durante la configurazione del pacchetto, puoi generare una preview AI personalizzata. Descrivi la tua attività, scegli lo stile e i colori — e vedrai un mockup della tua piattaforma in pochi secondi. Incluso in tutti i pacchetti.",
},
```

**Web App:**
```ts
{
  question: "Posso vedere un'anteprima della mia web app prima di iniziare?",
  answer:
    "Sì. Durante la configurazione del pacchetto, puoi generare una preview AI personalizzata. Descrivi il tuo progetto, scegli lo stile e i colori — e vedrai un mockup della tua web app in pochi secondi. Incluso in tutti i pacchetti.",
},
```

**Mobile App:**
```ts
{
  question: "Posso vedere un'anteprima della mia app prima di iniziare?",
  answer:
    "Sì. Durante la configurazione del pacchetto, puoi generare una preview AI personalizzata. Descrivi il tuo progetto, scegli lo stile e i colori — e vedrai un mockup della tua app in pochi secondi. Incluso in tutti i pacchetti.",
},
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: Build succeeds. Service pages prerender without errors.

- [ ] **Step 4: Commit**

```bash
git add app/data/service-details.ts
git commit -m "feat: add AI preview to price labels and FAQ for all services"
```

---

### Task 4: AIShowcase Component

**Files:**
- Create: `app/components/AIShowcase.tsx`

- [ ] **Step 1: Create AIShowcase Server Component**

Use the /frontend-design skill for this component. Create `app/components/AIShowcase.tsx`:

**Prerequisite:** L'utente deve fornire `public/ai-showcase.png` (mockup di esempio). Se il file non esiste, il componente non renderizza nulla.

```tsx
import fs from "fs";
import path from "path";
import Image from "next/image";

export default function AIShowcase() {
  const imageExists = fs.existsSync(path.join(process.cwd(), "public", "ai-showcase.png"));
  if (!imageExists) return null;

  return (
    <section className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Copy */}
          <div>
            <p className="animate-fade-up stagger-1 text-[10px] uppercase tracking-[0.35em] text-accent mb-4 font-mono">
              ✦ Solo da noi
            </p>
            <h2 className="animate-fade-up stagger-2 font-display text-3xl md:text-4xl tracking-tight mb-6">
              Vedi il tuo sito{" "}
              <em className="text-accent">prima di iniziarlo.</em>
            </h2>
            <p className="animate-fade-up stagger-3 text-muted text-base leading-relaxed max-w-md mb-8">
              Configura il pacchetto, descrivi la tua attività e genera un
              mockup personalizzato in tempo reale. Nessun impegno, nessun
              costo aggiuntivo. Solo noi lo offriamo.
            </p>
            <div className="animate-fade-up stagger-4">
              <a
                href="#pricing"
                className="group inline-flex items-center justify-center gap-2 bg-foreground text-background px-7 py-3.5 text-sm font-medium tracking-wide hover:bg-accent hover:text-background transition-all duration-300"
              >
                Prova ora
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </a>
            </div>
          </div>

          {/* Mockup */}
          <div className="animate-fade-up stagger-5">
            <p className="text-[10px] uppercase tracking-[0.2em] text-accent font-mono mb-3">
              Generato in 30 secondi
            </p>
            <div className="hover:scale-[1.02] transition-transform duration-500 hover:shadow-[0_8px_30px_rgba(201,185,154,0.08)]">
              {/* Browser frame bar */}
              <div className="bg-surface/40 border border-border border-b-0 rounded-t px-4 py-2.5 flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-muted/30" />
                  <div className="w-2.5 h-2.5 rounded-full bg-muted/30" />
                  <div className="w-2.5 h-2.5 rounded-full bg-muted/30" />
                </div>
                <span className="text-[10px] text-muted font-mono">
                  tuosito.it
                </span>
              </div>
              {/* Browser frame content */}
              <div className="rounded-b border border-border overflow-hidden">
                <Image
                  src="/ai-showcase.png"
                  alt="Preview AI generata per un sito di esempio"
                  width={1440}
                  height={900}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-border to-transparent" />
    </section>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds (image 404 warning is OK until asset is provided).

- [ ] **Step 3: Commit**

```bash
git add app/components/AIShowcase.tsx
git commit -m "feat: create AIShowcase homepage section component"
```

---

### Task 5: Wire AIShowcase into Homepage

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Import and place AIShowcase between CaseStudies and PricingSection**

```tsx
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ServicesOverview from "./components/ServicesOverview";
import CaseStudies from "./components/CaseStudies";
import AIShowcase from "./components/AIShowcase";
import PricingSection from "./components/PricingSection";
import ContactHub from "./components/ContactHub";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ServicesOverview />
        <CaseStudies />
        <AIShowcase />
        <PricingSection />
        <ContactHub />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds. Homepage prerenders with new section.

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat: add AIShowcase section to homepage"
```

---

### Task 6: Final Verification

- [ ] **Step 1: Full build check**

Run: `npm run build`
Expected: Clean build, no warnings related to our changes.

- [ ] **Step 2: Visual verification checklist**

- Homepage hero: badge `✦ Preview AI inclusa` visible between subtitle and CTAs
- Homepage service cards: "Preview AI inclusa" visible under each price
- Homepage AIShowcase section: visible between Case Studies and Pricing
- Service pages (`/servizi/siti-web`, `/servizi/shop-saas`, `/servizi/web-app`, `/servizi/mobile-app`): priceLabel shows "Preview AI inclusa", 7th FAQ visible
- Responsive: check 375px, 768px, 1024px+
