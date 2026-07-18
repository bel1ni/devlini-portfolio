import { supabase } from "./client"
import { localizeNews } from "@/lib/agro/i18n/localize-news"
import type { NewsItem, StoredNews } from "@/types/agro-news"

export type NewsDetail = NewsItem & {
    aiSummary: string | null
    createdAt: string | null
}

export async function getNewsById(id: string): Promise<NewsDetail | null> {
const { data, error } = await supabase
    .from("agro_news")
    .select("*")
    .eq("id", id)
    .maybeSingle()

if (error) {
    console.error("Erro ao buscar notícia:", error.message)
    return null
}

if (!data) return null

const stored = data as StoredNews

return {
    ...localizeNews(stored, "pt"),
    aiSummary: stored.ai_summary_pt || stored.ai_summary || null,
    createdAt: stored.created_at || null,
}
}
