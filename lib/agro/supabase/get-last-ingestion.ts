import { supabase } from "./client"

// Início do dia de hoje no horário de Brasília (UTC-3, fixo desde o fim do
// horário de verão em 2019), como ISO em UTC. Meia-noite em Brasília = 03:00 UTC.
function startOfTodayBrazilISO(): string {
    const now = Date.now()

    const brMidnight = new Date()
    brMidnight.setUTCHours(3, 0, 0, 0)

    let start = brMidnight.getTime()

    // Antes das 03:00 UTC ainda é "ontem" em Brasília → volta um dia.
    if (start > now) start -= 24 * 60 * 60 * 1000

    return new Date(start).toISOString()
}

// Já houve ingestão hoje? Barato: uma contagem por created_at (quando a linha
// foi salva), não published_at. Usado para o primeiro acesso do dia e o
// briefing dispararem a coleta só quando ela ainda não rodou.
export async function hasIngestedToday(): Promise<boolean> {
    const since = startOfTodayBrazilISO()

    const { count, error } = await supabase
        .from("agro_news")
        .select("id", { count: "exact", head: true })
        .gte("created_at", since)

    if (error) {
        // Em dúvida, assume que já ingeriu — evita disparar coleta em loop se a
        // checagem falhar. A cron das 6h continua sendo a garantia.
        console.warn("Não foi possível checar a última ingestão:", error.message)
        return true
    }

    return (count ?? 0) > 0
}
