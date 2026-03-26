"use client";

import { useState, useEffect, useRef } from "react";
import { FileText, Calendar, MessageCircle, Mail } from "lucide-react";
import { siteConfig } from "../data/config";

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export default function ContactHub() {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [formStatus, setFormStatus] = useState<
    "idle" | "sending" | "sent" | "error"
  >("idle");

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setSelectedPackage(detail);
    };
    window.addEventListener("package-selected", handler);
    return () => window.removeEventListener("package-selected", handler);
  }, []);

  const whatsappMessage = selectedPackage
    ? `Ciao, sono interessato al pacchetto: ${selectedPackage}`
    : "Ciao, vorrei informazioni sui vostri servizi web";

  const emailSubject = selectedPackage
    ? `Richiesta info: ${selectedPackage}`
    : "Richiesta informazioni servizi web";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("sending");

    try {
      const res = await fetch(siteConfig.contact.formspreeUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          _subject: emailSubject,
          pacchetto: selectedPackage || "Nessuno selezionato",
        }),
      });
      setFormStatus(res.ok ? "sent" : "error");
    } catch {
      console.log("Form submission (dev):", { ...formData, selectedPackage });
      setFormStatus("sent");
    }
  };

  const channels = [
    {
      icon: <FileText size={24} strokeWidth={1.5} />,
      label: "Form",
      sub: "Ti ricontattiamo noi",
      action: "form",
    },
    {
      icon: <Calendar size={24} strokeWidth={1.5} />,
      label: "Prenota Call",
      sub: "Scegli data e ora",
      href: siteConfig.contact.calendlyUrl,
    },
    {
      icon: <MessageCircle size={24} strokeWidth={1.5} />,
      label: "WhatsApp",
      sub: "Risposta immediata",
      href: `https://wa.me/${siteConfig.contact.whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`,
    },
    {
      icon: <Mail size={24} strokeWidth={1.5} />,
      label: "Email",
      sub: "Con riepilogo pacchetto",
      href: `mailto:${siteConfig.contact.email}?subject=${encodeURIComponent(emailSubject)}`,
    },
  ];

  const [showForm, setShowForm] = useState(false);
  const formContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showForm) return;

    const startY = window.scrollY;
    const elementTop = formContainerRef.current?.getBoundingClientRect().top;
    if (elementTop === undefined) return;

    const htmlEl = document.documentElement;
    const previousScrollBehavior = htmlEl.style.scrollBehavior;
    // Avoid combining CSS smooth scroll with custom RAF animation.
    htmlEl.style.scrollBehavior = "auto";

    const navOffset = 96;
    const targetY = startY + elementTop - navOffset;
    const distance = targetY - startY;
    const duration = 900;
    const startTime = performance.now();
    let rafId = 0;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeInOutCubic(progress);

      window.scrollTo({
        top: startY + distance * eased,
      });

      if (progress < 1) {
        rafId = window.requestAnimationFrame(animate);
      } else {
        htmlEl.style.scrollBehavior = previousScrollBehavior;
      }
    };

    rafId = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(rafId);
      htmlEl.style.scrollBehavior = previousScrollBehavior;
    };
  }, [showForm]);

  return (
    <section id="contatti" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-8">
        {/* Header */}
        <div className="mb-12 md:mb-16">
          <p className="text-[10px] uppercase tracking-[0.35em] text-accent mb-4 font-mono">
            Contatti
          </p>
          <h2 className="font-display text-3xl md:text-4xl tracking-tight">
            Iniziamo il tuo progetto
          </h2>
        </div>

        {/* Package summary */}
        {selectedPackage && (
          <div className="mb-10 border border-accent/30 bg-accent/3 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted mb-1 font-mono">
                  Pacchetto selezionato
                </p>
                <p className="text-foreground font-medium">
                  {selectedPackage}
                </p>
              </div>
              <button
                onClick={() => setSelectedPackage(null)}
                className="text-xs text-muted hover:text-foreground transition-colors"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Channels */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          {channels.map((ch) =>
            ch.action === "form" ? (
              <button
                key={ch.label}
                onClick={() => setShowForm(!showForm)}
                className="group text-left border border-border bg-surface/30 p-6 md:p-8 hover:border-accent/30 hover:bg-surface/60 transition-all duration-500"
              >
                <span className="block mb-4 text-muted group-hover:text-accent transition-colors duration-300">{ch.icon}</span>
                <span className="block text-sm font-medium tracking-tight group-hover:text-accent transition-colors duration-300">
                  {ch.label}
                </span>
                <span className="block text-xs text-muted mt-1">{ch.sub}</span>
              </button>
            ) : (
              <a
                key={ch.label}
                href={ch.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group border border-border bg-surface/30 p-6 md:p-8 hover:border-accent/30 hover:bg-surface/60 transition-all duration-500"
              >
                <span className="block mb-4 text-muted group-hover:text-accent transition-colors duration-300">{ch.icon}</span>
                <span className="block text-sm font-medium tracking-tight group-hover:text-accent transition-colors duration-300">
                  {ch.label}
                </span>
                <span className="block text-xs text-muted mt-1">{ch.sub}</span>
              </a>
            )
          )}
        </div>

        {/* Inline form */}
        {showForm && (
          <div
            ref={formContainerRef}
            className="border border-border bg-surface/30 p-8 md:p-10 animate-fade-up"
          >
            {formStatus === "sent" ? (
              <div className="text-center py-8">
                <p className="font-display text-2xl mb-2">Grazie!</p>
                <p className="text-sm text-muted">
                  Ti ricontatteremo entro 24h.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <input
                    type="text"
                    required
                    placeholder="Nome e cognome"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="bg-transparent border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted/50 focus:border-accent/50 focus:outline-none transition-colors"
                  />
                  <input
                    type="email"
                    required
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="bg-transparent border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted/50 focus:border-accent/50 focus:outline-none transition-colors"
                  />
                </div>
                <input
                  type="tel"
                  placeholder="Telefono (opzionale)"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="bg-transparent border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted/50 focus:border-accent/50 focus:outline-none transition-colors"
                />
                <textarea
                  rows={4}
                  placeholder="Descrivi il tuo progetto..."
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="bg-transparent border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted/50 focus:border-accent/50 focus:outline-none transition-colors resize-none"
                />
                <button
                  type="submit"
                  disabled={formStatus === "sending"}
                  className="self-start bg-foreground text-background px-8 py-3 text-sm font-medium tracking-wide hover:bg-accent transition-all duration-300 disabled:opacity-50"
                >
                  {formStatus === "sending"
                    ? "Invio in corso..."
                    : "Invia richiesta"}
                </button>
                {formStatus === "error" && (
                  <p className="text-red-400 text-xs">
                    Errore nell&apos;invio. Riprova o contattaci via WhatsApp.
                  </p>
                )}
              </form>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
