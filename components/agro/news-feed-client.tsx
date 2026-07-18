"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import NewsCard from "./news-card";
import { timeAgo } from "@/lib/agro/time-ago";
import { getReadNews } from "@/lib/agro/read-news";
import { getBookmarkedIds } from "@/lib/agro/supabase/save-bookmark";
import type { NewsItem } from "@/types/agro-news";

const categories = [
  "Todas",
  "Pecuária",
  "Agricultura",
  "Mercado",
  "Clima",
  "Política Agro",
  "AgTech",
  "Sustentabilidade",
  "Agronegócio",
];

type Props = {
  news: NewsItem[];
};

const ITEMS_PER_PAGE = 20;

export default function NewsFeedClient({ news }: Props) {
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [pageByFilter, setPageByFilter] = useState<Record<string, number>>({});
  const [readNews] = useState<string[]>(() => getReadNews());
  const [savedNews, setSavedNews] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  const searchParams = useSearchParams();
  const search = searchParams.get("q") ?? "";

  const pageKey = `${selectedCategory}-${search}`;
  const currentPage = pageByFilter[pageKey] || 1;

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setMounted(true);
    }, 0);

    return () => window.clearTimeout(timeout);
  }, []);

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

        const searchContent = `
          ${item.title}
          ${item.description}
          ${item.category}
          ${item.source}
        `.toLowerCase();

        const matchesSearch = searchContent.includes(search.toLowerCase());

        return matchesCategory && matchesSearch;
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

        return b.impact - a.impact;
      });
  }, [news, selectedCategory, search, readNews, savedNews, mounted]);

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
