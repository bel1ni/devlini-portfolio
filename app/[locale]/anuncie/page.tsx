import { setRequestLocale, getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { adPlans, profile } from "@/content/site";
import { adsDbEnabled } from "@/lib/ads-db";
import { TrackLink } from "@/components/track-link";
import { CheckoutButton } from "@/components/checkout-button";
import { Icon } from "@/components/icons";

export default async function AdvertisePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const l = locale as Locale;
  const t = await getTranslations("advertise");

  // Checkout self-serve ativo quando Stripe + banco estão configurados;
  // sem eles, o CTA cai para o fluxo por e-mail (Fase 1)
  const checkoutEnabled = !!process.env.STRIPE_SECRET_KEY && adsDbEnabled;

  const mailto = (planId: string) =>
    `mailto:${profile.email}?subject=${encodeURIComponent(
      `${t("emailSubject")} — ${adPlans.find((p) => p.id === planId)?.duration[l]}`,
    )}`;

  return (
    <div className="mx-auto max-w-3xl">
      {/* Hero da página de anúncios */}
      <section className="mt-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
          {t("title")}
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-zinc-500">
          {t("subtitle")}
        </p>
        <p className="mx-auto mt-4 max-w-xl rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5 text-xs leading-relaxed text-amber-800">
          {t("honesty")}
        </p>
      </section>

      {/* Tabela de preços — GBB + decoy (PRD §4.7) */}
      <section className="mt-10 grid gap-4 sm:grid-cols-3">
        {adPlans.map((plan) => (
          <div
            key={plan.id}
            className={
              plan.featured
                ? "relative flex flex-col rounded-2xl border-2 border-emerald-600 bg-white p-5 shadow-sm"
                : "flex flex-col rounded-2xl border border-zinc-200 bg-white p-5"
            }
          >
            {plan.featured && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-emerald-600 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                {t("mostPopular")}
              </span>
            )}
            <p className="text-sm font-semibold text-zinc-500">
              {plan.duration[l]}
            </p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-zinc-900">
              R$ {plan.price}
              <span className="ml-1 text-xs font-normal text-zinc-400">
                {t("perSlot")}
              </span>
            </p>
            <ul className="mt-4 flex flex-col gap-2 text-xs text-zinc-600">
              {(t.raw(`features.${plan.id}`) as string[]).map((feature, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Icon
                    name="check"
                    className="mt-0.5 size-3.5 shrink-0 text-emerald-600"
                  />
                  {feature}
                </li>
              ))}
            </ul>
            {checkoutEnabled ? (
              <CheckoutButton
                plan={plan.id}
                label={t("cta")}
                featured={plan.featured}
              />
            ) : (
              <TrackLink
                event="ad_plan_click"
                eventData={{ plan: plan.id }}
                href={mailto(plan.id)}
                className={
                  plan.featured
                    ? "mt-5 rounded-lg bg-emerald-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-emerald-700"
                    : "mt-5 rounded-lg border border-zinc-300 px-4 py-2.5 text-center text-sm font-semibold text-zinc-700 transition hover:border-zinc-400"
                }
              >
                {t("cta")}
              </TrackLink>
            )}
            <p className="mt-2 text-center text-[10px] text-zinc-400">
              {t("ctaNote")}
            </p>
          </div>
        ))}
      </section>

      {/* Como funciona / Specs / Política */}
      <section className="mt-12 grid gap-8 sm:grid-cols-3">
        {(
          [
            ["howTitle", "how"],
            ["specsTitle", "specs"],
            ["policyTitle", "policy"],
          ] as const
        ).map(([titleKey, listKey]) => (
          <div key={listKey}>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
              {t(titleKey)}
            </h2>
            <ul className="mt-3 flex flex-col gap-2 text-xs leading-relaxed text-zinc-600">
              {(t.raw(listKey) as string[]).map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span
                    aria-hidden
                    className="mt-1.5 size-1 shrink-0 rounded-full bg-emerald-600"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </div>
  );
}
