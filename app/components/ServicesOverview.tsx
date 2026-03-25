import { Globe, ShoppingBag, Zap, TrendingUp } from "lucide-react";
import { categories } from "../data/packages";

const icons: Record<string, React.ReactNode> = {
  globe: <Globe size={24} strokeWidth={1.5} />,
  "shopping-bag": <ShoppingBag size={24} strokeWidth={1.5} />,
  zap: <Zap size={24} strokeWidth={1.5} />,
  "trending-up": <TrendingUp size={24} strokeWidth={1.5} />,
};

export default function ServicesOverview() {
  return (
    <section id="servizi" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {categories.map((cat) => (
            <a
              key={cat.id}
              href="#pricing"
              data-tab={cat.id}
              className="group relative border border-border bg-surface/30 p-8 md:p-10 hover:border-accent/30 hover:bg-surface/60 transition-all duration-500"
            >
              <div className="flex items-start justify-between mb-6">
                <span className="text-muted group-hover:text-accent transition-colors duration-300">
                  {icons[cat.icon]}
                </span>
                <span className="text-[10px] font-mono tracking-wider text-muted group-hover:text-accent transition-colors duration-300">
                  da {cat.startingPrice}
                </span>
              </div>
              <h3 className="text-lg font-medium tracking-tight mb-2 group-hover:text-accent transition-colors duration-300">
                {cat.name}
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                {cat.description}
              </p>
              <div className="mt-6 text-xs text-muted group-hover:text-foreground transition-colors duration-300 flex items-center gap-1">
                Vedi pacchetti
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Bottom line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-border to-transparent" />
    </section>
  );
}
