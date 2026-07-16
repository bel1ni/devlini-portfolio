import { setRequestLocale, getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";
import {
  ads,
  mainLinks,
  products,
  profile,
  projects,
  socialLinks,
  techStack,
  withUtm,
  SITE_URL,
} from "@/content/site";
import type { Ad } from "@/content/site";
import { getActiveAds } from "@/lib/ads-db";
import { AdCard } from "@/components/ad-card";
import { Section } from "@/components/section";
import { TrackLink } from "@/components/track-link";
import { Icon } from "@/components/icons";

// ISR: anúncios do painel self-serve entram/expiram sem redeploy
export const revalidate = 300;

const statusStyle: Record<string, string> = {
  live: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  building: "bg-amber-50 text-amber-700 ring-amber-600/20",
  paused: "bg-zinc-100 text-zinc-500 ring-zinc-500/20",
};

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const l = locale as Locale;
  const t = await getTranslations("sections");
  const tStatus = await getTranslations("status");
  const tHero = await getTranslations("hero");
  const tCreations = await getTranslations("ads");

  // Slots: anúncio do painel (banco) tem prioridade; senão, config estática
  const dbAds = await getActiveAds();
  const slots: (Ad | null)[] = [1, 2, 3].map((n) => {
    const db = dbAds.find((a) => a.slot === n);
    if (db) {
      return {
        id: `db-${db.id}`,
        title: db.title ?? "",
        description: { pt: db.description ?? "", en: db.description ?? "" },
        url: db.url ?? "#",
        imageUrl: db.image_url ?? undefined,
      };
    }
    return ads[n - 1] ?? null;
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    description: profile.headline[l],
    email: `mailto:${profile.email}`,
    url: SITE_URL,
  };

  return (
    <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Coluna principal */}
      <div>
        {/* Hero */}
        <section className="mt-4 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={profile.avatar}
            alt={profile.name}
            width={96}
            height={96}
            className="size-24 rounded-full border border-zinc-200 bg-white"
          />
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
              {profile.name}
            </h1>
            <p className="mt-1 font-medium text-emerald-700">
              {profile.headline[l]}
            </p>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-zinc-500">
              {profile.bio[l]}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-zinc-400">
              <span>{profile.location[l]}</span>
              <span aria-hidden>·</span>
              <a
                href={`mailto:${profile.email}`}
                target="_blank"
                rel="noopener"
                className="font-medium text-zinc-500 hover:text-emerald-600"
              >
                {tHero("contact")}
              </a>
            </div>
          </div>
        </section>

        {/* Redes sociais */}
        <div className="rise-in mt-5 flex flex-wrap gap-2">
          {socialLinks.map((s) => (
            <TrackLink
              key={s.id}
              event="social_click"
              eventData={{ id: s.id }}
              href={withUtm(s.url, s.id)}
              aria-label={s.label}
              className="flex size-9 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-500 transition hover:border-zinc-300 hover:text-zinc-900 active:scale-95"
            >
              <Icon name={s.icon} className="size-4" />
            </TrackLink>
          ))}
        </div>

        {/* Stack */}
        <div className="rise-in mt-5 flex flex-wrap gap-1.5" style={{ animationDelay: "60ms" }}>
          {techStack.map((tech) => (
            <span
              key={tech}
              className="rounded-md border border-zinc-200 bg-white px-2 py-0.5 text-xs font-medium text-zinc-600"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* O que estou construindo */}
        <Section
          title={t("building")}
          className="rise-in"
          style={{ animationDelay: "120ms" }}
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {projects.map((p) => {
              const body = (
                <>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-zinc-900">
                      {p.name}
                    </p>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ring-1 ring-inset ${statusStyle[p.status]}`}
                    >
                      {tStatus(p.status)}
                    </span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-zinc-500">
                    {p.description[l]}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {p.tech.map((tech) => (
                      <span
                        key={tech}
                        className="rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium text-zinc-500"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </>
              );
              const className =
                "block rounded-xl border border-zinc-200 bg-white p-4 transition hover:border-zinc-300 hover:shadow-sm" +
                (p.url ? " active:scale-[0.98]" : "");
              return p.url ? (
                <TrackLink
                  key={p.id}
                  event="project_click"
                  eventData={{ id: p.id }}
                  href={withUtm(p.url, `project-${p.id}`)}
                  target="_blank"
                  rel="noopener"
                  className={className}
                >
                  {body}
                </TrackLink>
              ) : (
                <div key={p.id} className={className}>
                  {body}
                </div>
              );
            })}
          </div>
        </Section>

        {/* Anúncio inline (mobile) */}
        <div className="rise-in mt-8 lg:hidden" style={{ animationDelay: "160ms" }}>
          <AdCard ad={slots[0]} slot={1} locale={l} />
        </div>

        {/* Links */}
        <Section
          title={t("links")}
          className="rise-in"
          style={{ animationDelay: "180ms" }}
        >
          <div className="flex flex-col gap-2.5">
            {mainLinks.map((link) => (
              <TrackLink
                key={link.id}
                event="link_click"
                eventData={{ id: link.id }}
                href={withUtm(link.url, link.id)}
                className="group flex items-center justify-between rounded-xl border border-zinc-200 bg-white px-4 py-3.5 transition hover:border-zinc-300 hover:shadow-sm active:scale-[0.98]"
              >
                <span className="text-sm font-medium text-zinc-800">
                  {link.label[l]}
                </span>
                <Icon
                  name="external"
                  className="size-4 text-zinc-300 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-emerald-600"
                />
              </TrackLink>
            ))}
          </div>
        </Section>

        {/* Anúncio inline (mobile) */}
        <div className="rise-in mt-8 lg:hidden" style={{ animationDelay: "220ms" }}>
          <AdCard ad={slots[1]} slot={2} locale={l} />
        </div>

        {/* Minhas criações */}
        <Section
          title={t("creations")}
          className="rise-in"
          style={{ animationDelay: "240ms" }}
        >
          <div className="flex flex-col gap-3">
            {products.map((prod) => (
              <div
                key={prod.id}
                className="rounded-xl border border-zinc-200 bg-white p-5"
              >
                <p className="text-base font-semibold text-zinc-900">
                  {prod.name}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-zinc-500">
                  {prod.tagline[l]}
                </p>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs text-zinc-400">
                    {prod.priceNote[l]}
                  </span>
                  <TrackLink
                    event="product_click"
                    eventData={{ id: prod.id }}
                    href={withUtm(prod.url, `product-${prod.id}`)}
                    target="_blank"
                    rel="noopener"
                    className="group inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 active:scale-[0.97]"
                  >
                    {prod.cta[l]}
                    <Icon
                      name="arrow"
                      className="size-4 transition group-hover:translate-x-0.5"
                    />
                  </TrackLink>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Anúncio inline (mobile) */}
        <div className="rise-in mt-8 lg:hidden" style={{ animationDelay: "280ms" }}>
          <AdCard ad={slots[2]} slot={3} locale={l} />
        </div>
      </div>

      {/* Sidebar de anúncios (desktop) — PRD §4.5 */}
      <aside className="hidden lg:block">
        <div
          className="rise-in sticky top-6 mt-4 flex flex-col gap-3"
          style={{ animationDelay: "200ms" }}
        >
          <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-300">
            {tCreations("sponsored")}
          </p>
          {slots.map((ad, i) => (
            <AdCard key={ad?.id ?? `empty-${i}`} ad={ad} slot={i + 1} locale={l} />
          ))}
        </div>
      </aside>
    </div>
  );
}
