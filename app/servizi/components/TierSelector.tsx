"use client";

import { useState } from "react";
import Link from "next/link";
import type { TierDetail } from "@/app/data/service-details";
import type { Tier } from "@/app/data/packages";

interface TierSelectorProps {
  serviceId: string;
  tierDetails: TierDetail[];
  tiers: { base: Tier; pro: Tier; premium: Tier };
}

type TierKey = "base" | "pro" | "premium";

export default function TierSelector({ serviceId, tierDetails, tiers }: TierSelectorProps) {
  // Default to highlighted tier or "base"
  const defaultTier =
    (tierDetails.find((t) => t.highlighted)?.key as TierKey | undefined) ?? "base";
  const [activeTier, setActiveTier] = useState<TierKey>(defaultTier);

  const activeTierDetail = tierDetails.find((t) => t.key === activeTier)!;
  const activeTierInfo = tiers[activeTier];

  return (
    <section className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        {/* Header */}
        <div className="mb-12 md:mb-16">
          <p className="text-[10px] uppercase tracking-[0.35em] text-accent mb-4 font-mono">
            Scegli il tuo pacchetto
          </p>
          <h2 className="font-display text-3xl md:text-4xl tracking-tight">
            Trova il tier giusto per te
          </h2>
        </div>

        {/* Tab buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mb-10 overflow-x-auto pb-1">
          {tierDetails.map((detail) => {
            const tierInfo = tiers[detail.key];
            const isActive = activeTier === detail.key;

            return (
              <button
                key={detail.key}
                onClick={() => setActiveTier(detail.key)}
                className={`relative flex-1 min-w-[140px] flex flex-col items-center gap-1 px-6 py-4 rounded-lg border text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-accent/15 border-accent/40 text-accent"
                    : "bg-surface/30 border-border text-muted hover:border-accent/20 hover:text-foreground"
                }`}
              >
                {/* "Più scelto" badge */}
                {detail.highlighted && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[9px] uppercase tracking-[0.2em] font-mono bg-accent text-[#050505] px-2 py-0.5 rounded-full whitespace-nowrap">
                    Più scelto
                  </span>
                )}
                <span className="font-semibold">{tierInfo.name}</span>
                <span className={`text-xs font-mono ${isActive ? "text-accent" : "text-muted"}`}>
                  {tierInfo.price}
                </span>
              </button>
            );
          })}
        </div>

        {/* Content panel */}
        <div
          key={activeTier}
          className="border border-border bg-surface/30 rounded-xl p-8 md:p-10 transition-all duration-300"
        >
          <div className="max-w-2xl">
            {/* Tagline */}
            <h3 className="font-display text-xl font-semibold tracking-tight mb-4 text-foreground">
              {activeTierDetail.tagline}
            </h3>

            {/* Description */}
            <p className="text-muted leading-relaxed mb-6">
              {activeTierDetail.description}
            </p>

            {/* Includes */}
            <p className="text-sm text-muted/70 font-mono mb-8">
              {activeTierDetail.includes}
            </p>

            {/* Also show price and frequency */}
            <div className="flex items-baseline gap-2 mb-8">
              <span className="font-display text-3xl text-foreground">
                {activeTierInfo.price}
              </span>
              <span className="text-xs font-mono text-muted uppercase tracking-[0.15em]">
                {activeTierInfo.frequency}
              </span>
            </div>

            {/* CTA */}
            {activeTierDetail.ctaType === "wizard" ? (
              <Link
                href={`/?service=${serviceId}&tier=${activeTier}#pricing`}
                className="group inline-flex items-center justify-center gap-2 bg-accent text-[#050505] px-7 py-3.5 text-sm font-medium tracking-wide hover:bg-foreground hover:text-background transition-all duration-300 rounded"
              >
                Inizia con {activeTierInfo.name}
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            ) : (
              <Link
                href="/#contatti"
                className="inline-flex items-center justify-center gap-2 border border-accent text-accent px-7 py-3.5 text-sm font-medium tracking-wide hover:bg-accent/10 transition-all duration-300 rounded"
              >
                Contattaci per un preventivo
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Bottom divider line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-border to-transparent" />
    </section>
  );
}
