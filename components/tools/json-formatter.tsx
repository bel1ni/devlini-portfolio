"use client";

import { useState } from "react";
import type { Locale } from "@/i18n/routing";
import { CopyButton } from "./copy-button";

const copy = {
  pt: {
    input: "Cole seu JSON",
    format: "Formatar",
    minify: "Minificar",
    output: "Resultado",
    placeholder: '{ "exemplo": true }',
    valid: "JSON válido",
    error: "Erro",
  },
  en: {
    input: "Paste your JSON",
    format: "Format",
    minify: "Minify",
    output: "Result",
    placeholder: '{ "example": true }',
    valid: "Valid JSON",
    error: "Error",
  },
};

export default function JsonFormatter({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [ok, setOk] = useState(false);

  function run(minify: boolean) {
    if (!input.trim()) {
      setOutput("");
      setError("");
      setOk(false);
      return;
    }
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, minify ? 0 : 2));
      setError("");
      setOk(true);
    } catch (e) {
      setOutput("");
      setOk(false);
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-zinc-700">{t.input}</span>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.placeholder}
            rows={14}
            spellCheck={false}
            className="w-full resize-y rounded-xl border border-zinc-200 bg-white p-3 font-mono text-sm text-zinc-900 outline-none focus:border-emerald-500"
          />
        </label>

        <label className="block">
          <span className="mb-1 flex items-center justify-between text-sm font-medium text-zinc-700">
            {t.output}
            {output && <CopyButton value={output} locale={locale} />}
          </span>
          <textarea
            value={output}
            readOnly
            rows={14}
            spellCheck={false}
            className="w-full resize-y rounded-xl border border-zinc-200 bg-zinc-50 p-3 font-mono text-sm text-zinc-900 outline-none"
          />
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => run(false)}
          className="rounded-lg bg-emerald-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 active:scale-[0.97]"
        >
          {t.format}
        </button>
        <button
          type="button"
          onClick={() => run(true)}
          className="rounded-lg border border-zinc-200 bg-white px-5 py-2 text-sm font-semibold text-zinc-700 transition hover:border-zinc-300 active:scale-[0.97]"
        >
          {t.minify}
        </button>

        {ok && (
          <span className="text-sm font-medium text-emerald-600">✓ {t.valid}</span>
        )}
        {error && (
          <span className="text-sm text-red-600">
            {t.error}: {error}
          </span>
        )}
      </div>
    </div>
  );
}
