import { Suspense } from "react";
import NewsFeedClient from "./news-feed-client";
import { getSavedNews } from "@/lib/agro/supabase/get-news";
import type { NewsItem } from "@/types/agro-news";

export default async function NewsFeed() {
  const news: NewsItem[] = await getSavedNews();

  return (
    <section id="noticias" className="scroll-mt-24">
      <Suspense
        fallback={
          <p className="mt-10 text-sm text-zinc-500">Carregando notícias...</p>
        }
      >
        <NewsFeedClient news={news} />
      </Suspense>
    </section>
  );
}
