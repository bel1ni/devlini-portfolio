"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import type { Locale } from "@/i18n/routing";
import { CopyButton } from "./copy-button";

const LOWER = "abcdefghijklmnopqrstuvwxyz";
const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const DIGITS = "0123456789";
const SYMBOLS = "!@#$%^&*()-_=+[]{};:,.?";

const copy = {
  pt: {
    length: "Tamanho",
    upper: "Maiúsculas (A-Z)",
    lower: "Minúsculas (a-z)",
    digits: "Números (0-9)",
    symbols: "Símbolos (!@#…)",
    generate: "Gerar nova senha",
    empty: "Selecione ao menos um tipo de caractere.",
    weak: "Fraca",
    medium: "Média",
    strong: "Forte",
    strength: "Força",
  },
  en: {
    length: "Length",
    upper: "Uppercase (A-Z)",
    lower: "Lowercase (a-z)",
    digits: "Numbers (0-9)",
    symbols: "Symbols (!@#…)",
    generate: "Generate new password",
    empty: "Select at least one character type.",
    weak: "Weak",
    medium: "Medium",
    strong: "Strong",
    strength: "Strength",
  },
};

// Índice aleatório uniforme via crypto (evita o viés do Math.random % n).
function randomIndex(max: number) {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0] % max;
}

export default function PasswordGenerator({ locale }: { locale: Locale }) {
  const t = copy[locale];

  const [length, setLength] = useState(16);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useDigits, setUseDigits] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [password, setPassword] = useState("");

  const generate = useCallback(() => {
    const pool =
      (useUpper ? UPPER : "") +
      (useLower ? LOWER : "") +
      (useDigits ? DIGITS : "") +
      (useSymbols ? SYMBOLS : "");

    if (!pool) {
      setPassword("");
      return;
    }

    let result = "";
    for (let i = 0; i < length; i++) result += pool[randomIndex(pool.length)];
    setPassword(result);
  }, [length, useUpper, useLower, useDigits, useSymbols]);

  useEffect(() => {
    generate();
  }, [generate]);

  const typesCount = [useUpper, useLower, useDigits, useSymbols].filter(Boolean).length;
  const strength =
    length >= 16 && typesCount >= 3
      ? t.strong
      : length >= 10 && typesCount >= 2
        ? t.medium
        : t.weak;
  const strengthCls =
    strength === t.strong
      ? "text-emerald-600"
      : strength === t.medium
        ? "text-amber-600"
        : "text-red-600";

  const toggles = [
    { label: t.upper, value: useUpper, set: setUseUpper },
    { label: t.lower, value: useLower, set: setUseLower },
    { label: t.digits, value: useDigits, set: setUseDigits },
    { label: t.symbols, value: useSymbols, set: setUseSymbols },
  ];

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-zinc-200 bg-white p-4">
        <div className="flex items-center gap-3">
          <output className="min-w-0 flex-1 break-all font-mono text-lg text-zinc-900">
            {password || <span className="text-zinc-300">—</span>}
          </output>
          <button
            type="button"
            onClick={generate}
            aria-label={t.generate}
            className="shrink-0 rounded-lg border border-zinc-200 bg-white p-2 text-zinc-500 transition hover:border-zinc-300 hover:text-emerald-700 active:scale-95"
          >
            <RefreshCw size={16} />
          </button>
          <CopyButton value={password} locale={locale} />
        </div>
        {password && (
          <p className="mt-3 text-xs text-zinc-400">
            {t.strength}: <span className={`font-semibold ${strengthCls}`}>{strength}</span>
          </p>
        )}
      </div>

      <div className="space-y-4 rounded-xl border border-zinc-200 bg-white p-5">
        <label className="block">
          <span className="flex items-center justify-between text-sm font-medium text-zinc-700">
            {t.length}
            <span className="font-mono text-emerald-700">{length}</span>
          </span>
          <input
            type="range"
            min={6}
            max={48}
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="mt-2 w-full accent-emerald-600"
          />
        </label>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {toggles.map((toggle) => (
            <label
              key={toggle.label}
              className="flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-700 transition hover:border-zinc-300"
            >
              <input
                type="checkbox"
                checked={toggle.value}
                onChange={(e) => toggle.set(e.target.checked)}
                className="size-4 accent-emerald-600"
              />
              {toggle.label}
            </label>
          ))}
        </div>

        {typesCount === 0 && <p className="text-xs text-red-600">{t.empty}</p>}
      </div>
    </div>
  );
}
