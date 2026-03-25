"use client";

import { useState } from "react";
import { categories } from "../data/packages";
import type { ServiceCategory } from "../data/packages";

function FeatureValue({ value }: { value: string | boolean }) {
  if (value === true) return <span className="text-accent">✓</span>;
  if (value === false) return <span className="text-muted/40">—</span>;
  return <span>{value}</span>;
}

function PricingCard({
  tier,
  tierKey,
  category,
  onSelect,
}: {
  tier: { name: string; price: string; frequency: string };
  tierKey: "base" | "pro" | "premium";
  category: ServiceCategory;
  onSelect: (label: string) => void;
}) {
  const isPro = tierKey === "pro";

  return (
    <div
      className={`relative flex flex-col border p-6 md:p-8 transition-all duration-500 ${
        isPro
          ? "border-accent/40 bg-accent/3"
          : "border-border bg-surface/30 hover:border-border hover:bg-surface/50"
      }`}
    >
      {isPro && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-background text-[9px] uppercase tracking-[0.2em] font-medium px-4 py-1">
          Popolare
        </div>
      )}

      <div className="mb-6">
        <div className="text-[10px] uppercase tracking-[0.2em] text-muted mb-3">
          {tier.name}
        </div>
        <div className="font-display text-3xl md:text-4xl tracking-tight">
          {tier.price}
        </div>
        <div className="text-xs text-muted mt-1 font-mono">
          {tier.frequency}
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-3 mb-8">
        {category.features.map((feat) => (
          <div
            key={feat.name}
            className="flex items-center justify-between text-sm py-1 border-b border-border/50 last:border-0"
          >
            <span className="text-muted text-xs">{feat.name}</span>
            <span className="text-foreground text-xs font-medium">
              <FeatureValue value={feat[tierKey]} />
            </span>
          </div>
        ))}
      </div>

      <button
        onClick={() =>
          onSelect(`${category.name} — ${tier.name} (${tier.price})`)
        }
        className={`w-full py-3 text-sm tracking-wide font-medium transition-all duration-300 ${
          isPro
            ? "bg-foreground text-background hover:bg-accent"
            : "border border-border text-muted hover:border-foreground hover:text-foreground"
        }`}
      >
        Scegli
      </button>
    </div>
  );
}

export default function PricingSection() {
  const [activeTab, setActiveTab] = useState(0);

  const handleSelect = (label: string) => {
    const event = new CustomEvent("package-selected", { detail: label });
    window.dispatchEvent(event);

    const contactSection = document.getElementById("contatti");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const active = categories[activeTab];

  return (
    <section id="pricing" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="mb-12 md:mb-16">
          <p className="text-[10px] uppercase tracking-[0.35em] text-accent mb-4 font-mono">
            Pricing
          </p>
          <h2 className="font-display text-3xl md:text-4xl tracking-tight">
            Pacchetti trasparenti
          </h2>
        </div>

        {/* Tabs */}
        <div className="flex gap-0 mb-12 border border-border p-1 overflow-x-auto">
          {categories.map((cat, i) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(i)}
              className={`flex-1 min-w-30 py-3 px-4 text-xs uppercase tracking-[0.15em] font-medium transition-all duration-300 whitespace-nowrap ${
                i === activeTab
                  ? "bg-foreground text-background"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(["base", "pro", "premium"] as const).map((tierKey) => (
            <PricingCard
              key={`${active.id}-${tierKey}`}
              tier={active.tiers[tierKey]}
              tierKey={tierKey}
              category={active}
              onSelect={handleSelect}
            />
          ))}
        </div>

        {/* Add-ons */}
        <div className="mt-8 border border-dashed border-border p-6 md:p-8">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted mb-4 font-mono">
            Add-on opzionali
          </p>
          <div className="flex flex-wrap gap-3">
            {active.addOns.map((addon) => (
              <span
                key={addon.name}
                className="inline-flex items-center gap-2 border border-border px-4 py-2 text-xs text-muted hover:border-accent/30 hover:text-foreground transition-all duration-300"
              >
                {addon.name}
                <span className="text-accent font-mono">{addon.price}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-border to-transparent" />
    </section>
  );
}
