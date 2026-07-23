"use client";

import { useRouter } from "next/navigation";
import type { FeedAlert } from "@/lib/agro/alerts";

type Props = {
  uf: string;
  alerts: FeedAlert[];
};

// Faixa de alertas acionáveis no topo do feed, para a UF do leitor.
// É o diferencial do BELAGRO: "te avisa antes de você perder prazo ou dinheiro".
export default function AlertBanner({ uf, alerts }: Props) {
  const router = useRouter();

  if (alerts.length === 0) return null;

  return (
    <section
      aria-label={`Alertas para ${uf}`}
      className="mt-6 overflow-hidden rounded-xl border border-amber-300 bg-amber-50/60"
    >
      <div className="flex items-center gap-2 border-b border-amber-200 px-4 py-2.5">
        <span className="text-sm">⚠️</span>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-amber-800">
          O que você precisa saber no {uf} hoje
        </h2>
      </div>

      <ul className="divide-y divide-amber-100">
        {alerts.map(({ item, alert }) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => router.push(`/agro/news/${item.id}`)}
              className="flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-amber-100/50 active:scale-[0.99]"
            >
              <span
                className={`mt-0.5 shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ring-inset ${alert.badgeCls}`}
              >
                {alert.emoji} {alert.label}
              </span>

              <span className="min-w-0 flex-1">
                <span className="line-clamp-2 text-sm font-medium text-zinc-800">
                  {item.title}
                </span>
                <span className="mt-0.5 block truncate text-xs text-zinc-500">
                  {item.source}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
