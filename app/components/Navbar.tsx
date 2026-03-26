"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { siteConfig } from "../data/config";

gsap.registerPlugin(ScrollTrigger);

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const floatingRef = useRef<HTMLDivElement>(null);
  const isContracted = useRef(false);
  const isNavigating = useRef(false);
  const activeTween = useRef<gsap.core.Tween | null>(null);

  const links = [
    { label: "Servizi", href: "#servizi" },
    { label: "Pricing", href: "#pricing" },
    { label: "Contatti", href: "#contatti" },
  ];

  const handleNavClick = useCallback(() => {
    setMenuOpen(false);
    isNavigating.current = true;

    const onScrollEnd = () => {
      isNavigating.current = false;
      window.removeEventListener("scrollend", onScrollEnd);
    };
    window.addEventListener("scrollend", onScrollEnd);

    setTimeout(() => {
      isNavigating.current = false;
      window.removeEventListener("scrollend", onScrollEnd);
    }, 1000);
  }, []);

  const handleFloatingClick = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleSymbolKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  // Contract: fade out navbar, fade in floating square
  const contractNav = useCallback(() => {
    if (isContracted.current) return;
    isContracted.current = true;

    const nav = navRef.current;
    const floating = floatingRef.current;
    if (!nav || !floating) return;

    if (activeTween.current) activeTween.current.kill();

    // Fade out navbar
    activeTween.current = gsap.to(nav, {
      opacity: 0,
      y: -8,
      duration: 0.35,
      ease: "power2.in",
      onComplete: () => {
        nav.style.pointerEvents = "none";
      },
    });

    // Fade in floating square
    gsap.to(floating, {
      opacity: 1,
      scale: 1,
      duration: 0.4,
      ease: "power2.out",
      delay: 0.15,
      onStart: () => {
        floating.style.pointerEvents = "auto";
      },
    });

    document.documentElement.style.setProperty("--scroll-pad", "1rem");
  }, []);

  // Expand: fade out floating square, fade in navbar
  const expandNav = useCallback(() => {
    if (!isContracted.current) return;
    isContracted.current = false;

    const nav = navRef.current;
    const floating = floatingRef.current;
    if (!nav || !floating) return;

    if (activeTween.current) activeTween.current.kill();

    // Fade out floating square
    gsap.to(floating, {
      opacity: 0,
      scale: 0.85,
      duration: 0.25,
      ease: "power2.in",
      onComplete: () => {
        floating.style.pointerEvents = "none";
      },
    });

    // Fade in navbar
    activeTween.current = gsap.to(nav, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      ease: "power2.out",
      delay: 0.1,
      onStart: () => {
        nav.style.pointerEvents = "auto";
      },
    });

    document.documentElement.style.setProperty("--scroll-pad", "10rem");
  }, []);

  useEffect(() => {
    const nav = navRef.current;
    const floating = floatingRef.current;
    if (!nav || !floating) return;

    const heroEl = document.getElementById("hero");
    if (!heroEl) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        ScrollTrigger.create({
          trigger: heroEl,
          start: "top top",
          end: "bottom top",
          onLeave: () => {
            gsap.set(nav, { opacity: 0, y: -8 });
            nav.style.pointerEvents = "none";
            gsap.set(floating, { opacity: 1, scale: 1 });
            floating.style.pointerEvents = "auto";
            isContracted.current = true;
            document.documentElement.style.setProperty("--scroll-pad", "1rem");
          },
          onEnterBack: () => {
            gsap.set(nav, { opacity: 1, y: 0 });
            nav.style.pointerEvents = "auto";
            gsap.set(floating, { opacity: 0, scale: 0.85 });
            floating.style.pointerEvents = "none";
            isContracted.current = false;
            document.documentElement.style.setProperty("--scroll-pad", "8rem");
          },
        });
        return;
      }

      // ── Hero zone: scrub-based crossfade ──
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroEl,
          start: "70% top",
          end: "bottom top",
          scrub: 0.8,
          onLeave: () => {
            isContracted.current = true;
            document.documentElement.style.setProperty("--scroll-pad", "1rem");
            nav.style.pointerEvents = "none";
            floating.style.pointerEvents = "auto";
            gsap.to(floating, {
              opacity: 1,
              scale: 1,
              duration: 0.35,
              ease: "power2.out",
            });
          },
          onEnterBack: () => {
            isContracted.current = false;
            document.documentElement.style.setProperty("--scroll-pad", "8rem");
            nav.style.pointerEvents = "auto";
            floating.style.pointerEvents = "none";
            if (activeTween.current) {
              activeTween.current.kill();
              activeTween.current = null;
            }
            // Kill any ongoing floating tweens and hide immediately
            gsap.killTweensOf(floating);
            gsap.set(floating, { opacity: 0, scale: 0.85 });
          },
        },
      });

      // Navbar fades out and slides up slightly
      tl.to(nav, {
        opacity: 0,
        y: -8,
        duration: 1,
        ease: "power2.in",
      }, 0);

      // Floating square handled via onLeave/onEnterBack only (not in scrub timeline)
      // to avoid conflicts with expandNav/contractNav tweens

      // ── Scroll direction detection (below Hero) ──
      let scrollAccumulator = 0;
      let lastDirection = 0;
      const THRESHOLD = 30;

      ScrollTrigger.create({
        trigger: heroEl,
        start: "bottom top",
        endTrigger: "body",
        end: "bottom bottom",
        onUpdate: (self) => {
          if (isNavigating.current) return;

          const dir = self.direction;

          if (dir !== lastDirection) {
            scrollAccumulator = 0;
            lastDirection = dir;
          }

          scrollAccumulator += Math.abs(self.getVelocity()) * 0.016;

          if (scrollAccumulator < THRESHOLD) return;

          if (dir === -1 && isContracted.current) {
            expandNav();
          } else if (dir === 1 && !isContracted.current) {
            contractNav();
          }

          scrollAccumulator = 0;
        },
      });
    });

    // Resize handler
    let resizeTimer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 200);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      ctx.revert();
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimer);
      document.documentElement.style.setProperty("--scroll-pad", "8rem");
    };
  }, [contractNav, expandNav]);

  // Close menu on click outside
  useEffect(() => {
    if (!menuOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      const nav = navRef.current;
      const floating = floatingRef.current;
      const target = e.target as Node;
      if (nav && !nav.contains(target) && floating && !floating.contains(target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [menuOpen]);

  return (
    <>
      {/* ── Full navbar ── */}
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border"
      >
        <div className="mx-auto max-w-7xl flex items-center justify-between px-8 h-16">
          <a
            href="#"
            className="font-display text-lg tracking-tight text-foreground hover:text-accent transition-colors whitespace-nowrap"
          >
            {siteConfig.companyName}
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={handleNavClick}
                className="text-xs uppercase tracking-[0.2em] text-muted hover:text-foreground transition-colors duration-300"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex flex-col gap-1.5 p-2"
            aria-label="Menu"
          >
            <span
              className={`block w-5 h-px bg-foreground transition-transform duration-300 ${
                menuOpen ? "rotate-45 translate-y-[3.5px]" : ""
              }`}
            />
            <span
              className={`block w-5 h-px bg-foreground transition-transform duration-300 ${
                menuOpen ? "-rotate-45 -translate-y-[3.5px]" : ""
              }`}
            />
          </button>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-500 ${
            menuOpen ? "max-h-48 border-b border-border" : "max-h-0"
          }`}
        >
          <div className="px-8 pb-6 pt-2 bg-background/95 backdrop-blur-xl flex flex-col gap-4">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={handleNavClick}
                className="text-xs uppercase tracking-[0.2em] text-muted hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* ── Floating square (separate element) ── */}
      <div
        ref={floatingRef}
        role="button"
        tabIndex={0}
        aria-label="Torna in cima"
        onClick={handleFloatingClick}
        onKeyDown={handleSymbolKeyDown}
        className="fixed z-50 flex items-center justify-center cursor-pointer bg-background/80 backdrop-blur-xl border border-border floating-nav-left"
        style={{
          top: 16,
          width: 48,
          height: 48,
          borderRadius: 0,
          opacity: 0,
          scale: 0.85,
          pointerEvents: "none",
          boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
        }}
      >
        <span className="font-mono text-xs font-medium text-accent tracking-tight select-none">
          2.0
        </span>
      </div>
    </>
  );
}
