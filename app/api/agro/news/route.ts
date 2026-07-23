import { NextResponse } from "next/server"
import { runIngestion } from "@/lib/agro/ingest"

// A coleta busca ~39 feeds RSS e pode levar dezenas de segundos; sem isto a
// função morre no timeout padrão de 10s do plano Hobby e nada é salvo (foi o
// que deixou o feed parado). 60s é o teto do Hobby.
export const maxDuration = 60
export const revalidate = 300

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
        const count = await runIngestion()
        console.log("Notícias processadas: ", count)

        return NextResponse.json({ ok: true, count })
    } catch (error) {
        console.error("Erro na API de notícias:", error)

        return NextResponse.json(
            { error: "Erro ao buscar notícias" },
            { status: 500 }
        )
    }
}
