"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  { name: "Studio Legale Rossi", tag: "Sito Web" },
  { name: "TechFlow SaaS", tag: "Shop & SaaS" },
  { name: "Clinica Salute+", tag: "Sito Web" },
  { name: "FinApp Dashboard", tag: "Web App" },
  { name: "Ristorante Da Mario", tag: "Sito Web" },
  { name: "EduPlatform", tag: "Web App" },
  { name: "Boutique Milano", tag: "Shop & SaaS" },
  { name: "GreenEnergy Corp", tag: "SEO & Marketing" },
];

const row1 = projects.slice(0, 4);
const row2 = projects.slice(4, 8);

function PlaceholderCard({ name, tag }: { name: string; tag: string }) {
  return (
    <div className="shrink-0 w-md aspect-16/10 relative border border-border bg-surface/40 overflow-hidden group">
      {/* Gradient background unique per card */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(201,185,154,0.08)_0%,transparent_70%)]" />
      <div className="absolute inset-0 flex flex-col justify-end p-7">
        <p className="text-[10px] uppercase tracking-[0.2em] text-accent font-mono mb-2">
          {tag}
        </p>
        <p className="text-base font-medium text-foreground/80">{name}</p>
      </div>
      {/* Hover glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(ellipse_at_center,rgba(201,185,154,0.06)_0%,transparent_70%)]" />
    </div>
  );
}

export default function CaseStudies() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const r1 = row1Ref.current;
    const r2 = row2Ref.current;
    if (!section || !r1 || !r2) return;

    const ctx = gsap.context(() => {
      gsap.to(r1, {
        x: -200,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });

      gsap.to(r2, {
        x: 200,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-24 md:py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-8 mb-16 md:mb-20">
        <p className="text-[10px] uppercase tracking-[0.35em] text-accent mb-4 font-mono">
          Casi Studio
        </p>
        <h2 className="font-display text-3xl md:text-4xl tracking-tight">
          Progetti realizzati
        </h2>
      </div>

      {/* Row 1 — moves left (appears to scroll right) */}
      <div
        ref={row1Ref}
        className="flex gap-6 mb-6"
        style={{ transform: "translateX(100px)" }}
      >
        {[...row1, ...row1].map((p, i) => (
          <PlaceholderCard key={`r1-${i}`} name={p.name} tag={p.tag} />
        ))}
      </div>

      {/* Row 2 — moves right (appears to scroll left) */}
      <div
        ref={row2Ref}
        className="flex gap-6"
        style={{ transform: "translateX(-100px)" }}
      >
        {[...row2, ...row2].map((p, i) => (
          <PlaceholderCard key={`r2-${i}`} name={p.name} tag={p.tag} />
        ))}
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-border to-transparent" />
    </section>
  );
}
