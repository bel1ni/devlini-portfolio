import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { profile } from "@/content/site";
import { getBaseUrl } from "@/lib/agro/site-url";
import CookieConsent from "@/components/agro/cookie-consent";
import "../../globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
const gaId = process.env.NEXT_PUBLIC_GA_ID;

const baseUrl = getBaseUrl();

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "DEVLINI Agro | Notícias do agronegócio brasileiro",
    template: "%s | DEVLINI Agro",
  },
  description:
    "Notícias do agronegócio: pecuária, agricultura, mercado, clima e política agrícola do Brasil, resumidas por IA para o produtor rural.",
  keywords: [
    "agronegócio",
    "pecuária",
    "agricultura",
    "notícias do agro",
    "boi gordo",
    "soja",
    "milho",
    "plano safra",
    "produtor rural",
    "DEVLINI Agro",
  ],
  authors: [{ name: profile.name }],
  creator: profile.name,
  publisher: "DEVLINI",
  alternates: {
    canonical: "/agro",
  },
  openGraph: {
    title: "DEVLINI Agro | Notícias do agronegócio brasileiro",
    description:
      "Pecuária, agricultura, mercado e clima resumidos por IA em tempo real.",
    url: "/agro",
    siteName: "DEVLINI",
    locale: "pt_BR",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const navLinks = [
  { href: "/agro/briefing", label: "Briefing" },
  { href: "/agro/bookmarks", label: "Salvos" },
  { href: "/anuncie", label: "Anuncie" },
];

export default function AgroLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className="min-h-screen bg-zinc-50 font-sans text-zinc-900 antialiased">
        <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-5 sm:px-6">
          <div className="flex items-center gap-2">
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
            <Link
              href="/agro"
              className="rounded-full bg-emerald-600 px-2 py-0.5 text-[11px] font-bold uppercase tracking-widest text-white"
            >
              Agro
            </Link>
          </div>
          <nav className="flex items-center gap-3 sm:gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-zinc-500 transition hover:text-zinc-900"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </header>

        <main className="mx-auto w-full max-w-5xl px-4 pb-16 sm:px-6">
          {children}
        </main>

        <footer className="border-t border-zinc-200 bg-white">
          <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-zinc-400 sm:flex-row sm:px-6">
            <p>
              © {new Date().getFullYear()} {profile.name} —{" "}
              <Link href="/" className="font-medium text-zinc-500 hover:text-emerald-600">
                devlini.com
              </Link>
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/agro/sobre" className="hover:text-zinc-600">
                Sobre
              </Link>
              <Link href="/agro/privacidade" className="hover:text-zinc-600">
                Privacidade
              </Link>
              <Link href="/agro/termos" className="hover:text-zinc-600">
                Termos
              </Link>
              <Link href="/agro/contato" className="hover:text-zinc-600">
                Contato
              </Link>
            </div>
          </div>
        </footer>

        <CookieConsent />
        <Analytics />

        {adsenseClient && (
          <Script
            id="adsense"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}

        {gaId && (
          <>
            <Script
              id="ga-loader"
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
