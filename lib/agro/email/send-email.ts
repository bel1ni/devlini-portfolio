type EmailPayload = {
    to: string
    subject: string
    html: string
}

const RESEND_BATCH_LIMIT = 100

// Envio via API HTTP do Resend (sem SDK). O endpoint de batch aceita
// até 100 e-mails por chamada, cada um com destinatário próprio —
// necessário porque o link de descadastro é individual.
export async function sendEmails(emails: EmailPayload[]) {
    const apiKey = process.env.RESEND_API_KEY?.trim()

    if (!apiKey) {
        console.warn("RESEND_API_KEY não definida; nenhum e-mail foi enviado.")
        return 0
    }

    const from =
        process.env.BRIEFING_FROM_EMAIL?.trim() ||
        "DEVLINI Agro <onboarding@resend.dev>"

    let sent = 0

    for (let i = 0; i < emails.length; i += RESEND_BATCH_LIMIT) {
        const batch = emails.slice(i, i + RESEND_BATCH_LIMIT)

        try {
            const response = await fetch("https://api.resend.com/emails/batch", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(
                    batch.map((email) => ({
                        from,
                        to: [email.to],
                        subject: email.subject,
                        html: email.html,
                    }))
                ),
                signal: AbortSignal.timeout(30_000),
            })

            if (!response.ok) {
                const errorText = await response.text()
                console.error("Falha no envio de e-mails:", response.status, errorText)
                continue
            }

            sent += batch.length
        } catch (error) {
            console.error("Erro ao enviar e-mails:", error)
        }
    }

    return sent
}
