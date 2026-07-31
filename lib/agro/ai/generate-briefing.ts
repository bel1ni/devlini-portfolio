import type { NewsItem } from "@/types/agro-news"
import { chatCompletion } from "./openrouter"

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
        intro: "Estas são as notícias do agronegócio mais impactantes das últimas 24 horas, selecionadas pelo BELAGRO.",
        items: news.map((item) => ({
            news: item,
            summary: item.description,
        })),
    }
}

export async function generateBriefing(news: NewsItem[]): Promise<Briefing> {
    if (news.length === 0) {
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
Você é o editor-chefe do BELAGRO e está escrevendo o briefing diário enviado por e-mail a produtores rurais e profissionais do agronegócio.

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
        const content = await chatCompletion([{ role: "user", content: prompt }], {
            maxTokens: 2000,
            temperature: 0.3,
            timeoutMs: 45_000,
        })

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
