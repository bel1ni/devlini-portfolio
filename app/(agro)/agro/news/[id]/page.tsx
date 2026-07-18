import Link from "next/link";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

import { getBaseUrl } from "@/lib/agro/site-url";
import { timeAgo } from "@/lib/agro/time-ago";
import { readingTime } from "@/lib/agro/reading-time";
import { smartSummary } from "@/lib/agro/smart-summary";
import { getNewsById } from "@/lib/agro/supabase/get-news-by-id";
import { getRelatedNews } from "@/lib/agro/supabase/get-related-news";
import { summarizeNewsWithAI } from "@/lib/agro/ai/summarize-news";
import { updateNewsSummary } from "@/lib/agro/supabase/update-news-summary";
import MarkNewsAsRead from "@/components/agro/mark-news-as-read";
import NewsBookmarkButton from "@/components/agro/news-bookmark-button";
import NewsChat from "@/components/agro/news-chat";
import AdSlot from "@/components/agro/ad-slot";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  const news = await getNewsById(id);
  const baseUrl = getBaseUrl();

  if (!news) {
    return {
      title: "Notícia não encontrada",
    };
  }

  return {
    title: news.title,

    description: smartSummary(news.description, news.title, news.source),

    alternates: {
      canonical: `/agro/news/${id}`,
    },

    openGraph: {
      title: news.title,
      description: smartSummary(news.description, news.title, news.source),
      url: `${baseUrl}/agro/news/${id}`,
      siteName: "DEVLINI",
      type: "article",
    },

    twitter: {
      card: "summary_large_image",
      title: news.title,
      description: news.description,
    },
  };
}

export default async function NewsPage({ params }: Props) {
  const { id } = await params;

  const news = await getNewsById(id);

  const relatedNews = news ? await getRelatedNews(news.category, id) : [];

  if (!news) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-zinc-900">
            Notícia não encontrada
          </h1>

          <p className="mt-3 text-sm text-zinc-500">
            Essa notícia pode ter sido removida.
          </p>

          <Link
            href="/agro"
            className="mt-6 inline-flex rounded-lg border border-zinc-200 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-700 transition hover:border-zinc-300 hover:shadow-sm"
          >
            Voltar ao feed
          </Link>
        </div>
      </div>
    );
  }

  let summary = news.aiSummary || null;

  if (!summary) {
    const generatedSummary = await summarizeNewsWithAI({
      title: news.title,
      description: news.description,
      source: news.source,
    });

    if (generatedSummary) {
      summary = generatedSummary;

      await updateNewsSummary({
        id: news.id,
        aiSummary: generatedSummary,
      });
    }
  }

  if (!summary) {
    summary = smartSummary(news.description, news.title, news.source);
  }

  const reading = readingTime(summary);

  const baseUrl = getBaseUrl();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: news.title,
    description: summary,
    url: `${baseUrl}/agro/news/${id}`,
    datePublished: news.publishedAt || news.createdAt || undefined,
    inLanguage: "pt-BR",
    image: [`${baseUrl}/agro/opengraph-image`],
    author: {
      "@type": "Organization",
      name: news.source,
    },
    publisher: {
      "@type": "Organization",
      name: "DEVLINI Agro",
      url: `${baseUrl}/agro`,
    },
    isBasedOn: news.url,
  };

  return (
    <article className="mx-auto max-w-3xl py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <MarkNewsAsRead newsId={news.id} />

      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
          {news.category}
        </span>

        <span className="text-xs text-zinc-400">
          {timeAgo(news.publishedAt, "pt")}
        </span>
      </div>

      <h1 className="mt-4 text-2xl font-bold leading-tight tracking-tight text-zinc-900 sm:text-3xl">
        {news.title}
      </h1>

      <div className="mt-4">
        <NewsBookmarkButton
          id={news.id}
          title={news.title}
          description={news.description}
          source={news.source}
          category={news.category}
          url={news.url}
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-zinc-500">
        <span>
          Fonte: <span className="font-medium text-zinc-800">{news.source}</span>
        </span>

        <span>
          Impacto:{" "}
          <span className="font-medium text-emerald-700">{news.impact}%</span>
        </span>

        <span className="text-emerald-700">{reading}</span>
      </div>

      <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-6 sm:p-8">
        <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
          Resumo inteligente
        </span>

        <p className="mt-3 text-base leading-7 text-zinc-700">{summary}</p>
      </div>

      <NewsChat newsId={news.id} />

      <div className="mt-8 flex flex-wrap gap-3">
        <a
          href={news.url}
          target="_blank"
          rel="noreferrer"
          className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 active:scale-[0.97]"
        >
          Ler matéria original
        </a>

        <Link
          href="/agro"
          className="rounded-lg border border-zinc-200 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-700 transition hover:border-zinc-300 hover:shadow-sm active:scale-[0.97]"
        >
          Voltar ao feed
        </Link>
      </div>

      <AdSlot
        slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE}
        className="mt-10"
      />

      {relatedNews.length > 0 && (
        <div className="mt-14">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
            Notícias relacionadas
          </h2>

          <div className="mt-3 grid gap-3 md:grid-cols-3">
            {relatedNews.map((item) => (
              <Link
                key={item.id}
                href={`/agro/news/${item.id}`}
                className="rounded-xl border border-zinc-200 bg-white p-4 transition hover:border-zinc-300 hover:shadow-sm active:scale-[0.98]"
              >
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                  {item.category}
                </span>

                <h3 className="mt-3 text-sm font-semibold leading-snug text-zinc-900">
                  {item.title}
                </h3>

                <p className="mt-2 line-clamp-3 text-xs leading-5 text-zinc-500">
                  {item.description}
                </p>

                <div className="mt-4 flex items-center justify-between text-xs text-zinc-400">
                  <span>{item.source}</span>
                  <span>{timeAgo(item.publishedAt, "pt")}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
