import type { Locale } from "@/i18n/routing";

export type Localized = Record<Locale, string>;

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://devlini.com";

export const profile = {
  name: "Mariane Belini",
  headline: {
    pt: "Desenvolvedora full-stack & fundadora do controledegado.app",
    en: "Full-stack developer & founder of controledegado.app",
  } satisfies Localized,
  bio: {
    pt: "Dev full stack com domínio em Inteligência Artificial, construindo melhorias para o agronegócio. Criei do zero o controledegado.app — gestão de rebanho de ponta a ponta, do banco de dados à Play Store.",
    en: "Full-stack dev at Chateau Labs, building SaaS for agribusiness. I created controledegado.app from scratch — livestock management end to end, from the database to the Play Store.",
  } satisfies Localized,
  location: { pt: "Brasil", en: "Brazil" } satisfies Localized,
  // E-mail público do site (marca); o pessoal fica para uso interno/admin
  email: "devlinibr@gmail.com",
  personalEmail: "mariane.r.belini@gmail.com",
  avatar: "/avatar.jpg",
};

export const techStack = [
  "TypeScript",
  "React",
  "React Native",
  "Node.js",
  "Python",
  "Supabase",
  "PostgreSQL",
];

export type SocialLink = {
  id: string;
  label: string;
  url: string;
  icon: "github" | "linkedin" | "instagram" | "x" | "mail";
};

export const socialLinks: SocialLink[] = [
  { id: "github", label: "GitHub", url: "https://github.com/bel1ni", icon: "github" },
  {
    id: "linkedin",
    label: "LinkedIn",
    url: "https://www.linkedin.com/in/marianebelini/",
    icon: "linkedin",
  },
  {
    id: "instagram-devlini",
    label: "Instagram DEVLINI",
    url: "https://www.instagram.com/devlini_/",
    icon: "instagram",
  },
  {
    id: "instagram-pessoal",
    label: "Instagram pessoal",
    url: "https://www.instagram.com/belini_mariane/",
    icon: "instagram",
  },
  {
    id: "x",
    label: "X / Twitter",
    url: "https://x.com/marianedevlini",
    icon: "x",
  },
  {
    id: "email",
    label: "E-mail",
    url: `mailto:${profile.email}`,
    icon: "mail",
  },
];

export type MainLink = {
  id: string;
  label: Localized;
  description?: Localized;
  url: string;
};

// Cards de link principais (o "linktree"). TODO(Mariane): URLs reais.
export const mainLinks: MainLink[] = [
  {
    id: "controledegado",
    label: {
      pt: "controledegado.app — gestão de rebanho",
      en: "controledegado.app — livestock management",
    },
    url: "https://controledegado.app",
  },
  {
    id: "devlini-agro",
    label: {
      pt: "AGROLINI — notícias do agronegócio",
      en: "AGROLINI — agribusiness news",
    },
    url: "/agro",
  },
  {
    id: "curriculo",
    label: { pt: "Currículo (PDF)", en: "Résumé (PDF)" },
    url: "/curriculo-mariane-belini.pdf",
  },
  {
    id: "github-link",
    label: { pt: "Meus projetos no GitHub", en: "My projects on GitHub" },
    url: "https://github.com/bel1ni",
  },
];

export type Project = {
  id: string;
  name: string;
  description: Localized;
  tech: string[];
  status: "live" | "building" | "paused";
  url?: string;
};

export const projects: Project[] = [
  {
    id: "controledegado",
    name: "controledegado.app",
    description: {
      pt: "SaaS de gestão de rebanho para produtores rurais: controle de animais, pesagens e manejo em um app simples, por assinatura.",
      en: "Livestock management SaaS for farmers: animal records, weighing and handling in one simple subscription app.",
    },
    tech: ["React", "TypeScript", "Supabase", "PWA"],
    status: "live",
    url: "https://controledegado.app",
  },
  {
    id: "devlini-agro",
    name: "AGROLINI",
    description: {
      pt: "Portal de notícias do agronegócio brasileiro: pecuária, agricultura, mercado e clima agregados de fontes como Canal Rural e Embrapa, com resumos por IA e briefing diário por e-mail.",
      en: "Brazilian agribusiness news portal: livestock, farming, market and weather aggregated from sources like Canal Rural and Embrapa, with AI summaries and a daily email briefing.",
    },
    tech: ["Next.js", "Supabase", "OpenRouter"],
    status: "live",
    url: "/agro",
  },
  {
    id: "techjournal",
    name: "Tech Journal",
    description: {
      pt: "Aplicação web para registro e organização de artigos e aprendizados em tecnologia.",
      en: "Web app for logging and organizing tech articles and learnings.",
    },
    tech: ["React", "TypeScript", "Vite"],
    status: "live",
    url: "https://techjournal.vercel.app",
  },
  {
    id: "linkhub",
    name: "Link Hub",
    description: {
      pt: "Este site: portfolio bilíngue, hub de links com tracking e espaço de mídia self-serve — construído em público.",
      en: "This site: a bilingual portfolio, link hub with click tracking and self-serve ad space — built in public.",
    },
    tech: ["Next.js", "Tailwind CSS", "next-intl"],
    status: "building",
  },
];

export type Product = {
  id: string;
  name: string;
  tagline: Localized;
  priceNote: Localized;
  cta: Localized;
  url: string;
};

export const products: Product[] = [
  {
    id: "controledegado",
    name: "controledegado.app",
    tagline: {
      pt: "Pare de controlar o rebanho no caderno. Animais, pesagens e manejo organizados no celular.",
      en: "Stop tracking your herd on paper. Animals, weighing and handling organized on your phone.",
    },
    priceNote: {
      pt: "Assinatura mensal — planos no site",
      en: "Monthly subscription — plans on the site",
    },
    cta: { pt: "Conhecer os planos", en: "See the plans" },
    url: "https://controledegado.app", // order bump: futuro, no checkout do próprio app (ver PRD §4.4)
  },
];

export type Ad = {
  id: string;
  title: string;
  description: Localized;
  url: string;
  imageUrl?: string;
};

// 3 slots. null = slot vago (mostra o card "Anuncie aqui").
// Slot 1 preenchido como demonstração com o próprio app.
export const ads: (Ad | null)[] = [
  {
    id: "demo-controledegado",
    title: "controledegado.app",
    description: {
      pt: "Gestão de rebanho simples, no celular. Teste grátis.",
      en: "Simple livestock management on your phone. Free trial.",
    },
    url: "https://controledegado.app",
  },
  null,
  null,
];

export type AdPlan = {
  id: string;
  price: number; // BRL
  days: number;
  duration: Localized;
  featured: boolean;
};

// Preços de lançamento decididos na entrevista (PRD §4.7): decoy / alvo / âncora
export const adPlans: AdPlan[] = [
  { id: "week", price: 19, days: 7, duration: { pt: "1 semana", en: "1 week" }, featured: false },
  { id: "month", price: 49, days: 30, duration: { pt: "1 mês", en: "1 month" }, featured: true },
  { id: "quarter", price: 119, days: 90, duration: { pt: "3 meses", en: "3 months" }, featured: false },
];

/** Anexa UTM de atribuição a links externos (PRD §4.2/§4.4). */
export function withUtm(url: string, content?: string): string {
  if (!url.startsWith("http")) return url;
  const u = new URL(url);
  u.searchParams.set("utm_source", "linkhub");
  u.searchParams.set("utm_medium", "referral");
  if (content) u.searchParams.set("utm_content", content);
  return u.toString();
}
