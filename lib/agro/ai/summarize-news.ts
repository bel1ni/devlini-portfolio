export async function summarizeNewsWithAI({
		title,
		description,
		source,
}: {
		title: string
		description: string
		source?: string
}) {
		const apiKey = process.env.OPENROUTER_API_KEY?.trim()

		if (!apiKey) {
				console.warn("OPENROUTER_API_KEY não encontrada")
				return null
		}

		const prompt = `
Você é um jornalista especializado em agronegócio e redator do AGROLINI, portal de notícias para o produtor rural brasileiro.

Transforme a notícia abaixo em um briefing editorial claro e rápido de ler.

Regras obrigatórias:
- responda em português do Brasil
- traduza o conteúdo caso esteja em inglês
- não invente informações
- não use markdown
- não use títulos
- não use negrito
- não use listas
- não use emojis
- escreva entre 120 e 220 palavras
- escreva de 2 a 3 parágrafos
- explique o que aconteceu
- explique por que isso é importante
- destaque impactos para o produtor rural, o mercado e os preços quando relevante
- termine o texto com uma frase em linguagem simples começando com "Para o produtor:" explicando o efeito prático da notícia na vida de quem produz
- mantenha tom profissional e jornalístico
- evite frases genéricas
- finalize obrigatoriamente com uma frase completa
- nunca termine com palavra cortada ou frase incompleta
- sempre termine com .

Título:
${title}

Fonte:
${source || "Não informada"}

Conteúdo:
${description}

Retorne apenas o resumo final.
`

		try {
				const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
						method: "POST",
						headers: {
								Authorization: `Bearer ${apiKey}`,
								"Content-Type": "application/json",
						},
						body: JSON.stringify({
								model: "openrouter/auto",
								messages: [
										{
												role: "user",
												content: prompt,
										},
								],
								max_tokens: 900,
								temperature: 0.4,
						}),
						signal: AbortSignal.timeout(20_000),
				})

				if (!response.ok) {
						const errorText = await response.text()
						console.warn("OpenRouter indisponível:", response.status, errorText)
						return null
				}

				const data = await response.json()

				return data?.choices?.[0]?.message?.content?.trim() || null
		} catch (error) {
				console.warn("Erro ao chamar OpenRouter:", error)
				return null
		}
}
