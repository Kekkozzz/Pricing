export type Feature = {
  name: string;
  base: string | boolean;
  pro: string | boolean;
  premium: string | boolean;
};

export type AddOn = {
  name: string;
  price: string;
  priceNumeric: number;
  recurring: boolean;
  description: string;
};

export type Tier = {
  name: string;
  price: string;
  priceNumeric: number;
  frequency: string;
  summary: string;
};

export type ServiceCategory = {
  id: string;
  name: string;
  icon: string;
  lottie?: string;
  description: string;
  startingPrice: string;
  tiers: {
    base: Tier;
    pro: Tier;
    premium: Tier;
  };
  features: Feature[];
  addOns: AddOn[];
};

export const categories: ServiceCategory[] = [
  {
    id: "siti-web",
    name: "Siti Web",
    icon: "globe",
    lottie: "/Website.json",
    description:
      "Fatti trovare online — siti responsive con design su misura, SEO e gestione contenuti inclusa",
    startingPrice: "€499",
    tiers: {
      base: {
        name: "Base",
        price: "€499",
        priceNumeric: 499,
        frequency: "una tantum",
        summary: "1–3 pagine · Template · 3–5 giorni",
      },
      pro: {
        name: "Pro",
        price: "€999",
        priceNumeric: 999,
        frequency: "una tantum",
        summary: "5–8 pagine · Custom · 5–7 giorni",
      },
      premium: {
        name: "Premium",
        price: "€1.999",
        priceNumeric: 1999,
        frequency: "una tantum",
        summary: "Illimitate · Premium · 7–10 giorni",
      },
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
      { name: "Revisioni", base: "1", pro: "3", premium: "Illimitate" },
    ],
    addOns: [
      {
        name: "Manutenzione",
        price: "+€49/mese",
        priceNumeric: 49,
        recurring: true,
        description: "Aggiornamenti, backup e monitoraggio",
      },
      {
        name: "Hosting gestito",
        price: "+€9/mese",
        priceNumeric: 9,
        recurring: true,
        description: "Server veloce e sicuro",
      },
      {
        name: "Copywriting",
        price: "+€199",
        priceNumeric: 199,
        recurring: false,
        description: "Testi professionali per ogni pagina",
      },
    ],
  },
  {
    id: "shop-saas",
    name: "Shop & SaaS",
    icon: "shopping-bag",
    lottie: "/Saas.json",
    description:
      "Vendi online dal giorno uno — shop completo con pagamenti sicuri, checkout Stripe e area clienti",
    startingPrice: "€999",
    tiers: {
      base: {
        name: "Base",
        price: "€999",
        priceNumeric: 999,
        frequency: "una tantum",
        summary: "Landing + checkout · 3 prodotti · 5–7 giorni",
      },
      pro: {
        name: "Pro",
        price: "€1.999",
        priceNumeric: 1999,
        frequency: "una tantum",
        summary: "Shop completo · 20 prodotti · 7–10 giorni",
      },
      premium: {
        name: "Premium",
        price: "€3.999",
        priceNumeric: 3999,
        frequency: "una tantum",
        summary: "Piattaforma SaaS · Illimitati · 10–15 giorni",
      },
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
      { name: "Abbonamenti ricorrenti", base: false, pro: true, premium: true },
      { name: "Area clienti", base: false, pro: "Base", premium: "Avanzata" },
      { name: "Coupon e sconti", base: false, pro: true, premium: true },
      { name: "Webhook e automazioni", base: false, pro: false, premium: true },
      { name: "Email transazionali", base: true, pro: true, premium: true },
      {
        name: "Consegna",
        base: "5–7 giorni",
        pro: "7–10 giorni",
        premium: "10–15 giorni",
      },
      { name: "Revisioni", base: "1", pro: "3", premium: "Illimitate" },
    ],
    addOns: [
      {
        name: "Manutenzione",
        price: "+€79/mese",
        priceNumeric: 79,
        recurring: true,
        description: "Aggiornamenti e monitoraggio continuo",
      },
      {
        name: "Migrazione dati",
        price: "+€499",
        priceNumeric: 499,
        recurring: false,
        description: "Trasferimento dati dalla piattaforma attuale",
      },
      {
        name: "Formazione",
        price: "+€299",
        priceNumeric: 299,
        recurring: false,
        description: "Training per gestire la piattaforma",
      },
    ],
  },
  {
    id: "web-app",
    name: "Web App",
    icon: "zap",
    lottie: "/WebApp.json",
    description:
      "Digitalizza i tuoi processi — applicazioni web su misura con dashboard, notifiche e supporto dedicato",
    startingPrice: "€2.999",
    tiers: {
      base: {
        name: "Base",
        price: "€2.999",
        priceNumeric: 2999,
        frequency: "una tantum",
        summary: "Semplice · 100 utenti · 7–10 giorni",
      },
      pro: {
        name: "Pro",
        price: "€5.999",
        priceNumeric: 5999,
        frequency: "una tantum",
        summary: "Media · 1.000 utenti · 10–15 giorni",
      },
      premium: {
        name: "Premium",
        price: "Su prev.",
        priceNumeric: 0,
        frequency: "personalizzato",
        summary: "Elevata · Illimitati · Da concordare",
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
      { name: "Revisioni", base: "2", pro: "5", premium: "Illimitate" },
    ],
    addOns: [
      {
        name: "Supporto dedicato",
        price: "+€199/mese",
        priceNumeric: 199,
        recurring: true,
        description: "Assistenza prioritaria con SLA",
      },
      {
        name: "SLA 99.9%",
        price: "+€149/mese",
        priceNumeric: 149,
        recurring: true,
        description: "Garanzia di uptime con penali",
      },
      {
        name: "Formazione team",
        price: "+€499",
        priceNumeric: 499,
        recurring: false,
        description: "Sessioni di training per il team",
      },
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
      base: {
        name: "Base",
        price: "€299",
        priceNumeric: 299,
        frequency: "al mese",
        summary: "Audit SEO · On-page · Report trimestrale",
      },
      pro: {
        name: "Pro",
        price: "€599",
        priceNumeric: 599,
        frequency: "al mese",
        summary: "Content strategy · 2 social · Report mensile",
      },
      premium: {
        name: "Premium",
        price: "€999",
        priceNumeric: 999,
        frequency: "al mese",
        summary: "4 social · Ads · Blog · Report settimanale",
      },
    },
    features: [
      { name: "Audit SEO", base: true, pro: true, premium: true },
      { name: "Ottimizzazione on-page", base: true, pro: true, premium: true },
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
      {
        name: "Blog management",
        price: "+€199/mese",
        priceNumeric: 199,
        recurring: true,
        description: "Creazione e pubblicazione articoli",
      },
      {
        name: "Link building",
        price: "+€149/mese",
        priceNumeric: 149,
        recurring: true,
        description: "Acquisizione backlink da siti autorevoli",
      },
      {
        name: "Analisi competitor",
        price: "+€299",
        priceNumeric: 299,
        recurring: false,
        description: "Report dettagliato sui competitor",
      },
    ],
  },
];
