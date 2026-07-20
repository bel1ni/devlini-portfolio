import { removeSubscriberByToken } from "@/lib/agro/supabase/subscribers"

function htmlPage(title: string, message: string) {
    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title} | BELAGRO</title>
</head>
<body style="margin:0;display:flex;min-height:100vh;align-items:center;justify-content:center;background-color:#fafafa;font-family:system-ui,sans-serif;">
    <div style="max-width:420px;padding:40px 24px;text-align:center;">
        <h1 style="margin:0;font-size:24px;color:#18181b;">${title}</h1>
        <p style="margin:16px 0 0 0;font-size:15px;line-height:24px;color:#52525b;">${message}</p>
        <a href="/agro" style="display:inline-block;margin-top:28px;background-color:#059669;color:#ffffff;font-size:14px;font-weight:bold;text-decoration:none;padding:12px 24px;border-radius:12px;">Voltar ao BELAGRO</a>
    </div>
</body>
</html>`
}

export async function GET(request: Request) {
    const token = new URL(request.url).searchParams.get("token")

    if (!token) {
        return new Response(
            htmlPage(
                "Link inválido",
                "Este link de descadastro está incompleto. Use o link enviado no e-mail do briefing."
            ),
            {
                status: 400,
                headers: { "Content-Type": "text/html; charset=utf-8" },
            }
        )
    }

    const removed = await removeSubscriberByToken(token)

    if (!removed) {
        return new Response(
            htmlPage(
                "Inscrição não encontrada",
                "Este e-mail já foi removido do briefing ou o link expirou."
            ),
            {
                status: 404,
                headers: { "Content-Type": "text/html; charset=utf-8" },
            }
        )
    }

    return new Response(
        htmlPage(
            "Inscrição cancelada",
            "Você não vai mais receber o briefing diário do BELAGRO. Pode voltar quando quiser!"
        ),
        {
            headers: { "Content-Type": "text/html; charset=utf-8" },
        }
    )
}
