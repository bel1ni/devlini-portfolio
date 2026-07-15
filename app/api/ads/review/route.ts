import { NextResponse } from "next/server";
import { SITE_URL } from "@/content/site";
import { approveAd, notifyByEmail, rejectAd, getAdById } from "@/lib/ads-db";

export async function POST(req: Request) {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return new Response("disabled", { status: 503 });

  const form = await req.formData();
  const key = String(form.get("key") ?? "");
  const id = Number(form.get("id") ?? 0);
  const action = String(form.get("action") ?? "");

  if (key !== secret) return new Response("forbidden", { status: 403 });
  if (!id || !["approve", "reject"].includes(action)) {
    return new Response("bad request", { status: 400 });
  }

  let notice = "";
  if (action === "approve") {
    const result = await approveAd(id);
    notice = result.ok ? "aprovado" : `erro:${result.reason}`;
    if (result.ok) {
      const ad = await getAdById(id);
      if (ad?.email) {
        await notifyByEmail({
          to: ad.email,
          subject: "Seu anúncio está no ar no Link Hub 🎉",
          html: `<p>Seu anúncio "${ad.title}" foi aprovado e já está no ar em <a href="${SITE_URL}">${SITE_URL}</a> até ${ad.ends_at ? new Date(ad.ends_at).toLocaleDateString("pt-BR") : ""}.</p>`,
        });
      }
    }
  } else {
    await rejectAd(id);
    notice = "rejeitado";
    const ad = await getAdById(id);
    if (ad?.email) {
      await notifyByEmail({
        to: ad.email,
        subject: "Seu anúncio não foi aprovado — reembolso a caminho",
        html: `<p>O anúncio enviado não se enquadra na política de conteúdo do Link Hub. O valor pago será reembolsado integralmente.</p>`,
      });
    }
  }

  return NextResponse.redirect(
    `${SITE_URL}/admin?key=${encodeURIComponent(key)}&notice=${notice}`,
    303,
  );
}
