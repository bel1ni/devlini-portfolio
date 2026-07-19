import { NextResponse } from "next/server"
import { getBaseUrl } from "@/lib/agro/site-url"
import { getTopNews } from "@/lib/agro/supabase/get-top-news"
import { getSubscribers } from "@/lib/agro/supabase/subscribers"
import { generateBriefing } from "@/lib/agro/ai/generate-briefing"
import { renderBriefingEmail } from "@/lib/agro/email/briefing-template"
import { sendEmails } from "@/lib/agro/email/send-email"

const MAX_NEWS = 8

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
        const news = await getTopNews(MAX_NEWS)

        if (news.length === 0) {
            return NextResponse.json({
                ok: false,
                reason: "Nenhuma notícia disponível para o briefing.",
            })
        }

        const subscribers = await getSubscribers()

        const extraRecipients = (process.env.BRIEFING_EMAIL_TO ?? "")
            .split(",")
            .map((email) => email.trim().toLowerCase())
            .filter(Boolean)

        const recipientsByEmail = new Map<string, string | undefined>()

        extraRecipients.forEach((email) => {
            recipientsByEmail.set(email, undefined)
        })

        subscribers.forEach((subscriber) => {
            recipientsByEmail.set(
                subscriber.email.toLowerCase(),
                subscriber.token
            )
        })

        if (recipientsByEmail.size === 0) {
            return NextResponse.json({
                ok: false,
                reason:
                    "Nenhum destinatário: cadastre inscritos ou defina BRIEFING_EMAIL_TO.",
            })
        }

        const briefing = await generateBriefing(news)
        const baseUrl = getBaseUrl()

        const date = new Intl.DateTimeFormat("pt-BR", {
            dateStyle: "full",
            timeZone: "America/Sao_Paulo",
        }).format(new Date())

        const subject = `Briefing AGROLINI — ${date}`

        const emails = Array.from(recipientsByEmail.entries()).map(
            ([email, token]) => ({
                to: email,
                subject,
                html: renderBriefingEmail({
                    briefing,
                    baseUrl,
                    date,
                    unsubscribeUrl: token
                        ? `${baseUrl}/api/agro/unsubscribe?token=${encodeURIComponent(token)}`
                        : undefined,
                }),
            })
        )

        const sent = await sendEmails(emails)

        return NextResponse.json({
            ok: sent > 0,
            newsCount: news.length,
            recipients: recipientsByEmail.size,
            sent,
        })
    } catch (error) {
        console.error("Erro ao gerar briefing diário:", error)

        return NextResponse.json(
            { error: "Erro ao gerar briefing diário" },
            { status: 500 }
        )
    }
}
