"use client";

import { useRouter } from "next/navigation";
import type { FeedAlert } from "@/lib/agro/alerts";
import type { InmetAlert, InmetSeverity } from "@/lib/agro/inmet";

type Props = {
  uf: string;
  inmetAlerts: InmetAlert[];
  newsAlerts: FeedAlert[];
};

// Aparência por severidade oficial do INMET (amarelo/laranja/vermelho).
const SEVERITY_UI: Record<
  InmetSeverity,
  { label: string; badgeCls: string }
> = {
  grande: {
    label: "Grande perigo",
    badgeCls: "bg-red-50 text-red-700 ring-red-600/20",
  },
  perigo: {
    label: "Perigo",
    badgeCls: "bg-orange-50 text-orange-700 ring-orange-600/20",
  },
  potencial: {
    label: "Perigo potencial",
    badgeCls: "bg-amber-50 text-amber-700 ring-amber-600/20",
  },
};

// Faixa de alertas acionáveis no topo do feed, para a UF do leitor.
// É o diferencial do BELAGRO: "te avisa antes de você perder prazo ou dinheiro".
// Clima vem do INMET (oficial); sanidade e crédito, das notícias.
export default function AlertBanner({ uf, inmetAlerts, newsAlerts }: Props) {
  const router = useRouter();

  if (inmetAlerts.length === 0 && newsAlerts.length === 0) return null;

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
        {inmetAlerts.map((alert) => {
          const ui = SEVERITY_UI[alert.severity];

          return (
            <li key={`inmet-${alert.id}`}>
              <a
                href="https://alertas.inmet.gov.br"
                target="_blank"
                rel="noreferrer"
                className="flex items-start gap-3 px-4 py-3 transition hover:bg-amber-100/50"
              >
                <span
                  className={`mt-0.5 shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ring-inset ${ui.badgeCls}`}
                >
                  ⚠️ {ui.label}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium text-zinc-800">
                    {alert.event}
                  </span>
                  {alert.risks && (
                    <span className="mt-0.5 line-clamp-2 block text-xs text-zinc-600">
                      {alert.risks}
                    </span>
                  )}
                  <span className="mt-0.5 block text-xs text-zinc-500">
                    INMET · {alert.window}
                  </span>
                </span>
              </a>
            </li>
          );
        })}

        {newsAlerts.map(({ item, alert }) => (
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
