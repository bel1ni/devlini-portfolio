const READ_NEWS_KEY = "agro-journal-read-news"

export function markNewsAsRead(newsId: string | number) {
		if (typeof window === "undefined") return

		const currentReadNews = getReadNews()

		const updatedReadNews = Array.from(
				new Set([...currentReadNews, String(newsId)])
		)

		localStorage.setItem(
				READ_NEWS_KEY,
				JSON.stringify(updatedReadNews)
		)
}

export function getReadNews() {
		if (typeof window === "undefined") return []

		const storedReadNews = localStorage.getItem(READ_NEWS_KEY)

		if (!storedReadNews) return []

		try {
				return JSON.parse(storedReadNews) as string[]
		} catch {
				return []
		}
}

export function hasReadNews(newsId: string | number) {
		return getReadNews().includes(String(newsId))
}