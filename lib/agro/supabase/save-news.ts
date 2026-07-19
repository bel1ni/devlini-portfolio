import { supabase } from "./client"
import type { StoredNews } from "@/types/agro-news"

// Detecta o erro do PostgREST de coluna inexistente (migração pendente).
function isMissingColumnError(message?: string) {
    if (!message) return false
    const normalized = message.toLowerCase()
    return normalized.includes("column") || normalized.includes("schema cache")
}

function toRow(item: StoredNews, includeUf: boolean) {
    return {
        id: String(item.id),
        title_en: item.title_en,
        title_pt: item.title_pt,
        description_en: item.description_en,
        description_pt: item.description_pt,
        url: item.url,
        source: item.source,
        category: item.category,
        language: item.language,
        impact: item.impact,
        featured: item.featured,
        logo: item.logo,
        published_at: item.published_at,
        ...(includeUf ? { uf: item.uf ?? null } : {}),
    }
}

export async function saveNews(news: StoredNews[]) {
    // Caminho principal: esquema completo, com a coluna uf.
    const { data, error } = await supabase
        .from("agro_news")
        .upsert(news.map((item) => toRow(item, true)))

    if (!error) return data

    // Fallback: enquanto a migração da coluna uf
    // (supabase/agro-migracao-uf.sql) não for aplicada, salva sem ela
    // para o feed continuar atualizando.
    if (isMissingColumnError(error.message)) {
        console.warn(
            "Coluna 'uf' ausente em agro_news; salvando sem UF. Rode supabase/agro-migracao-uf.sql para ativar o filtro por estado."
        )

        const { data: fallbackData, error: fallbackError } = await supabase
            .from("agro_news")
            .upsert(news.map((item) => toRow(item, false)))

        if (fallbackError) {
            console.error(
                "Erro ao salvar notícias (sem uf):",
                fallbackError.message
            )
            return null
        }

        return fallbackData
    }

    console.error("Erro ao salvar notícias:", error.message)
    return null
}
