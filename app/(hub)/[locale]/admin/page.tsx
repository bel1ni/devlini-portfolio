import { connection } from "next/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { listForReview, type DbAd } from "@/lib/ads-db";

export const dynamic = "force-dynamic";

export const metadata = {
  robots: { index: false, follow: false },
};

// Painel da dona (pt-only): aprovação de anúncios em 1 clique (PRD §4.6).
export default async function AdminPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ key?: string; notice?: string }>;
}) {
  await connection(); // renderização por request: a chave vem da query string
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const { key, notice } = await searchParams;
  const secret = process.env.ADMIN_SECRET;

  if (!secret || key !== secret) {
    return (
      <div className="mx-auto mt-16 max-w-md text-center text-sm text-zinc-500">
        Acesso restrito. Use /admin?key=SEU_ADMIN_SECRET.
      </div>
    );
  }

  const ads = await listForReview();
  const pending = ads.filter((a) => a.status === "em_revisao");
  const active = ads.filter((a) => a.status === "ativo");

  function AdRow({ ad, actions }: { ad: DbAd; actions: boolean }) {
    return (
      <div className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4 sm:flex-row sm:items-center">
        {ad.image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={ad.image_url}
            alt=""
            className="size-16 shrink-0 rounded-lg border border-zinc-200 object-cover"
          />
        )}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-zinc-900">
            {ad.title ?? "(sem arte ainda)"}
          </p>
          <p className="truncate text-xs text-zinc-500">{ad.description}</p>
          <p className="mt-1 truncate text-xs text-zinc-400">
            {ad.email} · plano {ad.plan} · {ad.url}
            {ad.status === "ativo" && ad.ends_at && (
              <> · slot {ad.slot} · expira {new Date(ad.ends_at).toLocaleDateString("pt-BR")}</>
            )}
          </p>
        </div>
        {actions && (
          <div className="flex shrink-0 gap-2">
            <form method="POST" action="/api/ads/review">
              <input type="hidden" name="key" value={key} />
              <input type="hidden" name="id" value={ad.id} />
              <input type="hidden" name="action" value="approve" />
              <button className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700">
                Aprovar
              </button>
            </form>
            <form method="POST" action="/api/ads/review">
              <input type="hidden" name="key" value={key} />
              <input type="hidden" name="id" value={ad.id} />
              <input type="hidden" name="action" value="reject" />
              <button className="rounded-lg border border-red-300 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50">
                Rejeitar
              </button>
            </form>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto mt-8 max-w-2xl">
      <h1 className="text-xl font-bold tracking-tight text-zinc-900">
        Anúncios — revisão
      </h1>
      {notice && (
        <p className="mt-2 rounded-lg bg-zinc-100 px-3 py-2 text-xs text-zinc-600">
          Resultado: {notice}
        </p>
      )}

      <h2 className="mt-8 text-xs font-semibold uppercase tracking-widest text-zinc-400">
        Aguardando aprovação ({pending.length})
      </h2>
      <div className="mt-3 flex flex-col gap-3">
        {pending.length === 0 && (
          <p className="text-sm text-zinc-400">Nada na fila. 🎉</p>
        )}
        {pending.map((ad) => (
          <AdRow key={ad.id} ad={ad} actions />
        ))}
      </div>

      <h2 className="mt-10 text-xs font-semibold uppercase tracking-widest text-zinc-400">
        No ar ({active.length}/3)
      </h2>
      <div className="mt-3 flex flex-col gap-3">
        {active.length === 0 && (
          <p className="text-sm text-zinc-400">Nenhum anúncio ativo.</p>
        )}
        {active.map((ad) => (
          <AdRow key={ad.id} ad={ad} actions={false} />
        ))}
      </div>

      <p className="mt-10 text-xs leading-relaxed text-zinc-400">
        Rejeitou um anúncio? Faça o reembolso manualmente no dashboard do
        Stripe (Pagamentos → Reembolsar). A expiração é automática: o card sai
        do ar quando ends_at passa.
      </p>
    </div>
  );
}
