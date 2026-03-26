"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { Globe, ShoppingBag, Zap, TrendingUp } from "lucide-react";
import Lottie, { type LottieRefCurrentProps } from "lottie-react";
import { categories, type ServiceCategory } from "../data/packages";

const fallbackIcons: Record<string, React.ReactNode> = {
  globe: <Globe size={48} strokeWidth={1} />,
  "shopping-bag": <ShoppingBag size={48} strokeWidth={1} />,
  zap: <Zap size={48} strokeWidth={1} />,
  "trending-up": <TrendingUp size={48} strokeWidth={1} />,
};

function ServiceCard({
  cat,
  index,
}: {
  cat: ServiceCategory;
  index: number;
}) {
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const cardRef = useRef<HTMLAnchorElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [animationData, setAnimationData] = useState<any>(null);
  const [isTouch, setIsTouch] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const handleClick = useCallback(() => {
    window.dispatchEvent(
      new CustomEvent("service-selected", { detail: index })
    );
  }, [index]);

  // Load lottie data + detect touch/motion preferences
  useEffect(() => {
    setIsTouch(!window.matchMedia("(hover: hover)").matches);
    setPrefersReducedMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );

    if (!cat.lottie) return;

    fetch(cat.lottie)
      .then((res) => res.json())
      .then(setAnimationData)
      .catch(() => {
        /* silent fallback to icon */
      });
  }, [cat.lottie]);

  // IntersectionObserver for touch devices
  useEffect(() => {
    if (!isTouch || prefersReducedMotion || !animationData) return;

    const card = cardRef.current;
    if (!card) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          lottieRef.current?.play();
        } else {
          lottieRef.current?.stop();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(card);
    return () => observer.disconnect();
  }, [isTouch, prefersReducedMotion, animationData]);

  const handleMouseEnter = useCallback(() => {
    if (isTouch || prefersReducedMotion) return;
    lottieRef.current?.play();
  }, [isTouch, prefersReducedMotion]);

  const handleMouseLeave = useCallback(() => {
    if (isTouch || prefersReducedMotion) return;
    lottieRef.current?.stop();
  }, [isTouch, prefersReducedMotion]);

  // Determine filter classes
  const showGrayscale = !isTouch && !prefersReducedMotion;

  return (
    <a
      ref={cardRef}
      href="#pricing"
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative border border-border bg-surface/30 p-8 md:p-10 hover:border-accent/30 hover:bg-surface/60 transition-all duration-500"
    >
      <div className="grid grid-cols-1 sm:grid-cols-[3fr_2fr] gap-6 items-center">
        {/* Left — Text content */}
        <div className="order-2 sm:order-1">
          <p className="text-[10px] uppercase tracking-[0.2em] text-accent/60 font-mono mb-3">
            {cat.name}
          </p>
          <h3 className="text-lg font-medium tracking-tight mb-3 group-hover:text-accent transition-colors duration-300">
            {cat.description}
          </h3>
          <p className="text-sm text-muted font-mono mb-6">
            da {cat.startingPrice}
          </p>
          <div className="text-xs text-muted group-hover:text-foreground transition-colors duration-300 flex items-center gap-1">
            Vedi pacchetti
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </div>
        </div>

        {/* Right — Lottie or fallback icon */}
        <div
          className={`order-1 sm:order-2 flex items-center justify-center max-h-32 sm:max-h-48 transition-[filter] duration-500 ${
            showGrayscale
              ? "grayscale brightness-[0.7] group-hover:grayscale-0 group-hover:brightness-100"
              : ""
          }`}
        >
          {animationData ? (
            <Lottie
              lottieRef={lottieRef}
              animationData={animationData}
              loop
              autoplay={false}
              className="w-full h-full max-h-32 sm:max-h-48"
            />
          ) : (
            <span className="text-muted group-hover:text-accent transition-colors duration-500">
              {fallbackIcons[cat.icon]}
            </span>
          )}
        </div>
      </div>
    </a>
  );
}

export default function ServicesOverview() {
  return (
    <section id="servizi" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-8">
        {/* Header */}
        <div className="mb-16 md:mb-20">
          <p className="text-[10px] uppercase tracking-[0.35em] text-accent mb-4 font-mono">
            I nostri servizi
          </p>
          <h2 className="font-display text-3xl md:text-4xl tracking-tight">
            Cosa possiamo fare per te
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {categories.map((cat, i) => (
            <ServiceCard key={cat.id} cat={cat} index={i} />
          ))}
        </div>
      </div>

      {/* Bottom line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-border to-transparent" />
    </section>
  );
}
