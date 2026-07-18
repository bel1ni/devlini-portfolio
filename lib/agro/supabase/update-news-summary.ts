import { supabase } from "./client"

export async function updateNewsSummary({
		id,
		aiSummary,
}: {
		id: string | number
		aiSummary: string
}) {
		const { error } = await supabase
				.from("agro_news")
				.update({
						ai_summary_pt: aiSummary,
				})
				.eq("id", String(id))

		if (error) {
				console.error("Erro ao salvar resumo IA:", error.message)
				return false
		}

		return true
}