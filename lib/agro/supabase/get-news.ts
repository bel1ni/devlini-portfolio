import { supabase } from "./client";
import { localizeNews } from "@/lib/agro/i18n/localize-news";
import type { NewsItem, StoredNews } from "@/types/agro-news";

// Janela do feed: só notícias dos últimos dias. Sem isso, um item antigo de
// alto impacto ficava pinado no topo (a "sensação de conteúdo repetido").
const FEED_WINDOW_DAYS = 7;

export async function getSavedNews(): Promise<NewsItem[]> {
    const since = new Date(
        Date.now() - FEED_WINDOW_DAYS * 24 * 60 * 60 * 1000
    ).toISOString();

    const { data, error } = await supabase
        .from("agro_news")
        .select("*")
        .gte("published_at", since)
        .order("published_at", { ascending: false })
        .limit(200);

    if (error) {
        console.error(
            "Erro ao buscar notícias: ",
            error.message
        )

        return []
    }

    return (data as StoredNews[]).map((row) => localizeNews(row, "pt"))
}
