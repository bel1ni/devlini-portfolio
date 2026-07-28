import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { profile, SITE_URL } from "@/content/site";
import { getPosts } from "@/lib/blog/get-posts";
import { EditFab } from "@/components/edit-fab";

export const revalidate = 30;

function fmt(date: string) {
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" }).format(new Date(date));
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  const title = `Blog — ${profile.name}`;
  const description =
    "Diário de aprendizados em tecnologia e desenvolvimento — construindo em público.";
  return {
    title,
    description,
    alternates: { canonical: "/blog" },
    openGraph: { title, description, url: "/blog", type: "website" },
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const posts = await getPosts();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `Blog — ${profile.name}`,
    url: `${SITE_URL}/blog`,
    blogPost: posts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      datePublished: p.published_at,
      url: `${SITE_URL}/blog/${p.slug}`,
    })),
  };

  return (
    <div className="py-8">
      <EditFab href="/blog/editar" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <nav className="text-xs text-zinc-400">
        <Link href="/" className="hover:text-zinc-600">
          Início
        </Link>{" "}
        / <span className="text-zinc-600">Blog</span>
      </nav>

      <h1 className="mt-3 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
        Blog
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
        Meu diário de aprendizados em tecnologia — construindo em público.
      </p>

      {posts.length === 0 ? (
        <p className="mt-8 rounded-xl border border-dashed border-zinc-200 p-10 text-center text-sm text-zinc-400">
          Em breve.
        </p>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {posts.map((p) => (
            <Link
              key={p.slug}
              href={`/blog/${p.slug}`}
              className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-sm"
            >
              {p.cover_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.cover_url} alt={p.title} className="h-40 w-full object-cover" />
              )}
              <div className="p-5">
                <p className="text-xs text-zinc-400">{fmt(p.published_at)}</p>
                <h2 className="mt-1 text-base font-semibold text-zinc-900 transition group-hover:text-emerald-700">
                  {p.title}
                </h2>
                {p.excerpt && (
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-zinc-500">
                    {p.excerpt}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
