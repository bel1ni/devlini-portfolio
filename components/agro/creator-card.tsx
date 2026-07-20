import Link from "next/link";
import { profile, socialLinks, withUtm } from "@/content/site";
import { Icon } from "@/components/icons";

// A área "sobre mim" que vive entre as notícias da seção /agro:
// apresenta quem faz o portal e cruza tráfego com o hub e o controledegado.app.
export default function CreatorCard() {
  return (
    <section className="mt-12">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
        Quem faz o BELAGRO
      </h2>

      <div className="mt-3 rounded-xl border border-zinc-200 bg-white p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/devlini-badge.png"
            alt="DEVLINI"
            width={72}
            height={72}
            className="size-18 shrink-0 rounded-2xl border border-zinc-200 bg-white object-contain p-2"
          />

          <div className="min-w-0">
            <p className="text-base font-semibold text-zinc-900">
              {profile.name}
            </p>
            <p className="mt-0.5 text-sm font-medium text-emerald-700">
              {profile.headline.pt}
            </p>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-500">
              {profile.bio.pt} Este portal de notícias é um dos meus projetos —
              conheça os outros no meu site.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href="/"
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 active:scale-[0.97]"
              >
                Ver meu portfólio
              </Link>

              <a
                href={withUtm("https://controledegado.app", "agro-creator-card")}
                target="_blank"
                rel="noopener"
                className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:border-zinc-300 hover:shadow-sm active:scale-[0.97]"
              >
                controledegado.app →
              </a>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {socialLinks.map((s) => (
                <a
                  key={s.id}
                  href={withUtm(s.url, s.id)}
                  target="_blank"
                  rel="noopener"
                  aria-label={s.label}
                  className="flex size-9 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-500 transition hover:border-zinc-300 hover:text-zinc-900 active:scale-95"
                >
                  <Icon name={s.icon} className="size-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
