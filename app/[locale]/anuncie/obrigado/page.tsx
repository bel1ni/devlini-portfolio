import { connection } from "next/server";
import { getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import Stripe from "stripe";
import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/content/site";
import { ensureAdFromSession } from "@/lib/ads-db";

export const dynamic = "force-dynamic";

export default async function ThanksPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ session_id?: string }>;
}) {
  await connection(); // renderização por request: session_id vem da query string
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({ locale, namespace: "thanks" });

  const { session_id } = await searchParams;
  const stripeKey = process.env.STRIPE_SECRET_KEY;

  let artUrl: string | null = null;
  let paid = false;

  if (stripeKey && session_id) {
    try {
      const stripe = new Stripe(stripeKey);
      const session = await stripe.checkout.sessions.retrieve(session_id);
      if (session.payment_status === "paid") {
        paid = true;
        const ad = await ensureAdFromSession({
          sessionId: session.id,
          email: session.customer_details?.email ?? "",
          plan: session.metadata?.plan ?? "unknown",
          durationDays: Number(session.metadata?.duration_days ?? 30),
        });
        if (ad) artUrl = `${SITE_URL}/anuncie/arte?token=${ad.token}`;
      }
    } catch {
      // sessão inválida: cai na mensagem genérica
    }
  }

  return (
    <div className="mx-auto mt-16 max-w-xl text-center">
      <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
        {paid ? t("paidTitle") : t("genericTitle")}
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-zinc-500">
        {paid ? t("paidBody") : t("genericBody")}
      </p>
      {artUrl && (
        <a
          href={artUrl}
          className="mt-6 inline-block rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          {t("artCta")}
        </a>
      )}
      {artUrl && (
        <p className="mt-3 break-all text-xs text-zinc-400">{artUrl}</p>
      )}
    </div>
  );
}
