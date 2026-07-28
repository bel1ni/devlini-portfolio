import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { profile, SITE_URL } from "@/content/site";
import { getProject, getProjects, getProjectSlugs } from "@/lib/projetos/get-projects";

export const revalidate = 30;

const statusLabel: Record<string, string> = {
  live: "No ar",
  building: "Em construção",
  paused: "Pausado",
};

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return routing.locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return {};

  const title = `${project.name} — ${profile.name}`;
  const description = project.summary ?? `Case do projeto ${project.name}.`;
  const path = `/projetos/${project.slug}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      type: "article",
      images: project.cover_url ? [project.cover_url] : undefined,
    },
  };
}

export default async function ProjetoPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const project = await getProject(slug);
  if (!project) notFound();

  const others = (await getProjects()).filter((p) => p.slug !== project.slug);

  const sections = [
    { label: "O problema", body: project.problem },
    { label: "A solução", body: project.solution },
    { label: "O que eu fiz", body: project.role },
    { label: "Resultado", body: project.result },
  ].filter((s) => s.body);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.name,
    description: project.summary ?? undefined,
    url: `${SITE_URL}/projetos/${project.slug}`,
    image: project.cover_url ?? undefined,
    author: { "@type": "Person", name: "Mariane Ramalho Belini" },
  };

  return (
    <article className="mx-auto max-w-3xl py-8">
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
        /{" "}
        <Link href="/projetos" className="hover:text-zinc-600">
          Projetos
        </Link>{" "}
        / <span className="text-zinc-600">{project.name}</span>
      </nav>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
          {project.name}
        </h1>
        <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
          {statusLabel[project.status] ?? project.status}
        </span>
      </div>

      {project.summary && (
        <p className="mt-2 text-base leading-7 text-zinc-600">{project.summary}</p>
      )}

      {(project.live_url || project.repo_url) && (
        <div className="mt-4 flex flex-wrap gap-3">
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener"
              className="rounded-lg bg-emerald-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 active:scale-[0.97]"
            >
              Ver ao vivo →
            </a>
          )}
          {project.repo_url && (
            <a
              href={project.repo_url}
              target="_blank"
              rel="noopener"
              className="rounded-lg border border-zinc-200 bg-white px-5 py-2 text-sm font-semibold text-zinc-700 transition hover:border-zinc-300 active:scale-[0.97]"
            >
              Código
            </a>
          )}
        </div>
      )}

      {project.cover_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={project.cover_url}
          alt={project.name}
          className="mt-6 w-full rounded-2xl border border-zinc-200 object-cover"
        />
      )}

      {project.tech.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-1.5">
          {project.tech.map((t) => (
            <span
              key={t}
              className="rounded-md border border-zinc-200 bg-white px-2 py-0.5 text-xs font-medium text-zinc-600"
            >
              {t}
            </span>
          ))}
        </div>
      )}

      <div className="mt-8 space-y-8">
        {sections.map((s) => (
          <section key={s.label}>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
              {s.label}
            </h2>
            <p className="mt-2 whitespace-pre-line text-sm leading-7 text-zinc-600">
              {s.body}
            </p>
          </section>
        ))}
      </div>

      {others.length > 0 && (
        <section className="mt-12 border-t border-zinc-200 pt-8">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
            Outros projetos
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {others.map((p) => (
              <Link
                key={p.slug}
                href={`/projetos/${p.slug}`}
                className="group rounded-xl border border-zinc-200 bg-white p-4 transition hover:border-zinc-300 hover:shadow-sm"
              >
                <span className="block text-sm font-semibold text-zinc-900 transition group-hover:text-emerald-700">
                  {p.name}
                </span>
                {p.summary && (
                  <span className="mt-1 block line-clamp-2 text-xs text-zinc-500">
                    {p.summary}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
