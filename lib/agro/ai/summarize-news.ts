import { chatCompletion } from "./openrouter"

export async function summarizeNewsWithAI({
		title,
		description,
		source,
}: {
		title: string
		description: string
		source?: string
}) {
		const prompt = `
Você é um jornalista especializado em agronegócio e redator do BELAGRO, portal de notícias para o produtor rural brasileiro.

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

		return chatCompletion([{ role: "user", content: prompt }], {
				maxTokens: 900,
				temperature: 0.4,
				timeoutMs: 20_000,
		})
}
