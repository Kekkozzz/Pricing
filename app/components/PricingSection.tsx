"use client";

import { useState, useEffect, useRef } from "react";
import {
  Globe,
  ShoppingBag,
  Zap,
  TrendingUp,
  FileText,
  Calendar,
  MessageCircle,
  Mail,
} from "lucide-react";
import { categories } from "../data/packages";
import type { ServiceCategory, Tier } from "../data/packages";
import { siteConfig } from "../data/config";
import WizardScene from "./WizardScene";
import AIPreviewStep from "./AIPreviewStep";

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

const iconMap: Record<string, React.ReactNode> = {
  globe: <Globe size={20} strokeWidth={1.5} />,
  "shopping-bag": <ShoppingBag size={20} strokeWidth={1.5} />,
  zap: <Zap size={20} strokeWidth={1.5} />,
  "trending-up": <TrendingUp size={20} strokeWidth={1.5} />,
};

type TierKey = "base" | "pro" | "premium";

function ProgressBar({ current }: { current: number }) {
  return (
    <div className="flex gap-1.5 mb-8">
      {[1, 2, 3, 4, 5, 6].map((s) => (
        <div
          key={s}
          className={`flex-1 h-0.5 rounded-full transition-all duration-700 ${
            s <= current ? "bg-accent" : "bg-border"
          }`}
        />
      ))}
    </div>
  );
}

function FeatureValue({ value }: { value: string | boolean }) {
  if (value === true) return <span className="text-accent">✓</span>;
  if (value === false) return <span className="text-muted/40">—</span>;
  return <span>{value}</span>;
}

export default function PricingSection() {
  const [step, setStep] = useState(1);
  const [catIndex, setCatIndex] = useState<number | null>(null);
  const [tierKey, setTierKey] = useState<TierKey | null>(null);
  const [addOns, setAddOns] = useState<string[]>([]);
  const [transitioning, setTransitioning] = useState(false);
  const [slideDir, setSlideDir] = useState<"left" | "right">("left");
  const stepRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const handler = (e: Event) => {
      const index = (e as CustomEvent).detail as number;
      setCatIndex(index);
      setTierKey(null);
      setAddOns([]);
      setSlideDir("left");
      setTransitioning(true);
      timeoutId = setTimeout(() => {
        setStep(2);
        setTransitioning(false);
      }, 200);
    };

    window.addEventListener("service-selected", handler);

    return () => {
      window.removeEventListener("service-selected", handler);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  const cat: ServiceCategory | null =
    catIndex !== null ? categories[catIndex] : null;
  const tier: Tier | null = cat && tierKey ? cat.tiers[tierKey] : null;

  const addOnTotal = cat
    ? cat.addOns
        .filter((a) => addOns.includes(a.name))
        .reduce(
          (acc, a) => ({
            oneTime: acc.oneTime + (a.recurring ? 0 : a.priceNumeric),
            monthly: acc.monthly + (a.recurring ? a.priceNumeric : 0),
          }),
          { oneTime: 0, monthly: 0 }
        )
    : { oneTime: 0, monthly: 0 };

  const tierPrice = tier?.priceNumeric ?? 0;

  const canNext =
    (step === 1 && catIndex !== null) ||
    (step === 2 && tierKey !== null) ||
    step === 3 ||
    step === 4 ||
    step === 5;

  const goToStep = (next: number) => {
    setSlideDir(next > step ? "left" : "right");
    setTransitioning(true);
    setTimeout(() => {
      setStep(next);
      setTransitioning(false);
    }, 200);
  };

  const toggleAddOn = (name: string) => {
    setAddOns((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  const packageLabel =
    cat && tier ? `${cat.name} — ${tier.name} (${tier.price})` : "";
  const whatsappMsg = `Ciao, sono interessato al pacchetto: ${packageLabel}`;
  const emailSubject = `Richiesta info: ${packageLabel}`;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [formStatus, setFormStatus] = useState<
    "idle" | "sending" | "sent" | "error"
  >("idle");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!showForm || step !== 6 || !stepRef.current) return;

    const container = stepRef.current;
    const startY = container.scrollTop;
    const targetY = container.scrollHeight;
    const distance = targetY - startY;
    const duration = 700;
    const startTime = performance.now();
    let rafId = 0;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeInOutCubic(progress);

      container.scrollTo({
        top: startY + distance * eased,
      });

      if (progress < 1) {
        rafId = window.requestAnimationFrame(animate);
      }
    };

    rafId = window.requestAnimationFrame(animate);

    return () => window.cancelAnimationFrame(rafId);
  }, [showForm, step]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("sending");
    try {
      const res = await fetch(siteConfig.contact.formspreeUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          _subject: emailSubject,
          pacchetto: packageLabel,
        }),
      });
      setFormStatus(res.ok ? "sent" : "error");
    } catch {
      console.log("Form submission (dev):", { ...formData, packageLabel });
      setFormStatus("sent");
    }
  };

  // Transition classes
  const stepClasses = transitioning
    ? `opacity-0 ${slideDir === "left" ? "translate-x-4" : "-translate-x-4"}`
    : "opacity-100 translate-x-0";

  // --- LEFT PANEL CONTENT (text below 3D) ---
  function renderLeftPanelContent() {
    return (
        <div className="w-full text-center px-8 py-6 transition-all duration-500">
          {!cat ? (
            <>
              <p className="font-display text-lg mb-1">Di cosa hai bisogno?</p>
              <p className="text-xs text-muted">
                Seleziona un servizio per iniziare
              </p>
            </>
          ) : (
            <>
              <div className="flex items-center justify-center gap-3 mb-3">
                <p className="font-display text-lg">{cat.name}</p>
                {tier && (
                  <span className="text-[10px] uppercase tracking-wider text-accent font-mono">
                    {tier.name}
                  </span>
                )}
              </div>

              {tier && tierPrice > 0 ? (
                <div className="mb-3">
                  <p className="font-display text-3xl text-accent">
                    €{tierPrice.toLocaleString("it-IT")}
                  </p>
                  <p className="text-[11px] text-muted mt-0.5">{tier.frequency}</p>
                </div>
              ) : tier && tierPrice === 0 ? (
                <p className="font-display text-xl text-accent mb-3">
                  Su preventivo
                </p>
              ) : (
                <p className="text-xs text-muted mb-3">Scegli un piano</p>
              )}

              {(addOnTotal.monthly > 0 || addOnTotal.oneTime > 0) && (
                <div className="flex items-center justify-center gap-3 text-xs text-muted mb-3">
                  {addOnTotal.monthly > 0 && (
                    <span>+ €{addOnTotal.monthly}/mese</span>
                  )}
                  {addOnTotal.oneTime > 0 && (
                    <span>+ €{addOnTotal.oneTime} una tantum</span>
                  )}
                </div>
              )}

              {step >= 3 && tier && tierKey && (
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[11px] text-accent">
                  {cat.features.slice(0, 5).map((f) => {
                    const val = f[tierKey];
                    if (val === false) return null;
                    return (
                      <span key={f.name} className="flex items-center gap-1">
                        <span className="opacity-50">✓</span>
                        {f.name}
                      </span>
                    );
                  })}
                </div>
              )}

              {step >= 4 && addOns.length > 0 && (
                <div className="flex justify-center gap-3 mt-2 pt-2 border-t border-border text-[11px] text-muted">
                  {addOns.map((name) => (
                    <span key={name}>+ {name}</span>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
    );
  }

  // --- MOBILE HEADER ---
  function renderMobileHeader() {
    if (!cat) return null;
    return (
      <div className="md:hidden sticky top-16 z-10 bg-background/90 backdrop-blur-xl border-b border-border px-6 py-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-accent">{iconMap[cat.icon]}</span>
            <span className="text-sm font-medium">{cat.name}</span>
            {tier && (
              <span className="text-xs text-accent">· {tier.name}</span>
            )}
          </div>
          {tier && tierPrice > 0 && (
            <span className="font-display text-lg text-accent">
              €{tierPrice.toLocaleString("it-IT")}
            </span>
          )}
        </div>
        <ProgressBar current={step} />
      </div>
    );
  }

  // --- STEPS ---
  function renderStepService() {
    return (
      <>
        <p className="text-[10px] uppercase tracking-[0.2em] text-accent mb-2 font-mono">
          Step 1 di 6
        </p>
        <h3 className="font-display text-2xl md:text-3xl mb-2">
          Scegli il servizio
        </h3>
        <p className="text-sm text-muted mb-6">Cosa vuoi realizzare?</p>
        <div className="flex flex-col gap-2">
          {categories.map((c, i) => (
            <button
              key={c.id}
              onClick={() => {
                setCatIndex(i);
                setTierKey(null);
                setAddOns([]);
              }}
              className={`flex items-center gap-4 p-4 border transition-all duration-300 text-left ${
                catIndex === i
                  ? "border-accent/40 bg-accent/3 shadow-[0_0_20px_rgba(201,185,154,0.05)]"
                  : "border-border hover:border-border/80"
              }`}
            >
              <span
                className={`transition-colors duration-300 ${catIndex === i ? "text-accent" : "text-muted"}`}
              >
                {iconMap[c.icon]}
              </span>
              <div className="flex-1">
                <p
                  className={`text-sm font-medium transition-colors duration-300 ${catIndex === i ? "text-accent" : ""}`}
                >
                  {c.name}
                </p>
                <p className="text-[11px] text-muted mt-0.5">
                  da {c.startingPrice}
                </p>
              </div>
              <div
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                  catIndex === i ? "border-accent" : "border-border"
                }`}
              >
                {catIndex === i && (
                  <div className="w-2 h-2 rounded-full bg-accent" />
                )}
              </div>
            </button>
          ))}
        </div>
      </>
    );
  }

  function renderStepTier() {
    if (!cat) return null;
    return (
      <>
        <p className="text-[10px] uppercase tracking-[0.2em] text-accent mb-2 font-mono">
          Step 2 di 6
        </p>
        <h3 className="font-display text-2xl md:text-3xl mb-2">
          Scegli il piano
        </h3>
        <p className="text-sm text-muted mb-6">{cat.name}</p>
        <div className="flex flex-col gap-2">
          {(["base", "pro", "premium"] as const).map((k) => {
            const t = cat.tiers[k];
            const isPro = k === "pro";
            return (
              <button
                key={k}
                onClick={() => setTierKey(k)}
                className={`flex items-center justify-between p-4 border transition-all duration-300 text-left ${
                  tierKey === k
                    ? "border-accent/40 bg-accent/3 shadow-[0_0_20px_rgba(201,185,154,0.05)]"
                    : "border-border hover:border-border/80"
                }`}
              >
                <div>
                  <p
                    className={`text-sm font-medium transition-colors duration-300 ${tierKey === k ? "text-accent" : ""}`}
                  >
                    {t.name} {isPro && "★"}
                  </p>
                  <p className="text-[11px] text-muted mt-1">{t.summary}</p>
                </div>
                <p
                  className={`font-display text-xl transition-colors duration-300 ${tierKey === k ? "text-accent" : ""}`}
                >
                  {t.price}
                </p>
              </button>
            );
          })}
        </div>
      </>
    );
  }

  function renderStepFeatures() {
    if (!cat || !tierKey || !tier) return null;
    return (
      <>
        <p className="text-[10px] uppercase tracking-[0.2em] text-accent mb-2 font-mono">
          Step 3 di 6
        </p>
        <h3 className="font-display text-2xl md:text-3xl mb-2">
          Cosa include il tuo piano
        </h3>
        <p className="text-sm text-muted mb-6">
          Piano {tier.name} — {cat.name}
        </p>
        <div className="flex flex-col">
          {cat.features.map((f) => (
            <div
              key={f.name}
              className="flex items-center justify-between py-2.5 border-b border-border/30 last:border-0"
            >
              <span className="text-muted text-sm">{f.name}</span>
              <span className="text-foreground text-sm font-medium">
                <FeatureValue value={f[tierKey]} />
              </span>
            </div>
          ))}
        </div>
      </>
    );
  }

  function renderStepAddOns() {
    if (!cat) return null;
    return (
      <>
        <p className="text-[10px] uppercase tracking-[0.2em] text-accent mb-2 font-mono">
          Step 4 di 6
        </p>
        <h3 className="font-display text-2xl md:text-3xl mb-2">
          Personalizza
        </h3>
        <p className="text-sm text-muted mb-6">
          Aggiungi servizi extra (opzionale)
        </p>
        <div className="flex flex-col gap-2">
          {cat.addOns.map((a) => {
            const selected = addOns.includes(a.name);
            return (
              <button
                key={a.name}
                onClick={() => toggleAddOn(a.name)}
                className={`flex items-center gap-4 p-4 border transition-all duration-300 text-left ${
                  selected
                    ? "border-accent/40 bg-accent/3 shadow-[0_0_20px_rgba(201,185,154,0.05)]"
                    : "border-border hover:border-border/80"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    selected
                      ? "bg-accent text-background scale-110"
                      : "border border-border"
                  }`}
                >
                  {selected && "✓"}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{a.name}</p>
                  <p className="text-[11px] text-muted mt-0.5">
                    {a.description}
                  </p>
                </div>
                <p
                  className={`text-sm font-mono transition-colors duration-300 ${selected ? "text-accent" : "text-muted"}`}
                >
                  {a.price}
                </p>
              </button>
            );
          })}
        </div>
      </>
    );
  }

  function renderStepAIPreview() {
    if (!cat || !tierKey || !tier) return null;
    const featureNames = cat.features
      .filter((f) => f[tierKey] !== false)
      .map((f) => f.name);
    const addOnNames = cat.addOns
      .filter((a) => addOns.includes(a.name))
      .map((a) => a.name);

    return (
      <AIPreviewStep
        serviceName={cat.name}
        serviceId={cat.id}
        tierName={tier.name}
        features={featureNames}
        addOns={addOnNames}
        onProceed={() => goToStep(step + 1)}
      />
    );
  }

  function renderStepContact() {
    const contactChannels = [
      {
        icon: <FileText size={20} strokeWidth={1.5} />,
        label: "Compila il form",
        sub: "Ti ricontattiamo entro 24h",
        action: "form" as const,
      },
      {
        icon: <Calendar size={20} strokeWidth={1.5} />,
        label: "Prenota una call",
        sub: "Scegli data e ora",
        href: siteConfig.contact.calendlyUrl,
      },
      {
        icon: <MessageCircle size={20} strokeWidth={1.5} />,
        label: "WhatsApp",
        sub: "Risposta immediata",
        href: `https://wa.me/${siteConfig.contact.whatsappNumber}?text=${encodeURIComponent(whatsappMsg)}`,
      },
      {
        icon: <Mail size={20} strokeWidth={1.5} />,
        label: "Email",
        sub: "Con riepilogo pacchetto",
        href: `mailto:${siteConfig.contact.email}?subject=${encodeURIComponent(emailSubject)}`,
      },
    ];

    return (
      <>
        <p className="text-[10px] uppercase tracking-[0.2em] text-accent mb-2 font-mono">
          Step 6 di 6
        </p>
        <h3 className="font-display text-2xl md:text-3xl mb-2">Iniziamo!</h3>
        <p className="text-sm text-muted mb-6">
          Scegli come vuoi contattarci
        </p>
        <div className="flex flex-col gap-2">
          {contactChannels.map((ch) =>
            ch.action === "form" ? (
              <button
                key={ch.label}
                onClick={() => setShowForm(!showForm)}
                className="group flex items-center gap-4 p-4 border border-border hover:border-accent/30 transition-all duration-300 text-left"
              >
                <span className="text-muted group-hover:text-accent transition-colors duration-300">
                  {ch.icon}
                </span>
                <div>
                  <p className="text-sm font-medium group-hover:text-accent transition-colors duration-300">
                    {ch.label}
                  </p>
                  <p className="text-[11px] text-muted mt-0.5">{ch.sub}</p>
                </div>
              </button>
            ) : (
              <a
                key={ch.label}
                href={ch.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 p-4 border border-border hover:border-accent/30 transition-all duration-300"
              >
                <span className="text-muted group-hover:text-accent transition-colors duration-300">
                  {ch.icon}
                </span>
                <div>
                  <p className="text-sm font-medium group-hover:text-accent transition-colors duration-300">
                    {ch.label}
                  </p>
                  <p className="text-[11px] text-muted mt-0.5">{ch.sub}</p>
                </div>
              </a>
            )
          )}
        </div>

        {showForm && (
          <div className="mt-8 border border-border p-8 animate-fade-up">
            {formStatus === "sent" ? (
              <div className="text-center py-8">
                <p className="font-display text-2xl mb-2">Grazie!</p>
                <p className="text-sm text-muted">
                  Ti ricontatteremo entro 24h.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    required
                    placeholder="Nome e cognome"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="bg-transparent border border-border px-4 py-3 text-sm placeholder:text-muted/50 focus:border-accent/50 focus:outline-none transition-colors"
                  />
                  <input
                    type="email"
                    required
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="bg-transparent border border-border px-4 py-3 text-sm placeholder:text-muted/50 focus:border-accent/50 focus:outline-none transition-colors"
                  />
                </div>
                <input
                  type="tel"
                  placeholder="Telefono (opzionale)"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="bg-transparent border border-border px-4 py-3 text-sm placeholder:text-muted/50 focus:border-accent/50 focus:outline-none transition-colors"
                />
                <textarea
                  rows={3}
                  placeholder="Descrivi il tuo progetto..."
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="bg-transparent border border-border px-4 py-3 text-sm placeholder:text-muted/50 focus:border-accent/50 focus:outline-none transition-colors resize-none"
                />
                <button
                  type="submit"
                  disabled={formStatus === "sending"}
                  className="self-start bg-foreground text-background px-8 py-3 text-sm font-medium hover:bg-accent transition-all duration-300 disabled:opacity-50"
                >
                  {formStatus === "sending" ? "Invio..." : "Invia richiesta"}
                </button>
              </form>
            )}
          </div>
        )}
      </>
    );
  }

  const steps = [
    renderStepService,
    renderStepTier,
    renderStepFeatures,
    renderStepAddOns,
    renderStepAIPreview,
    renderStepContact,
  ];
  const currentStep = steps[step - 1];

  return (
    <section id="pricing" className="relative py-24 md:py-32">
      {/* Wizard: edge-to-edge */}
      <div className="mx-4 md:mx-8 lg:mx-12">
        {/* Header aligned with wizard border */}
        <div className="mb-12 md:mb-16">
          <p className="text-[10px] uppercase tracking-[0.35em] text-accent mb-4 font-mono">
            Pricing
          </p>
          <h2 className="font-display text-3xl md:text-4xl tracking-tight">
            Configura il tuo pacchetto
          </h2>
        </div>
        <div className="grid border border-border transition-all duration-700 ease-in-out md:grid-cols-[var(--left-col)_1fr]" style={{ "--left-col": step === 5 ? "0fr" : "1fr", height: step === 5 ? "auto" : "700px" } as React.CSSProperties}>
          {/* Left Panel — split: 3D top + text bottom (collapses on step 5) */}
          <div className={`hidden md:flex flex-col border-r border-border transition-opacity duration-500 ${step === 5 ? "opacity-0 overflow-hidden" : "opacity-100 overflow-hidden"}`}>
            {/* 3D Scene area */}
            <div className="relative h-[65%] bg-surface/20 overflow-hidden">
              <WizardScene serviceId={cat?.id ?? null} step={step} />
              {/* Fade gradient at bottom for smooth transition */}
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-surface/40 to-transparent z-10" />
            </div>
            {/* Text / Summary area */}
            <div className="flex-1 flex items-center justify-center bg-surface/30 border-t border-border">
              {renderLeftPanelContent()}
            </div>
          </div>
          {step !== 5 && renderMobileHeader()}

          <div className={`flex flex-col p-8 md:p-12 lg:p-14 ${step === 5 ? "min-h-125" : "h-full"} overflow-hidden transition-all duration-700 ease-in-out`}>
            <div className="hidden md:block shrink-0">
              <ProgressBar current={step} />
            </div>

            {/* Step content with transition — scrollable area */}
            <div
              ref={stepRef}
              className={`flex-1 overflow-y-auto min-h-0 pr-4 wizard-scroll transition-all duration-200 ease-out ${stepClasses}`}
            >
              {currentStep()}
            </div>

            {/* Navigation — always at bottom */}
            <div className="shrink-0 flex justify-between items-center pt-8 mt-8 border-t border-border">
              {step > 1 ? (
                <button
                  onClick={() => goToStep(step - 1)}
                  className="text-sm text-muted hover:text-foreground transition-colors"
                >
                  ← {step === 6 ? "Modifica selezione" : "Indietro"}
                </button>
              ) : (
                <div />
              )}
              {step < 6 && (
                <button
                  onClick={() => canNext && goToStep(step + 1)}
                  disabled={!canNext}
                  className="bg-foreground text-background px-8 py-3.5 text-sm font-medium tracking-wide hover:bg-accent transition-all duration-300 disabled:opacity-20 disabled:cursor-not-allowed"
                >
                  Avanti →
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-border to-transparent" />
    </section>

  );
}
