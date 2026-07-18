import type { NewsItem } from "@/types/agro-news"

export type BriefingItem = {
    news: NewsItem
    summary: string
}

export type Briefing = {
    intro: string
    items: BriefingItem[]
}

// Fallback sem IA: usa a própria descrição de cada notícia.
function fallbackBriefing(news: NewsItem[]): Briefing {
    return {
        intro: "Estas são as notícias do agronegócio mais impactantes das últimas 24 horas, selecionadas pelo DEVLINI Agro.",
        items: news.map((item) => ({
            news: item,
            summary: item.description,
        })),
    }
}

export async function generateBriefing(news: NewsItem[]): Promise<Briefing> {
    const apiKey = process.env.OPENROUTER_API_KEY?.trim()

    if (!apiKey || news.length === 0) {
        return fallbackBriefing(news)
    }

    const payload = news.map((item, index) => ({
        index,
        title: item.title,
        description: item.description,
        source: item.source,
        category: item.category,
    }))

    const prompt = `
Você é o editor-chefe do DEVLINI Agro e está escrevendo o briefing diário enviado por e-mail a produtores rurais e profissionais do agronegócio.

Com base nas notícias abaixo, escreva:
1. "intro": um parágrafo de abertura (40 a 70 palavras) em português do Brasil resumindo o dia no agronegócio, com tom jornalístico e direto.
2. "items": para cada notícia, um resumo de 1 a 2 frases (no máximo 40 palavras) em português do Brasil explicando o que aconteceu e por que importa para o produtor.

Regras:
- não invente informações
- não use markdown nem emojis
- responda APENAS com JSON válido, sem cercas de código, no formato:
{"intro": "...", "items": [{"index": 0, "summary": "..."}, ...]}
- preserve o campo "index" de cada item

Notícias:
${JSON.stringify(payload)}
`

    try {
        const response = await fetch(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: "openrouter/auto",
                    messages: [{ role: "user", content: prompt }],
                    max_tokens: 2000,
                    temperature: 0.3,
                }),
                signal: AbortSignal.timeout(45_000),
            }
        )

        if (!response.ok) {
            console.warn("OpenRouter indisponível para o briefing:", response.status)
            return fallbackBriefing(news)
        }

        const data = await response.json()
        const content = data?.choices?.[0]?.message?.content?.trim()

        if (!content) return fallbackBriefing(news)

        const jsonText = content
            .replace(/^```(json)?/i, "")
            .replace(/```$/, "")
            .trim()

        const parsed = JSON.parse(jsonText) as {
            intro?: string
            items?: { index: number; summary: string }[]
        }

        const summaryByIndex = new Map(
            (parsed.items ?? []).map((item) => [item.index, item.summary])
        )

        return {
            intro: parsed.intro?.trim() || fallbackBriefing(news).intro,
            items: news.map((item, index) => ({
                news: item,
                summary: summaryByIndex.get(index)?.trim() || item.description,
            })),
        }
    } catch (error) {
        console.warn("Erro ao gerar briefing com IA:", error)
        return fallbackBriefing(news)
    }
}
