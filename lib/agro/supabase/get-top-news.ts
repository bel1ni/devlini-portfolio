import { supabase } from "./client"
import { localizeNews } from "@/lib/agro/i18n/localize-news"
import type { NewsItem, StoredNews } from "@/types/agro-news"

// Notícias mais impactantes das últimas 24h; se o período estiver vazio,
// cai para as mais recentes do banco. Reaproveitado pela página /briefing
// e pela rota de e-mail GET /api/briefing.
export async function getTopNews(limit = 8): Promise<NewsItem[]> {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

    let { data } = await supabase
        .from("agro_news")
        .select("*")
        .gte("published_at", since)
        .order("impact", { ascending: false })
        .limit(limit)

    if (!data || data.length === 0) {
        const fallback = await supabase
            .from("agro_news")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(limit)

        data = fallback.data
    }

    return ((data ?? []) as StoredNews[]).map((row) => localizeNews(row, "pt"))
}
