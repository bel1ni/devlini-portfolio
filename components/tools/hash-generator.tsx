"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/i18n/routing";
import { CopyButton } from "./copy-button";

const ALGOS = ["SHA-1", "SHA-256", "SHA-512"] as const;
type Algo = (typeof ALGOS)[number];

const copy = {
  pt: { input: "Texto", placeholder: "Digite ou cole o texto…", empty: "—" },
  en: { input: "Text", placeholder: "Type or paste text…", empty: "—" },
};

async function digest(algo: Algo, text: string) {
  const data = new TextEncoder().encode(text);
  const buffer = await crypto.subtle.digest(algo, data);
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export default function HashGenerator({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const [input, setInput] = useState("");
  const [hashes, setHashes] = useState<Record<Algo, string>>({
    "SHA-1": "",
    "SHA-256": "",
    "SHA-512": "",
  });

  useEffect(() => {
    let active = true;
    if (!input) {
      setHashes({ "SHA-1": "", "SHA-256": "", "SHA-512": "" });
      return;
    }
    Promise.all(ALGOS.map((algo) => digest(algo, input))).then((results) => {
      if (!active) return;
      setHashes({
        "SHA-1": results[0],
        "SHA-256": results[1],
        "SHA-512": results[2],
      });
    });
    return () => {
      active = false;
    };
  }, [input]);

  return (
    <div className="space-y-5">
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-zinc-700">{t.input}</span>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t.placeholder}
          rows={4}
          className="w-full resize-y rounded-xl border border-zinc-200 bg-white p-3 font-mono text-sm text-zinc-900 outline-none focus:border-emerald-500"
        />
      </label>

      <div className="space-y-3">
        {ALGOS.map((algo) => (
          <div key={algo} className="rounded-xl border border-zinc-200 bg-white p-4">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
                {algo}
              </span>
              {hashes[algo] && <CopyButton value={hashes[algo]} locale={locale} />}
            </div>
            <code className="block break-all font-mono text-sm text-zinc-800">
              {hashes[algo] || <span className="text-zinc-300">{t.empty}</span>}
            </code>
          </div>
        ))}
      </div>
    </div>
  );
}
