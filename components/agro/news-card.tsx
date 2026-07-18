"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Bookmark, Check } from "lucide-react";
import { saveBookmark, removeBookmark } from "@/lib/agro/supabase/save-bookmark";
import { hasReadNews } from "@/lib/agro/read-news";

type NewsCardProps = {
  id: string | number;
  category: string;
  title: string;
  description: string;
  impact: number;
  source: string;
  time: string;
  featured: boolean;
  url: string;
  logo: string;
  initiallySaved?: boolean;
  large?: boolean;
  compact?: boolean;
};

export default function NewsCard({
  id,
  category,
  title,
  description,
  impact,
  source,
  time,
  featured,
  url,
  logo,
  initiallySaved = false,
  large,
  compact,
}: NewsCardProps) {
  const router = useRouter();

  const [savedOverride, setSavedOverride] = useState<boolean | null>(null);
  const [read] = useState(() => hasReadNews(id));
  const [loadingBookmark, setLoadingBookmark] = useState(false);

  const saved = savedOverride ?? initiallySaved;

  function openNews() {
    router.push(`/agro/news/${id}`);
  }

  return (
    <article
      role="link"
      tabIndex={0}
      onClick={openNews}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openNews();
        }
      }}
      className={`relative cursor-pointer rounded-xl border bg-white transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-sm active:scale-[0.99] ${
        large
          ? "p-6 sm:p-8 lg:col-span-2"
          : compact
            ? "p-4 sm:p-5"
            : "p-5 sm:p-6"
      } ${featured ? "border-emerald-600/30" : "border-zinc-200"}`}
    >
      <button
        type="button"
        disabled={loadingBookmark}
        onClick={async (event) => {
          event.stopPropagation();

          if (loadingBookmark) return;

          setLoadingBookmark(true);

          try {
            if (saved) {
              await removeBookmark(id);
              setSavedOverride(false);
              return;
            }

            const result = await saveBookmark({
              id,
              title,
              description,
              source,
              category,
              url,
            });

            if (!result) {
              setSavedOverride(false);
              return;
            }

            setSavedOverride(true);
          } finally {
            setLoadingBookmark(false);
          }
        }}
        className={`absolute right-4 top-4 z-20 rounded-full border p-2 transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 ${
          saved
            ? "border-emerald-600/40 bg-emerald-50 text-emerald-700"
            : "border-zinc-200 bg-white text-zinc-400 hover:border-zinc-300 hover:text-emerald-700"
        }`}
        aria-label={saved ? "Remover dos salvos" : "Salvar notícia"}
      >
        <Bookmark
          size={16}
          fill={saved ? "currentColor" : "none"}
          className={loadingBookmark ? "animate-pulse" : ""}
        />
      </button>

      <div>
        <div className="mb-3 flex flex-wrap items-center gap-2 pr-12">
          <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
            {category}
          </span>

          {large && featured && (
            <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-red-600 ring-1 ring-inset ring-red-600/20">
              Destaque
            </span>
          )}

          {read && (
            <span className="flex items-center gap-1 rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-500">
              <Check size={12} />
              Lida
            </span>
          )}

          <span className="ml-auto text-xs text-zinc-400">{time}</span>
        </div>

        <h3
          className={`font-semibold text-zinc-900 transition hover:text-emerald-700 ${
            large ? "text-xl leading-snug sm:text-2xl" : "text-base leading-snug"
          }`}
        >
          {title}
        </h3>

        <p
          className={`mt-2 text-zinc-500 ${
            large
              ? "line-clamp-4 text-sm leading-6"
              : "line-clamp-3 text-xs leading-5"
          }`}
        >
          {description}
        </p>

        <div className="mt-4 flex items-center justify-between gap-4 text-xs">
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            onClick={(event) => {
              event.stopPropagation();
            }}
            className="flex min-w-0 items-center gap-2 text-zinc-400 transition hover:text-zinc-700"
          >
            <span className="flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-full border border-zinc-200 bg-white">
              <Image
                src={logo}
                alt={source}
                width={24}
                height={24}
                className="size-4 object-contain"
              />
            </span>

            <span className="truncate">{source}</span>
          </a>

          <span className="shrink-0 text-zinc-400">
            Impacto{" "}
            <span className="font-semibold text-emerald-700">{impact}%</span>
          </span>
        </div>
      </div>
    </article>
  );
}
