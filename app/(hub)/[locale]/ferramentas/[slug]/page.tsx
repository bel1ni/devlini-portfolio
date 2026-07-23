import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { SITE_URL } from "@/content/site";
import { tools, getTool, toolsCopy } from "@/content/tools";
import { ToolRenderer } from "@/components/tools/tool-renderer";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    tools.map((tool) => ({ locale, slug: tool.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const l = (hasLocale(routing.locales, locale) ? locale : "pt") as Locale;
  const tool = getTool(slug);

  if (!tool) return {};

  const title = tool.name[l];
  const description = tool.seoDescription[l];
  const path = `${l === "pt" ? "" : `/${l}`}/ferramentas/${tool.slug}`;

  return {
    title,
    description,
    keywords: tool.keywords,
    alternates: {
      canonical: path,
      languages: {
        pt: `/ferramentas/${tool.slug}`,
        en: `/en/ferramentas/${tool.slug}`,
      },
    },
    openGraph: { title, description, url: path, type: "website" },
  };
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const l = locale as Locale;
  const tool = getTool(slug);
  if (!tool) notFound();

  const url = `${SITE_URL}${l === "pt" ? "" : `/${l}`}/ferramentas/${tool.slug}`;
  const others = tools.filter((other) => other.slug !== tool.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: tool.name[l],
        description: tool.seoDescription[l],
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Web",
        offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
        url,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: toolsCopy.breadcrumb[l],
            item: `${SITE_URL}${l === "pt" ? "" : `/${l}`}/ferramentas`,
          },
          { "@type": "ListItem", position: 2, name: tool.name[l], item: url },
        ],
      },
    ],
  };

  return (
    <div className="mx-auto max-w-3xl py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <nav className="text-xs text-zinc-400">
        <Link href="/" className="hover:text-zinc-600">
          {toolsCopy.home[l]}
        </Link>{" "}
        /{" "}
        <Link href="/ferramentas" className="hover:text-zinc-600">
          {toolsCopy.breadcrumb[l]}
        </Link>{" "}
        / <span className="text-zinc-600">{tool.name[l]}</span>
      </nav>

      <div className="mt-3 flex items-start gap-3">
        <span className="text-3xl" aria-hidden>
          {tool.icon}
        </span>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
            {tool.name[l]}
          </h1>
          <p className="mt-1 text-sm leading-6 text-zinc-500">
            {tool.seoDescription[l]}
          </p>
        </div>
      </div>

      <div className="mt-8">
        <ToolRenderer slug={tool.slug} locale={l} />
      </div>

      <p className="mt-4 text-center text-xs text-zinc-400">
        🔒 {toolsCopy.privacyNote[l]}
      </p>

      <section className="mt-12 border-t border-zinc-200 pt-8">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
          {toolsCopy.otherTools[l]}
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {others.map((other) => (
            <Link
              key={other.slug}
              href={`/ferramentas/${other.slug}`}
              className="group flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-4 transition hover:border-zinc-300 hover:shadow-sm"
            >
              <span className="text-xl" aria-hidden>
                {other.icon}
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-zinc-900 transition group-hover:text-emerald-700">
                  {other.name[l]}
                </span>
                <span className="block truncate text-xs text-zinc-500">
                  {other.description[l]}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
