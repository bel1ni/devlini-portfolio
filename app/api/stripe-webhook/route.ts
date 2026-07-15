import Stripe from "stripe";
import { SITE_URL } from "@/content/site";
import {
  ADMIN_EMAIL,
  ensureAdFromSession,
  notifyByEmail,
} from "@/lib/ads-db";

export async function POST(req: Request) {
  const key = process.env.STRIPE_SECRET_KEY;
  const whSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!key || !whSecret) return new Response("disabled", { status: 503 });

  const stripe = new Stripe(key);
  const signature = req.headers.get("stripe-signature");
  const payload = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature ?? "", whSecret);
  } catch {
    return new Response("invalid signature", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    if (session.payment_status === "paid") {
      const ad = await ensureAdFromSession({
        sessionId: session.id,
        email: session.customer_details?.email ?? "",
        plan: session.metadata?.plan ?? "unknown",
        durationDays: Number(session.metadata?.duration_days ?? 30),
      });
      if (ad?.email) {
        const artUrl = `${SITE_URL}/anuncie/arte?token=${ad.token}`;
        await notifyByEmail({
          to: ad.email,
          subject: "Seu slot no Link Hub está reservado — envie a arte",
          html: `<p>Pagamento confirmado! Envie a arte do seu anúncio neste link:</p><p><a href="${artUrl}">${artUrl}</a></p><p>Após a aprovação (até 24h), o card entra no ar.</p>`,
        });
        await notifyByEmail({
          to: ADMIN_EMAIL,
          subject: `Novo slot vendido (${ad.plan}) — aguardando arte`,
          html: `<p>${ad.email} comprou o plano ${ad.plan}.</p>`,
        });
      }
    }
  }

  return Response.json({ received: true });
}
