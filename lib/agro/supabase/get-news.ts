import { supabase } from "./client";
import { localizeNews } from "@/lib/agro/i18n/localize-news";
import type { NewsItem, StoredNews } from "@/types/agro-news";

export async function getSavedNews(): Promise<NewsItem[]> {
    const {data, error} = await supabase
        .from("agro_news")
        .select('*')
        .order("impact", {ascending: false})

    if (error) {
        console.error(
            "Erro ao buscar notícias: ",
            error.message
        )

        return []
    }

    return (data as StoredNews[]).map((row) => localizeNews(row, "pt"))
}
