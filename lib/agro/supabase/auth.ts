import { supabase } from "./client"

export async function signInWithGoogle() {
		const redirectUrl =
				typeof window !== "undefined"
						? `${window.location.origin}/agro/bookmarks`
						: "https://devlini.com/agro/bookmarks"

		const { data, error } = await supabase.auth.signInWithOAuth({
				provider: "google",
				options: {
						redirectTo: redirectUrl,
				},
		})

		if (error) {
				console.error("Erro no login Google:", error.message)
		}

		return data
}

export async function signOut() {
		const { error } = await supabase.auth.signOut()

		if (error) {
				console.error("Erro no logout:", error.message)
		}
}