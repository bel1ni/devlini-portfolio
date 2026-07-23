import { supabase } from "./client"
import type { StoredNews } from "@/types/agro-news"

// Mantém o banco enxuto: notícias mais velhas que isto são apagadas na
// ingestão. Maior que a janela do feed (7d) para deixar folga ao briefing e
// às páginas /news/[id]. Best-effort — depende da policy de delete
// (supabase/agro-prune-policy.sql); sem ela, os filtros de leitura já escondem
// o que for antigo, então a falha é inofensiva.
const PRUNE_OLDER_THAN_DAYS = 14

export async function pruneOldNews() {
    const cutoff = new Date(
        Date.now() - PRUNE_OLDER_THAN_DAYS * 24 * 60 * 60 * 1000
    ).toISOString()

    const { error } = await supabase
        .from("agro_news")
        .delete()
        .lt("published_at", cutoff)

    if (error) {
        console.warn(
            "Não foi possível limpar notícias antigas (rode supabase/agro-prune-policy.sql):",
            error.message
        )
    }
}

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

// Remove ids repetidos no lote: duas fontes podem gerar o mesmo slug (mesma
// manchete), e o upsert do Postgres rejeita o lote inteiro se o mesmo id
// aparece duas vezes ("ON CONFLICT DO UPDATE cannot affect row a second time")
// — o que fazia a ingestão inteira falhar e o banco parar. Mantém o primeiro
// (a lista chega ordenada por impacto desc, então é o de maior impacto).
function dedupeById(news: StoredNews[]): StoredNews[] {
    const seen = new Set<string>()

    return news.filter((item) => {
        const id = String(item.id)
        if (seen.has(id)) return false
        seen.add(id)
        return true
    })
}

export async function saveNews(rawNews: StoredNews[]) {
    const news = dedupeById(rawNews)

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
