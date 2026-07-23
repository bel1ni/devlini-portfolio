"use client";

import { useState } from "react";
import type { Locale } from "@/i18n/routing";

const copy = {
  pt: {
    initial: "Valor inicial",
    monthly: "Aporte mensal",
    rate: "Juros ao mês (%)",
    years: "Período (anos)",
    total: "Valor final",
    invested: "Total investido",
    interest: "Total em juros",
    currency: "BRL",
    intl: "pt-BR",
  },
  en: {
    initial: "Initial amount",
    monthly: "Monthly contribution",
    rate: "Interest per month (%)",
    years: "Period (years)",
    total: "Final amount",
    invested: "Total invested",
    interest: "Total interest",
    currency: "USD",
    intl: "en-US",
  },
};

export default function CompoundInterest({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const [initial, setInitial] = useState(1000);
  const [monthly, setMonthly] = useState(200);
  const [ratePct, setRatePct] = useState(1);
  const [years, setYears] = useState(10);

  const months = Math.round(years * 12);
  const rate = ratePct / 100;

  // Juros compostos com aporte mensal, capitalização mensal.
  let balance = initial;
  for (let i = 0; i < months; i++) {
    balance = balance * (1 + rate) + monthly;
  }

  const invested = initial + monthly * months;
  const interest = balance - invested;

  const money = (value: number) =>
    new Intl.NumberFormat(t.intl, {
      style: "currency",
      currency: t.currency,
      maximumFractionDigits: 2,
    }).format(Number.isFinite(value) ? value : 0);

  const fields = [
    { label: t.initial, value: initial, set: setInitial, step: 100, min: 0 },
    { label: t.monthly, value: monthly, set: setMonthly, step: 50, min: 0 },
    { label: t.rate, value: ratePct, set: setRatePct, step: 0.1, min: 0 },
    { label: t.years, value: years, set: setYears, step: 1, min: 1 },
  ];

  const results = [
    { label: t.total, value: balance, highlight: true },
    { label: t.invested, value: invested, highlight: false },
    { label: t.interest, value: interest, highlight: false },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 rounded-xl border border-zinc-200 bg-white p-5 sm:grid-cols-2">
        {fields.map((field) => (
          <label key={field.label} className="block">
            <span className="text-sm font-medium text-zinc-700">{field.label}</span>
            <input
              type="number"
              min={field.min}
              step={field.step}
              value={field.value}
              onChange={(e) => field.set(Math.max(field.min, Number(e.target.value) || 0))}
              className="mt-1 block w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 outline-none focus:border-emerald-500"
            />
          </label>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {results.map((result) => (
          <div
            key={result.label}
            className={`rounded-xl border p-4 ${
              result.highlight
                ? "border-emerald-600/30 bg-emerald-50"
                : "border-zinc-200 bg-white"
            }`}
          >
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
              {result.label}
            </p>
            <p
              className={`mt-1 text-lg font-bold tracking-tight ${
                result.highlight ? "text-emerald-700" : "text-zinc-900"
              }`}
            >
              {money(result.value)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
