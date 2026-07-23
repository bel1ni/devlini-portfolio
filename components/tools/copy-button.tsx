"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import type { Locale } from "@/i18n/routing";

type Props = {
  value: string;
  locale: Locale;
  className?: string;
};

// Botão "Copiar" com feedback de 1,5s. Reusado por todas as ferramentas.
export function CopyButton({ value, locale, className }: Props) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard indisponível (ex.: contexto inseguro) — ignora silenciosamente
    }
  }

  const label = copied
    ? locale === "pt"
      ? "Copiado!"
      : "Copied!"
    : locale === "pt"
      ? "Copiar"
      : "Copy";

  return (
    <button
      type="button"
      onClick={copy}
      disabled={!value}
      className={`inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-600 transition hover:border-zinc-300 hover:text-zinc-900 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 ${className ?? ""}`}
    >
      {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
      {label}
    </button>
  );
}
