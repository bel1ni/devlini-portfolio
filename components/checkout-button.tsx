"use client";

import { useState } from "react";
import { track } from "@vercel/analytics";

export function CheckoutButton({
  plan,
  label,
  featured,
}: {
  plan: string;
  label: string;
  featured: boolean;
}) {
  const [loading, setLoading] = useState(false);

  async function checkout() {
    setLoading(true);
    track("ad_plan_click", { plan });
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });
    const data = (await res.json().catch(() => null)) as {
      url?: string;
    } | null;
    if (data?.url) {
      window.location.href = data.url;
    } else {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={checkout}
      disabled={loading}
      className={
        featured
          ? "mt-5 rounded-lg bg-emerald-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-emerald-700 active:scale-[0.97] disabled:opacity-50"
          : "mt-5 rounded-lg border border-zinc-300 px-4 py-2.5 text-center text-sm font-semibold text-zinc-700 transition hover:border-zinc-400 active:scale-[0.97] disabled:opacity-50"
      }
    >
      {loading ? "…" : label}
    </button>
  );
}
