import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { profile, socialLinks, withUtm, SITE_URL } from "@/content/site";
import { sobre } from "@/content/sobre";
import { Icon } from "@/components/icons";
import { TrackLink } from "@/components/track-link";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  const title = `Sobre — ${profile.name}`;
  const description = sobre.positioning;

  return {
    title,
    description,
    alternates: { canonical: "/sobre" },
    openGraph: { title, description, url: "/sobre", type: "profile" },
  };
}

export default async function SobrePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <div className="mx-auto max-w-3xl py-8">
      {/* Hero */}
      <section className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={profile.avatar}
          alt={profile.name}
          width={112}
          height={112}
          className="size-28 rounded-full border border-zinc-200 bg-white"
        />
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700">
            {profile.name}
          </p>
          <h1 className="mt-1 text-2xl font-bold leading-tight tracking-tight text-zinc-900 sm:text-3xl">
            {sobre.positioning}
          </h1>
        </div>
      </section>

      <p className="mt-6 text-base leading-7 text-zinc-600">{sobre.intro}</p>

      {/* Disponibilidade */}
      {sobre.availability.open && (
        <section className="mt-8 rounded-2xl border border-emerald-600/20 bg-emerald-50 p-5">
          <div className="flex items-center gap-2">
            <span className="relative flex size-2.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex size-2.5 rounded-full bg-emerald-600" />
            </span>
            <h2 className="text-sm font-bold text-emerald-900">
              {sobre.availability.headline}
            </h2>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {sobre.availability.roles.map((role) => (
              <span
                key={role}
                className="rounded-full bg-white px-3 py-1 text-xs font-medium text-emerald-800 ring-1 ring-inset ring-emerald-600/20"
              >
                {role}
              </span>
            ))}
          </div>
          <p className="mt-3 text-xs text-emerald-800/80">
            {sobre.availability.note}
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href={`mailto:${profile.email}`}
              className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 active:scale-[0.97]"
            >
              Entrar em contato
            </a>
            <a
              href="/curriculo-mariane-belini.pdf"
              target="_blank"
              rel="noopener"
              className="rounded-lg border border-emerald-600/30 bg-white px-5 py-2.5 text-sm font-semibold text-emerald-800 transition hover:border-emerald-600/50 active:scale-[0.97]"
            >
              Baixar currículo (PDF)
            </a>
          </div>
        </section>
      )}

      {/* Minha história */}
      <section className="mt-12">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
          Minha história
        </h2>
        <div className="mt-4 space-y-4">
          {sobre.story.map((paragraph, i) => (
            <p key={i} className="text-sm leading-7 text-zinc-600">
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      {/* No que sou boa */}
      <section className="mt-12">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
          No que sou boa
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {sobre.skills.map((skill) => (
            <div
              key={skill.group}
              className="rounded-xl border border-zinc-200 bg-white p-4"
            >
              <p className="text-sm font-semibold text-zinc-900">{skill.group}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {skill.items.map((item) => (
                  <span
                    key={item}
                    className="rounded-md border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-xs font-medium text-zinc-600"
                  >
                    {item}
                  </span>
                ))}
              </div>
              <p className="mt-3 text-xs leading-5 text-zinc-500">{skill.note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Destaques */}
      <section className="mt-12">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
          O que já construí
        </h2>
        <div className="mt-4 grid gap-3">
          {sobre.highlights.map((project) => {
            const external = project.url.startsWith("http");
            return (
              <a
                key={project.name}
                href={project.url}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener" : undefined}
                className="group rounded-xl border border-zinc-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-sm"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-base font-semibold text-zinc-900 transition group-hover:text-emerald-700">
                    {project.name}
                  </h3>
                  <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                    {project.tag}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  {project.blurb}
                </p>
              </a>
            );
          })}
        </div>
      </section>

      {/* Aprendendo agora */}
      <section className="mt-12">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
          {sobre.learning.title}
        </h2>
        <div className="mt-4 space-y-3">
          {sobre.learning.items.map((item) => (
            <div
              key={item.name}
              className="rounded-xl border border-dashed border-zinc-300 bg-white p-5"
            >
              <p className="text-sm font-semibold text-zinc-900">{item.name}</p>
              <p className="mt-1 text-sm leading-6 text-zinc-500">{item.note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contato / redes */}
      <section className="mt-12 border-t border-zinc-200 pt-8 text-center">
        <p className="text-sm text-zinc-500">
          Vamos conversar? Me encontre por aqui:
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {socialLinks.map((s) => (
            <TrackLink
              key={s.id}
              event="social_click"
              eventData={{ id: s.id, from: "sobre" }}
              href={withUtm(s.url, s.id)}
              aria-label={s.label}
              className="flex size-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-500 transition hover:border-zinc-300 hover:text-zinc-900 active:scale-95"
            >
              <Icon name={s.icon} className="size-4" />
            </TrackLink>
          ))}
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfilePage",
            mainEntity: {
              "@type": "Person",
              name: "Mariane Ramalho Belini",
              alternateName: ["Mariane Belini", "DEVLINI"],
              jobTitle: "Desenvolvedora Full Stack",
              description: sobre.positioning,
              url: `${SITE_URL}/sobre`,
              image: `${SITE_URL}/avatar.jpg`,
              sameAs: socialLinks.map((s) => s.url).filter((u) => u.startsWith("http")),
            },
          }),
        }}
      />
    </div>
  );
}
