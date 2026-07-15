import { NextResponse } from "next/server";
import Stripe from "stripe";
import { adPlans, SITE_URL } from "@/content/site";
import { adsDbEnabled } from "@/lib/ads-db";

export async function POST(req: Request) {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || !adsDbEnabled) {
    return NextResponse.json({ error: "checkout_disabled" }, { status: 503 });
  }

  const body = (await req.json().catch(() => null)) as { plan?: string } | null;
  const plan = adPlans.find((p) => p.id === body?.plan);
  if (!plan) {
    return NextResponse.json({ error: "invalid_plan" }, { status: 400 });
  }

  const stripe = new Stripe(key);
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "brl",
          unit_amount: plan.price * 100,
          product_data: {
            name: `Anúncio no Link Hub (devlini.com) — ${plan.duration.pt}`,
          },
        },
      },
    ],
    metadata: { plan: plan.id, duration_days: String(plan.days) },
    success_url: `${SITE_URL}/anuncie/obrigado?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${SITE_URL}/anuncie`,
  });

  return NextResponse.json({ url: session.url });
}
