import { NextResponse } from "next/server"
import { getNewsById } from "@/lib/agro/supabase/get-news-by-id"

const MAX_MESSAGES = 10
const MAX_MESSAGE_LENGTH = 1000

type ChatMessage = {
    role: "user" | "assistant"
    content: string
}

// Aceita só o histórico recente, com papéis e tamanhos controlados,
// para limitar custo e abuso da rota pública.
function sanitizeMessages(value: unknown): ChatMessage[] | null {
    if (!Array.isArray(value) || value.length === 0) return null

    const recent = value.slice(-MAX_MESSAGES)
    const sanitized: ChatMessage[] = []

    for (const message of recent) {
        const role = message?.role
        const content = message?.content

        if (
            (role !== "user" && role !== "assistant") ||
            typeof content !== "string"
        ) {
            return null
        }

        const trimmed = content.trim()

        if (!trimmed) return null

        sanitized.push({
            role,
            content: trimmed.slice(0, MAX_MESSAGE_LENGTH),
        })
    }

    if (sanitized[sanitized.length - 1].role !== "user") return null

    return sanitized
}

export async function POST(request: Request) {
    const apiKey = process.env.OPENROUTER_API_KEY?.trim()

    if (!apiKey) {
        return NextResponse.json(
            { error: "O assistente está indisponível no momento." },
            { status: 503 }
        )
    }

    let body: { newsId?: unknown; messages?: unknown }

    try {
        body = await request.json()
    } catch {
        return NextResponse.json(
            { error: "Requisição inválida." },
            { status: 400 }
        )
    }

    const newsId = body?.newsId
    const messages = sanitizeMessages(body?.messages)

    if (typeof newsId !== "string" || !newsId || !messages) {
        return NextResponse.json(
            { error: "Requisição inválida." },
            { status: 400 }
        )
    }

    const news = await getNewsById(newsId)

    if (!news) {
        return NextResponse.json(
            { error: "Notícia não encontrada." },
            { status: 404 }
        )
    }

    const publishedDate = news.publishedAt
        ? new Intl.DateTimeFormat("pt-BR", {
              dateStyle: "long",
              timeZone: "America/Sao_Paulo",
          }).format(new Date(news.publishedAt))
        : "não informada"

    const systemPrompt = `
Você é o assistente do AGROLINI, um portal de notícias do agronegócio brasileiro em português do Brasil.
Sua função é tirar dúvidas do leitor — normalmente um produtor rural — sobre a notícia abaixo.

Notícia em discussão:
- Título: ${news.title}
- Fonte: ${news.source}
- Categoria: ${news.category}
- Data de publicação: ${publishedDate}
- Resumo: ${news.aiSummary || news.description}
- Link da matéria original: ${news.url}

Regras:
- responda sempre em português do Brasil
- seja claro, direto e didático; respostas curtas (até 3 parágrafos)
- baseie-se apenas nas informações da notícia acima e em contexto geral do agronegócio amplamente conhecido
- se a resposta não estiver na notícia, diga isso com transparência e sugira consultar a matéria original
- não invente números, datas ou declarações
- se perguntarem algo fora do tema da notícia ou do agronegócio, redirecione educadamente para o assunto da matéria
- não use markdown nem emojis
`.trim()

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
                    messages: [
                        { role: "system", content: systemPrompt },
                        ...messages,
                    ],
                    max_tokens: 700,
                    temperature: 0.3,
                }),
                signal: AbortSignal.timeout(25_000),
            }
        )

        if (!response.ok) {
            const errorText = await response.text()
            console.warn("OpenRouter indisponível no chat:", response.status, errorText)

            return NextResponse.json(
                { error: "O assistente está indisponível no momento. Tente de novo em instantes." },
                { status: 502 }
            )
        }

        const data = await response.json()
        const reply = data?.choices?.[0]?.message?.content?.trim()

        if (!reply) {
            return NextResponse.json(
                { error: "O assistente não conseguiu responder. Tente reformular a pergunta." },
                { status: 502 }
            )
        }

        return NextResponse.json({ reply })
    } catch (error) {
        console.warn("Erro no chat da notícia:", error)

        return NextResponse.json(
            { error: "O assistente está indisponível no momento. Tente de novo em instantes." },
            { status: 502 }
        )
    }
}
