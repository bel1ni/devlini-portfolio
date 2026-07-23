"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import NewsCard from "./news-card";
import AlertBanner from "./alert-banner";
import { timeAgo } from "@/lib/agro/time-ago";
import { getReadNews } from "@/lib/agro/read-news";
import { getBookmarkedIds } from "@/lib/agro/supabase/save-bookmark";
import { getAlertsForUf } from "@/lib/agro/alerts";
import { inmetAlertsForUf, type InmetAlert } from "@/lib/agro/inmet";
import type { NewsItem } from "@/types/agro-news";

const categories = [
  "Todas",
  "Pecuária",
  "Agricultura",
  "Mercado",
  "Clima",
  "Sanidade",
  "Política Agro",
  "AgTech",
  "Sustentabilidade",
  "Agronegócio",
];

type Props = {
  news: NewsItem[];
  inmetAlerts: InmetAlert[];
};

const ITEMS_PER_PAGE = 20;
const UF_STORAGE_KEY = "belagro:uf";

export default function NewsFeedClient({ news, inmetAlerts }: Props) {
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [selectedUf, setSelectedUf] = useState("Todos");
  const [pageByFilter, setPageByFilter] = useState<Record<string, number>>({});
  const [readNews] = useState<string[]>(() => getReadNews());
  const [savedNews, setSavedNews] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  const searchParams = useSearchParams();
  const search = searchParams.get("q") ?? "";

  const pageKey = `${selectedCategory}-${selectedUf}-${search}`;
  const currentPage = pageByFilter[pageKey] || 1;

  // Estados presentes nas notícias carregadas (ex.: PR via ADAPAR/IDR)
  const availableUfs = useMemo(
    () =>
      [...new Set(news.map((item) => item.uf).filter(Boolean))].sort() as string[],
    [news]
  );

  useEffect(() => {
    // Restaura a UF escolhida pelo leitor (só vale se ainda houver notícias
    // dessa UF no feed; senão fica em "Todos").
    const storedUf = window.localStorage.getItem(UF_STORAGE_KEY);
    if (storedUf && (storedUf === "Todos" || availableUfs.includes(storedUf))) {
      setSelectedUf(storedUf);
    }

    const timeout = window.setTimeout(() => {
      setMounted(true);
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [availableUfs]);

  function handleSelectUf(uf: string) {
    setSelectedUf(uf);
    window.localStorage.setItem(UF_STORAGE_KEY, uf);
  }

  // Alertas para a UF do leitor: avisos oficiais do INMET (clima) + sanidade e
  // crédito derivados das notícias. Só aparece quando há uma UF escolhida — no
  // "Todos" seria ruído nacional demais.
  const ufInmetAlerts = useMemo(
    () => (selectedUf === "Todos" ? [] : inmetAlertsForUf(inmetAlerts, selectedUf)),
    [inmetAlerts, selectedUf]
  );

  const ufNewsAlerts = useMemo(
    () => (selectedUf === "Todos" ? [] : getAlertsForUf(news, selectedUf).slice(0, 4)),
    [news, selectedUf]
  );

  useEffect(() => {
    if (!mounted) return;

    async function loadSavedNews() {
      const savedIds = await getBookmarkedIds();
      setSavedNews(savedIds);
    }

    loadSavedNews();
  }, [mounted]);

  const filteredNews = useMemo(() => {
    if (!mounted) return [];

    return news
      .filter((item) => {
        const matchesCategory =
          selectedCategory === "Todas" || item.category === selectedCategory;

        const matchesUf = selectedUf === "Todos" || item.uf === selectedUf;

        const searchContent = `
          ${item.title}
          ${item.description}
          ${item.category}
          ${item.source}
        `.toLowerCase();

        const matchesSearch = searchContent.includes(search.toLowerCase());

        return matchesCategory && matchesUf && matchesSearch;
      })
      .sort((a, b) => {
        const aRead = readNews.includes(String(a.id));
        const bRead = readNews.includes(String(b.id));

        const aSaved = savedNews.includes(String(a.id));
        const bSaved = savedNews.includes(String(b.id));

        const aShouldGoDown = aRead && !aSaved;
        const bShouldGoDown = bRead && !bSaved;

        if (aShouldGoDown !== bShouldGoDown) {
          return aShouldGoDown ? 1 : -1;
        }

        // Feed de notícia: mais recente primeiro. Impacto só desempata quando
        // duas matérias saíram quase ao mesmo tempo — assim o topo nunca fica
        // preso num item antigo e o feed parece sempre atualizado.
        const byRecency =
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();

        if (byRecency !== 0) return byRecency;

        return b.impact - a.impact;
      });
  }, [news, selectedCategory, selectedUf, search, readNews, savedNews, mounted]);

  if (!mounted) {
    return <p className="mt-10 text-sm text-zinc-500">Carregando notícias...</p>;
  }

  const visibleNews = filteredNews.slice(0, currentPage * ITEMS_PER_PAGE);

  const mainNews = visibleNews[0];
  const secondaryHighLights = visibleNews.slice(1, 3);
  const remainingNews = visibleNews.slice(3);

  const hasMoreNews = visibleNews.length < filteredNews.length;

  return (
    <div className="mt-10">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
          Últimas notícias
        </h2>

        {search && (
          <p className="text-xs text-emerald-700">Buscando por: {search}</p>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition active:scale-[0.97] ${
              selectedCategory === category
                ? "border-emerald-600 bg-emerald-600 text-white"
                : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {availableUfs.length > 0 && (
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-zinc-400">Estado:</span>

          {["Todos", ...availableUfs].map((uf) => (
            <button
              key={uf}
              onClick={() => handleSelectUf(uf)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition active:scale-[0.97] ${
                selectedUf === uf
                  ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                  : "border-zinc-200 bg-white text-zinc-500 hover:border-zinc-300"
              }`}
            >
              {uf}
            </button>
          ))}
        </div>
      )}

      {selectedUf !== "Todos" && (
        <AlertBanner
          uf={selectedUf}
          inmetAlerts={ufInmetAlerts}
          newsAlerts={ufNewsAlerts}
        />
      )}

      {!mainNews ? (
        <div className="mt-6 rounded-xl border border-zinc-200 bg-white p-10 text-center">
          <p className="text-sm font-semibold text-zinc-900">
            Nenhuma notícia encontrada nessa categoria.
          </p>

          <p className="mt-1 text-xs text-zinc-500">
            Tente selecionar outra categoria.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-6 grid gap-3 lg:grid-cols-3">
            <NewsCard
              id={mainNews.id}
              key={mainNews.id}
              category={mainNews.category}
              title={mainNews.title}
              description={mainNews.description}
              impact={mainNews.impact}
              source={mainNews.source}
              time={timeAgo(mainNews.publishedAt, "pt")}
              featured={mainNews.featured}
              url={mainNews.url}
              logo={mainNews.logo}
              initiallySaved={savedNews.includes(String(mainNews.id))}
              large
            />

            {secondaryHighLights.map((item) => (
              <NewsCard
                id={item.id}
                key={item.id}
                category={item.category}
                title={item.title}
                description={item.description}
                impact={item.impact}
                source={item.source}
                time={timeAgo(item.publishedAt, "pt")}
                featured={item.featured}
                url={item.url}
                logo={item.logo}
                initiallySaved={savedNews.includes(String(item.id))}
              />
            ))}
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {remainingNews.map((item) => (
              <NewsCard
                id={item.id}
                key={item.id}
                category={item.category}
                title={item.title}
                description={item.description}
                impact={item.impact}
                source={item.source}
                time={timeAgo(item.publishedAt, "pt")}
                featured={item.featured}
                url={item.url}
                logo={item.logo}
                initiallySaved={savedNews.includes(String(item.id))}
                compact
              />
            ))}
          </div>

          {hasMoreNews && (
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={() =>
                  setPageByFilter((currentPages) => ({
                    ...currentPages,
                    [pageKey]: currentPage + 1,
                  }))
                }
                className="rounded-lg border border-zinc-200 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-700 transition hover:border-zinc-300 hover:shadow-sm active:scale-[0.97]"
              >
                Carregar mais notícias
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
