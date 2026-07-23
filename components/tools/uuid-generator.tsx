"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import type { Locale } from "@/i18n/routing";
import { CopyButton } from "./copy-button";

const copy = {
  pt: { quantity: "Quantidade", generate: "Gerar novamente", copyAll: "Copiar todos" },
  en: { quantity: "Quantity", generate: "Generate again", copyAll: "Copy all" },
};

export default function UuidGenerator({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const [count, setCount] = useState(5);
  const [uuids, setUuids] = useState<string[]>([]);

  const generate = useCallback(() => {
    setUuids(Array.from({ length: count }, () => crypto.randomUUID()));
  }, [count]);

  useEffect(() => {
    generate();
  }, [generate]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end gap-3 rounded-xl border border-zinc-200 bg-white p-5">
        <label className="block">
          <span className="text-sm font-medium text-zinc-700">{t.quantity}</span>
          <input
            type="number"
            min={1}
            max={100}
            value={count}
            onChange={(e) =>
              setCount(Math.max(1, Math.min(100, Number(e.target.value) || 1)))
            }
            className="mt-1 block w-24 rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 outline-none focus:border-emerald-500"
          />
        </label>
        <button
          type="button"
          onClick={generate}
          className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-600 transition hover:border-zinc-300 hover:text-emerald-700 active:scale-[0.97]"
        >
          <RefreshCw size={14} />
          {t.generate}
        </button>
        <CopyButton value={uuids.join("\n")} locale={locale} className="ml-auto" />
      </div>

      <ul className="divide-y divide-zinc-100 overflow-hidden rounded-xl border border-zinc-200 bg-white">
        {uuids.map((uuid, i) => (
          <li
            key={`${uuid}-${i}`}
            className="flex items-center justify-between gap-3 px-4 py-2.5"
          >
            <code className="break-all font-mono text-sm text-zinc-800">{uuid}</code>
            <CopyButton value={uuid} locale={locale} className="shrink-0" />
          </li>
        ))}
      </ul>
    </div>
  );
}
