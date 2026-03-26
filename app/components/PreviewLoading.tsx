"use client";

import { useState, useEffect } from "react";
import { Image } from "lucide-react";

const messages = [
  "Sto progettando la tua homepage...",
  "Scelgo il layout migliore per il tuo settore...",
  "Applico i tuoi colori e il tuo stile...",
  "Creo il mockup visuale...",
  "Quasi pronto...",
];

export default function PreviewLoading() {
  const [msgIndex, setMsgIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const msgInterval = setInterval(() => {
      setMsgIndex((i) => (i + 1) % messages.length);
    }, 2500);
    return () => clearInterval(msgInterval);
  }, []);

  useEffect(() => {
    const target = 90;
    const duration = 55000;
    const step = target / (duration / 50);
    const interval = setInterval(() => {
      setProgress((p) => Math.min(p + step, target));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-16 gap-6">
      {/* Animated orb */}
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full bg-accent/10 animate-ping" />
        <div className="absolute inset-2 rounded-full bg-accent/20 animate-pulse" />
        <div className="absolute inset-4 rounded-full bg-accent/30 flex items-center justify-center">
          <Image size={20} className="text-accent" />
        </div>
      </div>

      {/* Message */}
      <p className="text-sm text-muted transition-all duration-500 text-center min-h-[1.5em]">
        {messages[msgIndex]}
      </p>

      {/* Progress bar */}
      <div className="w-full max-w-xs">
        <div className="h-0.5 bg-border rounded-full overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-[10px] text-muted/50 text-center mt-2 font-mono">
          Generazione Mockup
        </p>
      </div>
    </div>
  );
}
