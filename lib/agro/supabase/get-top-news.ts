import { supabase } from "./client"
import { localizeNews } from "@/lib/agro/i18n/localize-news"
import type { NewsItem, StoredNews } from "@/types/agro-news"

async function topNewsSince(hours: number, limit: number) {
    const since = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString()

    const { data } = await supabase
        .from("agro_news")
        .select("*")
        .gte("published_at", since)
        .order("impact", { ascending: false })
        .limit(limit)

    return data as StoredNews[] | null
}

// Notícias mais impactantes das últimas 24h para o briefing. Se o dia estiver
// vazio (falha/atraso do cron), abre no máximo para 48h — nunca cai para itens
// antigos: um briefing "de hoje" com notícia de semanas atrás quebra a confiança.
export async function getTopNews(limit = 8): Promise<NewsItem[]> {
    let data = await topNewsSince(24, limit)

    if (!data || data.length === 0) {
        data = await topNewsSince(48, limit)
    }

    return ((data ?? []) as StoredNews[]).map((row) => localizeNews(row, "pt"))
}
