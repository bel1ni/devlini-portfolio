import type { RawNews, StoredNews } from "@/types/agro-news"

const CHUNK_SIZE = 15

type TranslatedPair = {
    title: string
    description: string
}

async function translateChunk(
    items: RawNews[],
    targetLanguage: "en" | "pt"
): Promise<TranslatedPair[] | null> {
    const apiKey = process.env.OPENROUTER_API_KEY?.trim()

    if (!apiKey) return null

    const languageName =
        targetLanguage === "pt" ? "português do Brasil" : "English"

    const payload = items.map((item, index) => ({
        index,
        title: item.title,
        description: item.description,
    }))

    const prompt = `
Traduza os títulos e descrições de notícias abaixo para ${languageName}.

Regras:
- mantenha nomes de produtos, empresas e siglas como estão
- tom jornalístico e natural, sem literalidade excessiva
- não invente informações nem acrescente comentários
- responda APENAS com um array JSON válido, sem markdown, no formato:
[{"index": 0, "title": "...", "description": "..."}, ...]
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
                    model: "openai/gpt-4o-mini",
                    messages: [{ role: "user", content: prompt }],
                    max_tokens: 4000,
                    temperature: 0.2,
                }),
                signal: AbortSignal.timeout(30_000),
            }
        )

        if (!response.ok) {
            console.warn("Tradução indisponível:", response.status)
            return null
        }

        const data = await response.json()
        const content = data?.choices?.[0]?.message?.content?.trim()

        if (!content) return null

        const jsonText = content.replace(/^```(json)?/i, "").replace(/```$/, "").trim()
        const parsed = JSON.parse(jsonText) as {
            index: number
            title: string
            description: string
        }[]

        const byIndex = new Map(parsed.map((item) => [item.index, item]))

        return items.map((item, index) => {
            const translated = byIndex.get(index)

            return {
                title: translated?.title || item.title,
                description: translated?.description || item.description,
            }
        })
    } catch (error) {
        console.warn("Erro ao traduzir lote de notícias:", error)
        return null
    }
}

async function translateAll(
    items: RawNews[],
    targetLanguage: "en" | "pt"
): Promise<TranslatedPair[]> {
    const chunks: RawNews[][] = []

    for (let i = 0; i < items.length; i += CHUNK_SIZE) {
        chunks.push(items.slice(i, i + CHUNK_SIZE))
    }

    const results = await Promise.all(
        chunks.map((chunk) => translateChunk(chunk, targetLanguage))
    )

    return results.flatMap((result, chunkIndex) => {
        if (result) return result

        // Fallback: mantém o texto original quando a tradução falha
        return chunks[chunkIndex].map((item) => ({
            title: item.title,
            description: item.description,
        }))
    })
}

// Recebe as notícias no idioma original e devolve a versão bilíngue
// pronta para salvar no banco.
export async function translateNews(news: RawNews[]): Promise<StoredNews[]> {
    const englishItems = news.filter((item) => item.language === "en")
    const portugueseItems = news.filter((item) => item.language !== "en")

    // A UI do portal é 100% pt-BR e todas as fontes são brasileiras:
    // as colunas _en recebem o texto original, sem gastar chamadas de IA.
    const [toPortuguese, toEnglish] = await Promise.all([
        translateAll(englishItems, "pt"),
        Promise.resolve(
            portugueseItems.map((item) => ({
                title: item.title,
                description: item.description,
            }))
        ),
    ])

    const translations = new Map<string, TranslatedPair>()

    englishItems.forEach((item, index) => {
        translations.set(item.id, toPortuguese[index])
    })

    portugueseItems.forEach((item, index) => {
        translations.set(item.id, toEnglish[index])
    })

    return news.map((item) => {
        const translated = translations.get(item.id) ?? {
            title: item.title,
            description: item.description,
        }

        const isEnglish = item.language === "en"

        return {
            id: item.id,
            title_en: isEnglish ? item.title : translated.title,
            title_pt: isEnglish ? translated.title : item.title,
            description_en: isEnglish ? item.description : translated.description,
            description_pt: isEnglish ? translated.description : item.description,
            url: item.url,
            source: item.source,
            category: item.category,
            language: item.language,
            impact: item.impact,
            featured: item.featured,
            logo: item.logo,
            published_at: item.publishedAt,
            uf: item.uf,
        }
    })
}
