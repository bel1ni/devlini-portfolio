import { Suspense } from "react";
import NewsFeedClient from "./news-feed-client";
import { getSavedNews } from "@/lib/agro/supabase/get-news";
import { getInmetAlerts, type InmetAlert } from "@/lib/agro/inmet";
import type { NewsItem } from "@/types/agro-news";

export default async function NewsFeed() {
  // Notícias e avisos do INMET em paralelo; o INMET é cacheado 1h e falha
  // devolvendo [], então nunca segura o feed.
  const [news, inmetAlerts]: [NewsItem[], InmetAlert[]] = await Promise.all([
    getSavedNews(),
    getInmetAlerts(),
  ]);

  return (
    <section id="noticias" className="scroll-mt-24">
      <Suspense
        fallback={
          <p className="mt-10 text-sm text-zinc-500">Carregando notícias...</p>
        }
      >
        <NewsFeedClient news={news} inmetAlerts={inmetAlerts} />
      </Suspense>
    </section>
  );
}
