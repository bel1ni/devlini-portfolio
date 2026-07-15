import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Ad, Localized } from "@/content/site";
import { withUtm } from "@/content/site";
import type { Locale } from "@/i18n/routing";
import { TrackLink } from "./track-link";
import { Icon } from "./icons";

function pick(text: Localized, locale: Locale) {
  return text[locale];
}

export async function AdCard({
  ad,
  slot,
  locale,
}: {
  ad: Ad | null;
  slot: number;
  locale: Locale;
}) {
  const t = await getTranslations("ads");

  if (!ad) {
    return (
      <Link
        href="/anuncie"
        className="group flex flex-col justify-between rounded-xl border border-dashed border-zinc-300 bg-zinc-50/50 p-4 transition hover:border-emerald-500 hover:bg-emerald-50/40"
      >
        <div>
          <p className="text-sm font-semibold text-zinc-700 group-hover:text-emerald-700">
            {t("emptyTitle")}
          </p>
          <p className="mt-1 text-xs text-zinc-500">{t("emptyDescription")}</p>
        </div>
        <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
          {t("emptyCta")}
          <Icon name="arrow" className="size-3.5" />
        </span>
      </Link>
    );
  }

  return (
    <TrackLink
      event="ad_click"
      eventData={{ ad: ad.id, slot: String(slot) }}
      href={withUtm(ad.url, `ad-slot-${slot}`)}
      target="_blank"
      rel="sponsored noopener"
      className="group block rounded-xl border border-zinc-200 bg-white p-4 transition hover:border-zinc-300 hover:shadow-sm"
    >
      {ad.imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={ad.imageUrl}
          alt=""
          className="mb-3 h-24 w-full rounded-lg border border-zinc-100 object-cover"
        />
      )}
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold text-zinc-900">{ad.title}</p>
        <span className="shrink-0 rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-zinc-500">
          {t("sponsored")}
        </span>
      </div>
      <p className="mt-1 text-xs leading-relaxed text-zinc-500">
        {pick(ad.description, locale)}
      </p>
    </TrackLink>
  );
}
