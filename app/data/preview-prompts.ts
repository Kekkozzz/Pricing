export type PreviewInput = {
  businessName: string;
  sector: string;
  style: string;
  colorPalette: string[];
  description: string;
  referenceUrls?: string;
  serviceName: string;
  serviceId: string;
  tierName: string;
  features: string[];
  addOns: string[];
};

const servicePromptMap: Record<string, string> = {
  "siti-web": "un sito web vetrina/brochure con hero section, sezione about, servizi e contatti",
  "shop-saas": "un e-commerce con product grid, carrello, filtri prodotti e checkout",
  "web-app": "una web application con sidebar di navigazione, dashboard con grafici e data tables",
  "seo-marketing": "una landing page marketing con headline forte, CTA, statistiche e social proof",
};

function formatColors(colors: string[]): string {
  if (colors.length === 0) return "colori professionali a scelta";
  return colors.join(", ");
}

export function buildImagePrompt(input: PreviewInput): string {
  const serviceHint = servicePromptMap[input.serviceId] ?? servicePromptMap["siti-web"];
  const desc = input.description ? input.description.slice(0, 200) : "";

  return `Genera un'IMMAGINE: mockup screenshot professionale di ${serviceHint}.

Attività: "${input.businessName}" — ${input.sector}
Stile: ${input.style} | Colori: ${formatColors(input.colorPalette)}
Pacchetto: ${input.serviceName} (${input.tierName})
${desc ? `Info: ${desc}` : ""}

Screenshot realistico di un sito web moderno in un browser desktop. Professionale, pulito, alta qualità. Testo in italiano. Usa i colori indicati come palette dominante.

IMPORTANTE: restituisci SOLO l'immagine, nessun testo.`;
}

