import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { SITE_URL } from "@/content/site";
import { tools, toolsCopy } from "@/content/tools";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l = (hasLocale(routing.locales, locale) ? locale : "pt") as Locale;

  const title = toolsCopy.hubTitle[l];
  const description = toolsCopy.hubTagline[l];
  const path = l === "pt" ? "/ferramentas" : `/${l}/ferramentas`;

  return {
    title,
    description,
    alternates: {
      canonical: path,
      languages: { pt: "/ferramentas", en: "/en/ferramentas" },
    },
    openGraph: { title, description, url: path, type: "website" },
  };
}

export default async function ToolsHubPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const l = locale as Locale;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: toolsCopy.hubTitle[l],
    description: toolsCopy.hubTagline[l],
    url: `${SITE_URL}${l === "pt" ? "/ferramentas" : "/en/ferramentas"}`,
    hasPart: tools.map((tool) => ({
      "@type": "SoftwareApplication",
      name: tool.name[l],
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Web",
      url: `${SITE_URL}${l === "pt" ? "" : "/en"}/ferramentas/${tool.slug}`,
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
          {toolsCopy.home[l]}
        </Link>{" "}
        / <span className="text-zinc-600">{toolsCopy.breadcrumb[l]}</span>
      </nav>

      <h1 className="mt-3 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
        {toolsCopy.hubTitle[l]}
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
        {toolsCopy.hubTagline[l]}
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <Link
            key={tool.slug}
            href={`/ferramentas/${tool.slug}`}
            className="group rounded-xl border border-zinc-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-sm"
          >
            <span className="text-2xl" aria-hidden>
              {tool.icon}
            </span>
            <h2 className="mt-3 text-base font-semibold text-zinc-900 transition group-hover:text-emerald-700">
              {tool.name[l]}
            </h2>
            <p className="mt-1 text-sm leading-5 text-zinc-500">
              {tool.description[l]}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
