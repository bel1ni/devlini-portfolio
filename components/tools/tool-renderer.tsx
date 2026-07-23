"use client";

import type { ComponentType } from "react";
import type { Locale } from "@/i18n/routing";
import PasswordGenerator from "./password-generator";
import UuidGenerator from "./uuid-generator";
import Base64Tool from "./base64-tool";
import JsonFormatter from "./json-formatter";
import HashGenerator from "./hash-generator";
import CompoundInterest from "./compound-interest";

// Mapa slug → componente da ferramenta. A página (server) resolve o slug e
// delega a interação para o componente client correspondente.
const TOOLS: Record<string, ComponentType<{ locale: Locale }>> = {
  "gerador-de-senha": PasswordGenerator,
  "gerador-uuid": UuidGenerator,
  base64: Base64Tool,
  "formatador-json": JsonFormatter,
  "gerador-hash": HashGenerator,
  "juros-compostos": CompoundInterest,
};

export function ToolRenderer({ slug, locale }: { slug: string; locale: Locale }) {
  const Tool = TOOLS[slug];
  return Tool ? <Tool locale={locale} /> : null;
}
