import { supabase } from "./client"
import { localizeNews } from "@/lib/agro/i18n/localize-news"
import type { NewsItem, StoredNews } from "@/types/agro-news"

export async function getRelatedNews(
category: string,
currentId: string
): Promise<NewsItem[]> {
const { data, error } = await supabase
    .from("agro_news")
    .select("*")
    .eq("category", category)
    .neq("id", currentId)
    .limit(3)

if (error) {
    console.error(
    "Erro ao buscar notícias relacionadas:",
    error.message
    )

    return []
}

return (data as StoredNews[]).map((row) => localizeNews(row, "pt"))
}
