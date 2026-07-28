import { supabase } from "./client"

export async function signInWithGoogle(redirectPath = "/agro/bookmarks") {
		const redirectUrl =
				typeof window !== "undefined"
						? `${window.location.origin}${redirectPath}`
						: `https://devlini.com${redirectPath}`

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