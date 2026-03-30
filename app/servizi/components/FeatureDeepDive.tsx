"use client";

import { useState } from "react";
import type { FeatureDetail } from "@/app/data/service-details";

interface FeatureDeepDiveProps {
  features: FeatureDetail[];
}

export default function FeatureDeepDive({ features }: FeatureDeepDiveProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        {/* Header */}
        <div className="mb-12 md:mb-16">
          <p className="text-[10px] uppercase tracking-[0.35em] text-accent mb-4 font-mono">
            Cosa include ogni feature
          </p>
          <h2 className="font-display text-3xl md:text-4xl tracking-tight">
            Nel dettaglio
          </h2>
        </div>

        {/* Accordion container */}
        <div className="border border-border rounded-xl overflow-hidden divide-y divide-border">
          {features.map((feature, index) => {
            const isOpen = openIndex === index;

            return (
              <div key={index}>
                {/* Header row */}
                <button
                  onClick={() => toggle(index)}
                  className="w-full flex items-center gap-4 px-6 md:px-8 py-5 text-left hover:bg-surface/40 transition-colors duration-200"
                  aria-expanded={isOpen}
                >
                  {/* Emoji icon */}
                  <span className="text-xl shrink-0" aria-hidden="true">
                    {feature.icon}
                  </span>

                  {/* Name */}
                  <span className="flex-1 font-medium text-foreground text-base">
                    {feature.name}
                  </span>

                  {/* Tier badge */}
                  <span className="hidden sm:inline-flex text-[10px] font-mono uppercase tracking-[0.15em] text-muted border border-border px-2.5 py-1 rounded-full shrink-0">
                    {feature.tiers}
                  </span>

                  {/* Chevron */}
                  <span
                    className={`shrink-0 ml-2 text-muted transition-transform duration-300 ${
                      isOpen ? "rotate-180" : "rotate-0"
                    }`}
                    aria-hidden="true"
                  >
                    ▼
                  </span>
                </button>

                {/* Accordion body with CSS grid-template-rows transition */}
                <div
                  className="overflow-hidden transition-[grid-template-rows] duration-300"
                  style={{
                    display: "grid",
                    gridTemplateRows: isOpen ? "1fr" : "0fr",
                  }}
                >
                  <div className="min-h-0">
                    <div className="px-6 md:px-8 py-5 bg-surface/30">
                      {/* Show tier badge on mobile inside body */}
                      <p className="sm:hidden text-[10px] font-mono uppercase tracking-[0.15em] text-muted mb-3">
                        {feature.tiers}
                      </p>
                      <p className="text-muted leading-relaxed text-sm md:text-base max-w-2xl">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom divider line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-border to-transparent" />
    </section>
  );
}
