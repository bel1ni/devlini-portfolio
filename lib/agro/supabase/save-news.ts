import { supabase } from "./client"
import type { StoredNews } from "@/types/agro-news"

// Detecta o erro do PostgREST quando a tabela ainda está no esquema
// antigo (migração bilíngue não aplicada): coluna inexistente.
function isMissingColumnError(message?: string) {
    if (!message) return false
    const normalized = message.toLowerCase()
    return normalized.includes("column") || normalized.includes("schema cache")
}

export async function saveNews(news: StoredNews[]) {
    // Caminho principal: esquema bilíngue completo.
    const { data, error } = await supabase.from("agro_news").upsert(
        news.map((item) => ({
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
        }))
    )

    if (!error) return data

    // Fallback: enquanto a migração (supabase/schema.sql) não é aplicada,
    // grava só as colunas do esquema antigo para as notícias não sumirem.
    // Perde a tradução/idioma, mas garante que o feed sempre atualize.
    if (isMissingColumnError(error.message)) {
        console.warn(
            "Tabela 'news' no esquema antigo; salvando em modo compatível. Aplique supabase/schema.sql para ativar títulos bilíngues."
        )

        const { data: legacyData, error: legacyError } = await supabase
            .from("agro_news")
            .upsert(
                news.map((item) => ({
                    id: String(item.id),
                    title: item.title_pt || item.title_en,
                    description: item.description_pt || item.description_en,
                    url: item.url,
                    source: item.source,
                    category: item.category,
                    language: item.language,
                    impact: item.impact,
                    featured: item.featured,
                    logo: item.logo,
                }))
            )

        if (legacyError) {
            console.error("Erro ao salvar notícias (modo compatível):", legacyError.message)
            return null
        }

        return legacyData
    }

    console.error("Erro ao salvar notícias:", error.message)
    return null
}
