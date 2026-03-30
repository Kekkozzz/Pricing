"use client";

import { useEffect, useRef, useState } from "react";
import Lottie from "lottie-react";
import type { ServiceHeroData } from "@/app/data/service-details";

interface ServiceHeroProps {
  hero: ServiceHeroData;
  serviceId: string;
  lottiePath: string;
}

export default function ServiceHero({ hero, serviceId, lottiePath }: ServiceHeroProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [animationData, setAnimationData] = useState<any>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  // Fetch Lottie JSON only if a path is provided
  useEffect(() => {
    if (!lottiePath) return;

    fetch(lottiePath)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load Lottie animation");
        return res.json();
      })
      .then(setAnimationData)
      .catch(() => {
        /* silent fallback — render nothing */
      });
  }, [lottiePath]);

  // Stagger fadeUp via CSS animation classes (matches existing animate-fade-up pattern)
  return (
    <section
      id="hero"
      className="relative min-h-[88vh] flex items-center overflow-hidden pt-[120px]"
    >
      {/* Radial gradient accent overlay */}
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,185,154,0.06)_0%,transparent_60%)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl w-full px-6 md:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
          {/* Left — Copy */}
          <div ref={leftRef}>
            <p className="animate-fade-up stagger-1 text-[10px] uppercase tracking-[0.35em] text-accent mb-6 font-mono">
              {hero.label}
            </p>
            <h1 className="animate-fade-up stagger-2 font-display text-4xl md:text-5xl lg:text-6xl leading-[1.1] tracking-tight mb-6">
              {hero.headline}
              <br />
              <em className="text-accent not-italic">{hero.headlineAccent}</em>
            </h1>
            <p className="animate-fade-up stagger-3 text-muted text-base md:text-lg leading-relaxed max-w-md mb-10">
              {hero.description}
            </p>
            <div className="animate-fade-up stagger-4 flex flex-col sm:flex-row gap-4">
              {/* Primary CTA */}
              <a
                href={`/?service=${serviceId}#pricing`}
                className="group inline-flex items-center justify-center gap-2 bg-accent text-[#050505] px-7 py-3.5 text-sm font-medium tracking-wide hover:bg-foreground hover:text-background transition-all duration-300"
              >
                Configura il tuo
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </a>
              {/* Secondary CTA */}
              <span className="inline-flex items-center justify-center px-7 py-3.5 text-sm tracking-wide border border-border text-accent font-mono">
                {hero.priceLabel}
              </span>
            </div>
          </div>

          {/* Right — Lottie animation */}
          <div
            ref={rightRef}
            className="animate-fade-up stagger-5 flex items-center justify-center"
            aria-hidden="true"
            role="presentation"
          >
            {animationData && (
              <div className="w-full max-w-[300px] mx-auto">
                <Lottie
                  animationData={animationData}
                  loop
                  autoplay
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom divider line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-border to-transparent" />
    </section>
  );
}
