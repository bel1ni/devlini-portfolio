import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { profile, SITE_URL } from "@/content/site";
import { getPost, getPosts, getPostSlugs } from "@/lib/blog/get-posts";
import { EditFab } from "@/components/edit-fab";
import { ShareButtons } from "@/components/blog/share-buttons";
import { Comments } from "@/components/blog/comments";

export const revalidate = 30;

function fmt(date: string) {
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" }).format(new Date(date));
}

export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return routing.locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  const title = `${post.title} — ${profile.name}`;
  const description = post.excerpt ?? post.title;
  const path = `/blog/${post.slug}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      type: "article",
      images: post.cover_url ? [post.cover_url] : undefined,
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const post = await getPost(slug);
  if (!post) notFound();

  const others = (await getPosts()).filter((p) => p.slug !== post.slug).slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt ?? undefined,
    datePublished: post.published_at,
    image: post.cover_url ?? undefined,
    url: `${SITE_URL}/blog/${post.slug}`,
    author: { "@type": "Person", name: "Mariane Ramalho Belini" },
  };

  return (
    <article className="mx-auto max-w-2xl py-8">
      <EditFab href="/blog/editar" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <nav className="text-xs text-zinc-500">
        <Link href="/" className="hover:text-zinc-600">
          Início
        </Link>{" "}
        /{" "}
        <Link href="/blog" className="hover:text-zinc-600">
          Blog
        </Link>{" "}
        / <span className="text-zinc-600">{post.title}</span>
      </nav>

      <p className="mt-4 text-xs text-zinc-500">{fmt(post.published_at)}</p>
      <h1 className="mt-1 text-2xl font-bold leading-tight tracking-tight text-zinc-900 sm:text-3xl">
        {post.title}
      </h1>

      {post.cover_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.cover_url}
          alt={post.title}
          className="mt-6 w-full rounded-2xl border border-zinc-200 object-cover"
        />
      )}

      {post.body && (
        <div className="mt-6 whitespace-pre-line text-[15px] leading-7 text-zinc-700">
          {post.body}
        </div>
      )}

      <ShareButtons title={post.title} />

      <Comments slug={post.slug} />

      {others.length > 0 && (
        <section className="mt-12 border-t border-zinc-200 pt-8">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
            Outros posts
          </h2>
          <div className="mt-4 grid gap-3">
            {others.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="group rounded-xl border border-zinc-200 bg-white p-4 transition hover:border-zinc-300 hover:shadow-sm"
              >
                <span className="text-xs text-zinc-500">{fmt(p.published_at)}</span>
                <span className="mt-0.5 block text-sm font-semibold text-zinc-900 transition group-hover:text-emerald-700">
                  {p.title}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
