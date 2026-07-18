import { saveNews } from "@/lib/agro/supabase/save-news";
import { processNews } from "@/lib/agro/ai/process-news";
import { translateNews } from "@/lib/agro/ai/translate-news";
import { NextResponse } from "next/server"
import { getAgroNews } from "@/lib/agro/rss"

export const revalidate=300;

export async function GET(request: Request) {
    const cronSecret = process.env.CRON_SECRET

    if (cronSecret) {
        const authHeader = request.headers.get("authorization")

        if (authHeader !== `Bearer ${cronSecret}`) {
            return NextResponse.json(
                { error: "Não autorizado" },
                { status: 401 }
            )
        }
    }

    try {
        const news = await getAgroNews()
        const processedNews = processNews(news)
        const translatedNews = await translateNews(processedNews)
        console.log('Notícias processadas: ', translatedNews.length)
        await saveNews(translatedNews)

        return NextResponse.json(translatedNews)
    } catch (error) {
        console.error("Erro na API de notícias:", error)

        return NextResponse.json(
        {
            error: "Erro ao buscar notícias",
        },
        {
            status: 500,
        }
        )
    }
}