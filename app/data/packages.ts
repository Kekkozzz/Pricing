export type Feature = {
  name: string;
  base: string | boolean;
  pro: string | boolean;
  premium: string | boolean;
};

export type AddOn = {
  name: string;
  price: string;
};

export type ServiceCategory = {
  id: string;
  name: string;
  icon: string;
  description: string;
  startingPrice: string;
  tiers: {
    base: { name: string; price: string; frequency: string };
    pro: { name: string; price: string; frequency: string };
    premium: { name: string; price: string; frequency: string };
  };
  features: Feature[];
  addOns: AddOn[];
};

export const categories: ServiceCategory[] = [
  {
    id: "siti-web",
    name: "Siti Web",
    icon: "globe",
    description:
      "Fatti trovare online — siti responsive con design su misura, SEO e gestione contenuti inclusa",
    startingPrice: "€499",
    tiers: {
      base: { name: "Base", price: "€499", frequency: "una tantum" },
      pro: { name: "Pro", price: "€999", frequency: "una tantum" },
      premium: { name: "Premium", price: "€1.999", frequency: "una tantum" },
    },
    features: [
      { name: "Pagine", base: "1–3", pro: "5–8", premium: "Illimitate" },
      {
        name: "Design",
        base: "Template",
        pro: "Custom",
        premium: "Premium su misura",
      },
      { name: "Responsive", base: true, pro: true, premium: true },
      { name: "Form contatto", base: true, pro: true, premium: true },
      { name: "SEO on-page", base: false, pro: "Base", premium: "Avanzata" },
      { name: "CMS", base: false, pro: true, premium: true },
      { name: "Google Analytics", base: false, pro: true, premium: true },
      { name: "Blog", base: false, pro: false, premium: true },
      {
        name: "Consegna",
        base: "3–5 giorni",
        pro: "5–7 giorni",
        premium: "7–10 giorni",
      },
      {
        name: "Revisioni",
        base: "1",
        pro: "3",
        premium: "Illimitate",
      },
    ],
    addOns: [
      { name: "Manutenzione", price: "+€49/mese" },
      { name: "Hosting gestito", price: "+€9/mese" },
      { name: "Copywriting", price: "+€199" },
    ],
  },
  {
    id: "shop-saas",
    name: "Shop & SaaS",
    icon: "shopping-bag",
    description:
      "Vendi online dal giorno uno — shop completo con pagamenti sicuri, checkout Stripe e area clienti",
    startingPrice: "€999",
    tiers: {
      base: { name: "Base", price: "€999", frequency: "una tantum" },
      pro: { name: "Pro", price: "€1.999", frequency: "una tantum" },
      premium: { name: "Premium", price: "€3.999", frequency: "una tantum" },
    },
    features: [
      {
        name: "Tipo",
        base: "Landing + checkout",
        pro: "Shop completo",
        premium: "Piattaforma SaaS",
      },
      {
        name: "Prodotti / piani",
        base: "Fino a 3",
        pro: "Fino a 20",
        premium: "Illimitati",
      },
      { name: "Checkout Stripe", base: true, pro: true, premium: true },
      {
        name: "Abbonamenti ricorrenti",
        base: false,
        pro: true,
        premium: true,
      },
      {
        name: "Area clienti",
        base: false,
        pro: "Base",
        premium: "Avanzata",
      },
      { name: "Coupon e sconti", base: false, pro: true, premium: true },
      {
        name: "Webhook e automazioni",
        base: false,
        pro: false,
        premium: true,
      },
      { name: "Email transazionali", base: true, pro: true, premium: true },
      {
        name: "Consegna",
        base: "5–7 giorni",
        pro: "7–10 giorni",
        premium: "10–15 giorni",
      },
      {
        name: "Revisioni",
        base: "1",
        pro: "3",
        premium: "Illimitate",
      },
    ],
    addOns: [
      { name: "Manutenzione", price: "+€79/mese" },
      { name: "Migrazione dati", price: "+€499" },
      { name: "Formazione", price: "+€299" },
    ],
  },
  {
    id: "web-app",
    name: "Web App",
    icon: "zap",
    description:
      "Digitalizza i tuoi processi — applicazioni web su misura con dashboard, notifiche e supporto dedicato",
    startingPrice: "€2.999",
    tiers: {
      base: { name: "Base", price: "€2.999", frequency: "una tantum" },
      pro: { name: "Pro", price: "€5.999", frequency: "una tantum" },
      premium: {
        name: "Premium",
        price: "Su prev.",
        frequency: "personalizzato",
      },
    },
    features: [
      {
        name: "Complessità",
        base: "Semplice",
        pro: "Media",
        premium: "Elevata",
      },
      {
        name: "Utenti",
        base: "Fino a 100",
        pro: "Fino a 1.000",
        premium: "Illimitati",
      },
      {
        name: "Autenticazione",
        base: "Email / password",
        pro: "SSO / OAuth",
        premium: "Custom",
      },
      { name: "Dashboard", base: false, pro: true, premium: "Avanzata" },
      {
        name: "Database",
        base: "Base",
        pro: "Ottimizzato",
        premium: "Scalabile",
      },
      { name: "Notifiche email", base: true, pro: true, premium: true },
      {
        name: "Supporto",
        base: "Email",
        pro: "Prioritario",
        premium: "Dedicato",
      },
      {
        name: "Consegna",
        base: "7–10 giorni",
        pro: "10–15 giorni",
        premium: "Da concordare",
      },
      {
        name: "Revisioni",
        base: "2",
        pro: "5",
        premium: "Illimitate",
      },
    ],
    addOns: [
      { name: "Supporto dedicato", price: "+€199/mese" },
      { name: "SLA 99.9%", price: "+€149/mese" },
      { name: "Formazione team", price: "+€499" },
    ],
  },
  {
    id: "seo-marketing",
    name: "SEO & Marketing",
    icon: "trending-up",
    description:
      "Cresci nei risultati — ottimizzazione, contenuti e campagne per portare clienti al tuo sito",
    startingPrice: "€299/mese",
    tiers: {
      base: { name: "Base", price: "€299", frequency: "al mese" },
      pro: { name: "Pro", price: "€599", frequency: "al mese" },
      premium: { name: "Premium", price: "€999", frequency: "al mese" },
    },
    features: [
      { name: "Audit SEO", base: true, pro: true, premium: true },
      {
        name: "Ottimizzazione on-page",
        base: true,
        pro: true,
        premium: true,
      },
      { name: "Content strategy", base: false, pro: true, premium: true },
      {
        name: "Social media",
        base: false,
        pro: "2 canali",
        premium: "4 canali",
      },
      {
        name: "Report",
        base: "Trimestrale",
        pro: "Mensile",
        premium: "Settimanale",
      },
      { name: "Campagne ads", base: false, pro: false, premium: true },
      { name: "Blog management", base: false, pro: false, premium: true },
    ],
    addOns: [
      { name: "Blog management", price: "+€199/mese" },
      { name: "Link building", price: "+€149/mese" },
      { name: "Analisi competitor", price: "+€299" },
    ],
  },
];
