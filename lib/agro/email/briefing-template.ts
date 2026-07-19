import type { Briefing } from "@/lib/agro/ai/generate-briefing"

function escapeHtml(text: string) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
}

// E-mail em HTML com estilos inline (exigência dos clientes de e-mail).
export function renderBriefingEmail({
    briefing,
    baseUrl,
    date,
    unsubscribeUrl,
}: {
    briefing: Briefing
    baseUrl: string
    date: string
    unsubscribeUrl?: string
}) {
    const itemsHtml = briefing.items
        .map(
            ({ news, summary }) => `
                <tr>
                    <td style="padding:0 32px 28px 32px;">
                        <p style="margin:0 0 6px 0;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#059669;font-weight:bold;">
                            ${escapeHtml(news.category)} &middot; ${escapeHtml(news.source)}
                        </p>
                        <a href="${baseUrl}/agro/news/${encodeURIComponent(news.id)}" style="font-size:18px;line-height:25px;color:#0f172a;font-weight:bold;text-decoration:none;">
                            ${escapeHtml(news.title)}
                        </a>
                        <p style="margin:8px 0 0 0;font-size:14px;line-height:22px;color:#475569;">
                            ${escapeHtml(summary)}
                        </p>
                    </td>
                </tr>`
        )
        .join("")

    const unsubscribeHtml = unsubscribeUrl
        ? `<p style="margin:8px 0 0 0;font-size:12px;color:#94a3b8;">
                Não quer mais receber o briefing?
                <a href="${unsubscribeUrl}" style="color:#059669;">Cancelar inscrição</a>
            </p>`
        : ""

    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Briefing AGROLINI</title>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9;padding:24px 12px;">
        <tr>
            <td align="center">
                <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:16px;overflow:hidden;">
                    <tr>
                        <td style="background-color:#020617;padding:28px 32px;">
                            <p style="margin:0;font-size:22px;font-weight:bold;color:#ffffff;">
                                AGROLINI
                            </p>
                            <p style="margin:6px 0 0 0;font-size:13px;color:#6ee7b7;">
                                Briefing diário &middot; ${escapeHtml(date)}
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:28px 32px;">
                            <p style="margin:0;font-size:15px;line-height:24px;color:#334155;">
                                ${escapeHtml(briefing.intro)}
                            </p>
                        </td>
                    </tr>
                    ${itemsHtml}
                    <tr>
                        <td style="padding:0 32px 32px 32px;">
                            <a href="${baseUrl}/agro" style="display:inline-block;background-color:#10b981;color:#020617;font-size:14px;font-weight:bold;text-decoration:none;padding:12px 24px;border-radius:12px;">
                                Ver todas as notícias
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <td style="background-color:#f8fafc;padding:20px 32px;border-top:1px solid #e2e8f0;">
                            <p style="margin:0;font-size:12px;color:#94a3b8;">
                                Você está recebendo este e-mail porque se inscreveu no briefing do AGROLINI.
                            </p>
                            ${unsubscribeHtml}
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`
}
