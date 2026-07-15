import { connection } from "next/server";
import { getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { getAdByToken } from "@/lib/ads-db";
import { ArtForm } from "@/components/art-form";

export const dynamic = "force-dynamic";

export default async function ArtPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  await connection(); // renderização por request: token vem da query string
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({ locale, namespace: "artForm" });

  const { token } = await searchParams;
  const ad = token ? await getAdByToken(token) : null;

  if (!ad || !["pendente_arte", "em_revisao"].includes(ad.status)) {
    return (
      <div className="mx-auto mt-16 max-w-xl text-center">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          {t("invalidTitle")}
        </h1>
        <p className="mt-3 text-sm text-zinc-500">{t("invalidBody")}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-12 max-w-xl">
      <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
        {t("title")}
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-zinc-500">{t("body")}</p>
      <div className="mt-8">
        <ArtForm token={ad.token} />
      </div>
    </div>
  );
}
