import { getTrendingTopics } from "@/lib/agro/supabase/get-trending";

export default async function Trending() {
  const trends = await getTrendingTopics();

  if (trends.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
        Em alta agora
      </h2>

      <div className="mt-3 grid gap-3 sm:grid-cols-2 md:grid-cols-4">
        {trends.map((trend, index) => (
          <div
            key={trend.title}
            className="rounded-xl border border-zinc-200 bg-white p-4 transition hover:border-zinc-300 hover:shadow-sm"
          >
            <p className="text-lg font-bold text-emerald-600">
              0{index + 1}
            </p>

            <p className="mt-2 text-sm font-medium leading-snug text-zinc-800">
              {trend.title}
            </p>

            <p className="mt-2 text-xs text-zinc-400">Score: {trend.score}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
