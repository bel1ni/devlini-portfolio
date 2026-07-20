export function smartSummary(
		text: string,
		title?: string,
		source?: string
) {
		const cleanText = (text || "")
				.replace(/<[^>]*>/g, "")
				.replace(/\s+/g, " ")
				.replace(title || "", "")
				.replace(/Continue reading.*/gi, "")
				.replace(/Read more.*/gi, "")
				.replace(/Click here.*/gi, "")
				.replace(/The post appeared first on.*/gi, "")
				.trim()

		// ponytail: nunca inventar resumo. Se sobrou texto real, usa; se não,
		// devolve "" e a página cai no próprio texto da notícia + "Ler matéria
		// original" (a informação completa vive na fonte).
		if (!cleanText) {
				return ""
		}

		const sentences = cleanText
				.split(/[.!?]+/)
				.map((sentence) => sentence.trim())
				.filter(Boolean)

		const firstSentence = sentences[0] || ""
		const secondSentence = sentences[1] || ""

		const summary = [firstSentence, secondSentence]
				.filter(Boolean)
				.join(". ")

		if (summary.length <= 220) {
				return `${summary}.`
		}

		return `${summary.slice(0, 220).trim()}...`
}