import Link from "next/link";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

import { timeAgo } from "@/lib/agro/time-ago";
import { getTopNews } from "@/lib/agro/supabase/get-top-news";
import { generateBriefing } from "@/lib/agro/ai/generate-briefing";

export const metadata: Metadata = {
  title: "Briefing de hoje",
  description:
    "Resumo das notícias do agronegócio mais impactantes do dia, gerado por IA.",
  alternates: {
    canonical: "/agro/briefing",
  },
};

export default async function BriefingPage() {
  const news = await getTopNews(8);
  const briefing = await generateBriefing(news);

  const today = new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "full",
    timeZone: "America/Sao_Paulo",
  }).format(new Date());

  return (
    <div className="mx-auto max-w-3xl py-8">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
        Briefing diário
      </h2>

      <h1 className="mt-3 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
        As notícias mais importantes de hoje
      </h1>

      <p className="mt-1 text-sm capitalize text-zinc-400">{today}</p>

      {news.length === 0 ? (
        <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-10 text-center">
          <p className="text-sm font-semibold text-zinc-900">
            Ainda não há notícias para o briefing de hoje.
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            Assim que novas matérias forem coletadas, elas aparecem aqui.
          </p>
          <Link
            href="/agro"
            className="mt-6 inline-flex rounded-lg border border-zinc-200 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-700 transition hover:border-zinc-300 hover:shadow-sm"
          >
            Voltar ao feed
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-6 rounded-xl border border-emerald-600/20 bg-emerald-50 p-6">
            <p className="text-sm leading-7 text-emerald-900">
              {briefing.intro}
            </p>
          </div>

          <div className="mt-8 space-y-3">
            {briefing.items.map(({ news: item, summary }, index) => (
              <article
                key={item.id}
                className="rounded-xl border border-zinc-200 bg-white p-5 transition hover:border-zinc-300 hover:shadow-sm"
              >
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-bold text-emerald-600">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                    {item.category}
                  </span>
                  <span className="text-zinc-400">
                    {item.source} · {timeAgo(item.publishedAt, "pt")}
                  </span>
                </div>

                <Link href={`/agro/news/${item.id}`}>
                  <h2 className="mt-3 text-base font-semibold leading-snug text-zinc-900 transition hover:text-emerald-700">
                    {item.title}
                  </h2>
                </Link>

                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  {summary}
                </p>

                <Link
                  href={`/agro/news/${item.id}`}
                  className="mt-3 inline-flex text-xs font-semibold text-emerald-700 transition hover:text-emerald-600"
                >
                  Ler notícia completa →
                </Link>
              </article>
            ))}
          </div>

          <div className="mt-10 rounded-xl border border-zinc-200 bg-white p-5 text-center">
            <p className="text-xs text-zinc-500">
              Quer receber esse briefing todos os dias por e-mail?{" "}
              <Link
                href="/agro#newsletter"
                className="font-semibold text-emerald-700 hover:text-emerald-600"
              >
                Inscreva-se aqui
              </Link>
              .
            </p>
          </div>
        </>
      )}
    </div>
  );
}
