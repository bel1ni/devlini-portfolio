import type { Locale } from "@/i18n/routing";

export type Localized = Record<Locale, string>;

export type ToolCategory = "gerador" | "conversor" | "formatador" | "calculadora";

export type Tool = {
  slug: string;
  // Emoji como ícone: zero import, renderiza em qualquer lugar, some no build.
  icon: string;
  category: ToolCategory;
  name: Localized;
  // Curta, para os cards do hub.
  description: Localized;
  // Mais longa, para a <meta description> e o topo da página da ferramenta.
  seoDescription: Localized;
  keywords: string[];
};

export const tools: Tool[] = [
  {
    slug: "gerador-de-senha",
    icon: "🔑",
    category: "gerador",
    name: { pt: "Gerador de senhas", en: "Password generator" },
    description: {
      pt: "Crie senhas fortes e aleatórias no seu navegador.",
      en: "Create strong, random passwords in your browser.",
    },
    seoDescription: {
      pt: "Gerador de senhas fortes e seguras, com tamanho e tipos de caracteres ajustáveis. Tudo roda no seu navegador — nenhuma senha é enviada para servidores.",
      en: "Strong, secure password generator with adjustable length and character types. Everything runs in your browser — no password is sent to any server.",
    },
    keywords: ["gerador de senha", "senha forte", "senha aleatória", "password generator"],
  },
  {
    slug: "gerador-uuid",
    icon: "🆔",
    category: "gerador",
    name: { pt: "Gerador de UUID", en: "UUID generator" },
    description: {
      pt: "Gere identificadores únicos UUID v4 na hora.",
      en: "Generate unique UUID v4 identifiers instantly.",
    },
    seoDescription: {
      pt: "Gere UUID v4 (identificadores únicos universais) em lote, prontos para copiar. 100% no navegador, usando a API de criptografia nativa.",
      en: "Generate UUID v4 (universally unique identifiers) in bulk, ready to copy. 100% in-browser, using the native crypto API.",
    },
    keywords: ["gerador de uuid", "uuid v4", "guid", "uuid generator"],
  },
  {
    slug: "base64",
    icon: "🔤",
    category: "conversor",
    name: { pt: "Codificador Base64", en: "Base64 encoder" },
    description: {
      pt: "Codifique e decodifique texto em Base64.",
      en: "Encode and decode text to and from Base64.",
    },
    seoDescription: {
      pt: "Codifique texto para Base64 ou decodifique Base64 de volta para texto, com suporte a acentos (UTF-8). Roda inteiramente no navegador.",
      en: "Encode text to Base64 or decode Base64 back to text, with full UTF-8 support. Runs entirely in the browser.",
    },
    keywords: ["base64", "codificar base64", "decodificar base64", "base64 encode decode"],
  },
  {
    slug: "formatador-json",
    icon: "{ }",
    category: "formatador",
    name: { pt: "Formatador de JSON", en: "JSON formatter" },
    description: {
      pt: "Formate, valide e minifique JSON.",
      en: "Format, validate and minify JSON.",
    },
    seoDescription: {
      pt: "Formatador e validador de JSON: identa, minifica e aponta erros de sintaxe com a linha do problema. Nenhum dado sai do seu navegador.",
      en: "JSON formatter and validator: indents, minifies and points out syntax errors with the line number. No data leaves your browser.",
    },
    keywords: ["formatador json", "validar json", "json formatter", "json beautifier", "minificar json"],
  },
  {
    slug: "gerador-hash",
    icon: "#️⃣",
    category: "gerador",
    name: { pt: "Gerador de hash", en: "Hash generator" },
    description: {
      pt: "Calcule hashes SHA-1, SHA-256 e SHA-512.",
      en: "Compute SHA-1, SHA-256 and SHA-512 hashes.",
    },
    seoDescription: {
      pt: "Calcule o hash SHA-1, SHA-256 ou SHA-512 de qualquer texto, usando a Web Crypto API nativa. O texto nunca sai do seu navegador.",
      en: "Compute the SHA-1, SHA-256 or SHA-512 hash of any text, using the native Web Crypto API. Your text never leaves the browser.",
    },
    keywords: ["gerador de hash", "sha256", "sha-256", "sha512", "hash generator"],
  },
  {
    slug: "juros-compostos",
    icon: "📈",
    category: "calculadora",
    name: { pt: "Juros compostos", en: "Compound interest" },
    description: {
      pt: "Simule o crescimento de um investimento com aportes.",
      en: "Simulate an investment's growth with contributions.",
    },
    seoDescription: {
      pt: "Calculadora de juros compostos com aporte mensal: veja quanto um investimento rende ao longo do tempo, com total investido e total em juros.",
      en: "Compound interest calculator with monthly contributions: see how an investment grows over time, with total invested and total interest.",
    },
    keywords: ["juros compostos", "calculadora de investimento", "compound interest calculator"],
  },
];

export function getTool(slug: string): Tool | undefined {
  return tools.find((tool) => tool.slug === slug);
}

// Rótulos de categoria para agrupar/nomear no hub.
export const categoryLabel: Record<ToolCategory, Localized> = {
  gerador: { pt: "Geradores", en: "Generators" },
  conversor: { pt: "Conversores", en: "Converters" },
  formatador: { pt: "Formatadores", en: "Formatters" },
  calculadora: { pt: "Calculadoras", en: "Calculators" },
};

// Textos de moldura das páginas de ferramentas (breadcrumb, seções). Ficam aqui
// em vez de messages/*.json para não inflar os dicionários do next-intl com
// strings específicas desta seção.
export const toolsCopy = {
  hubTitle: { pt: "Ferramentas gratuitas", en: "Free tools" },
  hubTagline: {
    pt: "Utilitários rápidos para o dia a dia de quem programa — 100% no seu navegador, sem cadastro e sem enviar seus dados para lugar nenhum.",
    en: "Quick everyday utilities for developers — 100% in your browser, no sign-up, and your data goes nowhere.",
  },
  home: { pt: "Início", en: "Home" },
  breadcrumb: { pt: "Ferramentas", en: "Tools" },
  otherTools: { pt: "Outras ferramentas", en: "Other tools" },
  privacyNote: {
    pt: "Roda inteiramente no seu navegador. Nada é enviado para servidores.",
    en: "Runs entirely in your browser. Nothing is sent to any server.",
  },
} satisfies Record<string, Localized>;
