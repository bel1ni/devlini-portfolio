import { NextResponse } from "next/server";
import { SITE_URL } from "@/content/site";
import {
  ADMIN_EMAIL,
  getAdByToken,
  notifyByEmail,
  submitArt,
} from "@/lib/ads-db";

const MAX_IMAGE_BYTES = 512_000; // 500 KB (specs da página /anuncie)
const ALLOWED_TYPES = new Set(["image/png", "image/jpeg"]);

export async function POST(req: Request) {
  const form = await req.formData();
  const token = String(form.get("token") ?? "");
  const title = String(form.get("title") ?? "").trim();
  const description = String(form.get("description") ?? "").trim();
  const url = String(form.get("url") ?? "").trim();
  const image = form.get("image");

  const ad = await getAdByToken(token);
  if (!ad || !["pendente_arte", "em_revisao"].includes(ad.status)) {
    return NextResponse.json({ error: "invalid_token" }, { status: 404 });
  }
  if (!title || title.length > 40) {
    return NextResponse.json({ error: "invalid_title" }, { status: 400 });
  }
  if (!description || description.length > 90) {
    return NextResponse.json({ error: "invalid_description" }, { status: 400 });
  }
  if (!/^https?:\/\/.+/.test(url)) {
    return NextResponse.json({ error: "invalid_url" }, { status: 400 });
  }
  if (!(image instanceof File) || !ALLOWED_TYPES.has(image.type)) {
    return NextResponse.json({ error: "invalid_image" }, { status: 400 });
  }
  if (image.size > MAX_IMAGE_BYTES) {
    return NextResponse.json({ error: "image_too_large" }, { status: 400 });
  }

  let imageUrl: string;
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put } = await import("@vercel/blob");
    const ext = image.type === "image/png" ? "png" : "jpg";
    const blob = await put(`ads/${token}.${ext}`, image, {
      access: "public",
      allowOverwrite: true,
    });
    imageUrl = blob.url;
  } else {
    // Fallback sem Blob configurado: imagem inline (limite de 500 KB já validado)
    const bytes = Buffer.from(await image.arrayBuffer());
    imageUrl = `data:${image.type};base64,${bytes.toString("base64")}`;
  }

  const ok = await submitArt(token, { title, description, url, imageUrl });
  if (!ok) {
    return NextResponse.json({ error: "update_failed" }, { status: 500 });
  }

  await notifyByEmail({
    to: ADMIN_EMAIL,
    subject: `Anúncio aguardando aprovação: ${title}`,
    html: `<p>Arte enviada por ${ad.email} (plano ${ad.plan}).</p><p>Revise em: <a href="${SITE_URL}/admin">${SITE_URL}/admin</a></p>`,
  });

  return NextResponse.json({ ok: true });
}
