import { getAgroNews } from "@/lib/agro/rss"
import { processNews } from "@/lib/agro/ai/process-news"
import { translateNews } from "@/lib/agro/ai/translate-news"
import { saveNews, pruneOldNews } from "@/lib/agro/supabase/save-news"
import { hasIngestedToday } from "@/lib/agro/supabase/get-last-ingestion"

// Dedup dentro da mesma instância: se uma coleta já está rodando, quem chegar
// depois espera essa em vez de disparar outra. Entre instâncias diferentes o
// upsert por slug é idempotente, então uma coleta dupla é só desperdício, não erro.
let inFlight: Promise<number> | null = null

// Pipeline de coleta: RSS → processa → traduz → salva → limpa antigas.
// Extraído da rota /api/agro/news para ser reusado pela primeira visita do dia
// e pelo briefing. Devolve quantas notícias foram processadas.
export async function runIngestion(): Promise<number> {
    if (inFlight) return inFlight

    inFlight = (async () => {
        const news = await getAgroNews()
        const processed = processNews(news)
        const translated = await translateNews(processed)
        await saveNews(translated)
        await pruneOldNews()
        return translated.length
    })()

    try {
        return await inFlight
    } finally {
        inFlight = null
    }
}

// Garante que o feed foi atualizado hoje. Só coleta se ainda não coletou (uma
// contagem barata decide). É o que mantém feed e briefing sempre frescos mesmo
// que a cron das 6h falhe: o primeiro acesso do dia e o briefing chamam isto.
export async function ensureFreshNews(): Promise<{ ingested: boolean }> {
    if (await hasIngestedToday()) return { ingested: false }

    await runIngestion()
    return { ingested: true }
}
