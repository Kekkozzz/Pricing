import Image from "next/image";
import { siteConfig } from "../data/config";

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Subtle radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,185,154,0.06)_0%,transparent_60%)]" />

      <div className="relative mx-auto max-w-6xl w-full px-6 py-32 md:py-40">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-20 items-center">
          {/* Left — Copy */}
          <div>
            <p className="animate-fade-up stagger-1 text-[10px] uppercase tracking-[0.35em] text-accent mb-6 font-mono">
              {siteConfig.tagline}
            </p>
            <h1 className="animate-fade-up stagger-2 font-display text-4xl md:text-5xl lg:text-6xl leading-[1.1] tracking-tight mb-6">
              Il tuo prossimo
              <br />
              sito web,{" "}
              <em className="text-accent">a prezzo chiaro</em>
            </h1>
            <p className="animate-fade-up stagger-3 text-muted text-base md:text-lg leading-relaxed max-w-md mb-10">
              Pacchetti completi per ogni esigenza. Scegli, personalizza,
              parti. Senza sorprese.
            </p>
            <div className="animate-fade-up stagger-4 flex flex-col sm:flex-row gap-4">
              <a
                href="#pricing"
                className="group inline-flex items-center justify-center gap-2 bg-foreground text-background px-7 py-3.5 text-sm font-medium tracking-wide hover:bg-accent hover:text-background transition-all duration-300"
              >
                Scopri i pacchetti
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </a>
              <a
                href="#contatti"
                className="inline-flex items-center justify-center px-7 py-3.5 text-sm tracking-wide border border-border text-muted hover:border-foreground hover:text-foreground transition-all duration-300"
              >
                Parla con noi
              </a>
            </div>
          </div>

          {/* Right — Hero image */}
          <div className="animate-fade-up stagger-5">
            <div className="relative w-full max-w-xl mx-auto aspect-4/3  overflow-hidden">
              <Image
                src="/hero.png"
                alt="Anteprima del sito"
                fill
                sizes="(min-width: 1024px) 40vw, (min-width: 768px) 45vw, 90vw"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-border to-transparent" />
    </section>
  );
}
