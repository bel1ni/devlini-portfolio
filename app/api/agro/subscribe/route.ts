import { NextResponse } from "next/server"
import { addSubscriber } from "@/lib/agro/supabase/subscribers"

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: Request) {
    let email: unknown

    try {
        const body = await request.json()
        email = body?.email
    } catch {
        return NextResponse.json(
            { error: "Requisição inválida." },
            { status: 400 }
        )
    }

    if (typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
        return NextResponse.json(
            { error: "Informe um e-mail válido." },
            { status: 400 }
        )
    }

    const saved = await addSubscriber(email.trim().toLowerCase())

    if (!saved) {
        return NextResponse.json(
            { error: "Não foi possível concluir a inscrição. Tente novamente." },
            { status: 500 }
        )
    }

    return NextResponse.json({ ok: true })
}
