"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex items-center gap-1 rounded-full border border-zinc-200 bg-white p-0.5 text-xs font-medium">
      {routing.locales.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => router.replace(pathname, { locale: l })}
          aria-pressed={l === locale}
          className={
            l === locale
              ? "rounded-full bg-zinc-900 px-2.5 py-1 text-white transition active:scale-95"
              : "rounded-full px-2.5 py-1 text-zinc-500 transition hover:text-zinc-900 active:scale-95"
          }
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
