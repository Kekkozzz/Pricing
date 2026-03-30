"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  { number: "01", title: "Briefing", description: "Call conoscitiva 30 minuti" },
  { number: "02", title: "Design", description: "Mockup e revisioni" },
  { number: "03", title: "Sviluppo", description: "Codice e test" },
  { number: "04", title: "Lancio", description: "Deploy e supporto" },
];

export default function ProcessSteps() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const stepsEl = stepsRef.current;
    if (!section || !stepsEl) return;

    const items = stepsEl.querySelectorAll<HTMLElement>(".process-step");

    const ctx = gsap.context(() => {
      gsap.from(items, {
        y: 32,
        opacity: 0,
        duration: 0.7,
        ease: "power2.out",
        stagger: 0.12,
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          once: true,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-8">
        {/* Header */}
        <div className="mb-16 md:mb-20">
          <p className="text-[10px] uppercase tracking-[0.35em] text-accent mb-4 font-mono">
            Come lavoriamo
          </p>
          <h2 className="font-display text-3xl md:text-4xl tracking-tight">
            Il nostro processo
          </h2>
        </div>

        {/* Steps grid */}
        <div
          ref={stepsRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10"
        >
          {steps.map((step, i) => (
            <div key={step.number} className="process-step relative">
              {/* Connector line (between steps, desktop only) */}
              {i < steps.length - 1 && (
                <div
                  className="hidden lg:block absolute top-6 left-[calc(100%+1rem)] w-[calc(100%-2rem)] h-px bg-border"
                  aria-hidden="true"
                />
              )}

              {/* Numbered circle */}
              <div className="w-12 h-12 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center mb-6">
                <span className="text-[11px] font-mono text-accent tracking-[0.1em]">
                  {step.number}
                </span>
              </div>

              {/* Content */}
              <h3 className="font-display text-xl tracking-tight mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-border to-transparent" />
    </section>
  );
}
