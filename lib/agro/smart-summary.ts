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

		const cleanSource = source?.trim()

		const invalidTexts = [
				"read more",
				"continue reading",
				"click here",
				"the post appeared first on",
		]

		const isInvalid = invalidTexts.some((item) =>
				cleanText.toLowerCase().includes(item)
		)

		if (!cleanText || cleanText.length < 40 || isInvalid) {
				return `A ${cleanSource || "notícia"} destaca uma das movimentações recentes mais relevantes do agronegócio brasileiro, com possíveis impactos para o produtor rural, o mercado e os preços do setor.`
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