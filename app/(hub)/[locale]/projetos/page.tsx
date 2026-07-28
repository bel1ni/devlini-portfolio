import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { profile, SITE_URL } from "@/content/site";
import { getProjects } from "@/lib/projetos/get-projects";

export const revalidate = 30;

const statusLabel: Record<string, string> = {
  live: "No ar",
  building: "Em construção",
  paused: "Pausado",
};
const statusStyle: Record<string, string> = {
  live: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  building: "bg-amber-50 text-amber-700 ring-amber-600/20",
  paused: "bg-zinc-100 text-zinc-500 ring-zinc-500/20",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  const title = `Projetos — ${profile.name}`;
  const description =
    "Cases dos projetos que construí: problema, solução, minha atuação e resultado.";
  return {
    title,
    description,
    alternates: { canonical: "/projetos" },
    openGraph: { title, description, url: "/projetos", type: "website" },
  };
}

export default async function ProjetosPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const projects = await getProjects();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Projetos — ${profile.name}`,
    url: `${SITE_URL}/projetos`,
    hasPart: projects.map((p) => ({
      "@type": "CreativeWork",
      name: p.name,
      url: `${SITE_URL}/projetos/${p.slug}`,
    })),
  };

  return (
    <div className="py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <nav className="text-xs text-zinc-400">
        <Link href="/" className="hover:text-zinc-600">
          Início
        </Link>{" "}
        / <span className="text-zinc-600">Projetos</span>
      </nav>

      <h1 className="mt-3 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
        Projetos
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
        Cada projeto que construí, por dentro: o problema, a solução, o que eu
        fiz e o resultado.
      </p>

      {projects.length === 0 ? (
        <p className="mt-8 rounded-xl border border-dashed border-zinc-200 p-10 text-center text-sm text-zinc-400">
          Em breve.
        </p>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {projects.map((p) => (
            <Link
              key={p.slug}
              href={`/projetos/${p.slug}`}
              className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-sm"
            >
              {p.cover_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.cover_url}
                  alt={p.name}
                  className="h-40 w-full object-cover"
                />
              )}
              <div className="p-5">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-base font-semibold text-zinc-900 transition group-hover:text-emerald-700">
                    {p.name}
                  </h2>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ring-1 ring-inset ${statusStyle[p.status]}`}
                  >
                    {statusLabel[p.status] ?? p.status}
                  </span>
                </div>
                {p.summary && (
                  <p className="mt-2 text-sm leading-6 text-zinc-500">{p.summary}</p>
                )}
                {p.tech.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {p.tech.map((t) => (
                      <span
                        key={t}
                        className="rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium text-zinc-500"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
