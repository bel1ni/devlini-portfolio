import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Inter } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Analytics } from "@vercel/analytics/next";
import { routing } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { profile, SITE_URL } from "@/content/site";
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    metadataBase: new URL(SITE_URL),
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: locale === "pt" ? "/" : `/${locale}`,
      languages: { pt: "/", en: "/en" },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      siteName: "DEVLINI",
      type: "profile",
      locale: locale === "pt" ? "pt_BR" : "en_US",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "header" });
  const tf = await getTranslations({ locale, namespace: "footer" });

  return (
    <html lang={locale === "pt" ? "pt-BR" : "en"} className={inter.variable}>
      <body className="min-h-screen bg-zinc-50 font-sans text-zinc-900 antialiased">
        <NextIntlClientProvider>
          <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-5 sm:px-6">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm font-bold tracking-widest text-zinc-900"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/devlini-badge.png"
                alt=""
                width={24}
                height={24}
                className="size-6"
              />
              DEVLINI
            </Link>
            <nav className="flex items-center gap-3">
              <Link
                href="/anuncie"
                className="text-sm font-medium text-zinc-500 transition hover:text-zinc-900"
              >
                {t("advertise")}
              </Link>
              <LocaleSwitcher />
            </nav>
          </header>

          <main className="mx-auto w-full max-w-5xl px-4 pb-16 sm:px-6">
            {children}
          </main>

          <footer className="border-t border-zinc-200 bg-white">
            <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-zinc-400 sm:flex-row sm:px-6">
              <p>
                © {new Date().getFullYear()} {profile.name}
              </p>
              <Link
                href="/anuncie"
                className="font-medium text-zinc-500 hover:text-emerald-600"
              >
                {tf("advertise")} →
              </Link>
            </div>
          </footer>
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
