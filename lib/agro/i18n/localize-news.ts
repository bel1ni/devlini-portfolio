import type { Locale } from "./config"
import type { NewsItem, StoredNews } from "@/types/agro-news"

// Converte a linha bilíngue do banco na visão localizada usada pela UI.
// Cai para o texto do outro idioma se a tradução não existir.
export function localizeNews(news: StoredNews, locale: Locale): NewsItem {
    const title =
        (locale === "pt"
            ? news.title_pt || news.title_en
            : news.title_en || news.title_pt) ||
        news.title ||
        ""

    const description =
        (locale === "pt"
            ? news.description_pt || news.description_en
            : news.description_en || news.description_pt) ||
        news.description ||
        ""

    return {
        id: news.id,
        title,
        description,
        url: news.url,
        source: news.source,
        category: news.category,
        language: news.language,
        impact: news.impact,
        featured: news.featured,
        logo: news.logo,
        publishedAt: news.published_at || news.created_at || "",
    }
}
