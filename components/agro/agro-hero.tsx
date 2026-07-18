"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CloudSun } from "lucide-react";
import SearchBox from "./search-box";

export default function AgroHero() {
  const [time, setTime] = useState("");
  const [weather, setWeather] = useState("Localização bloqueada");

  useEffect(() => {
    function updateTime() {
      setTime(
        new Date().toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    }

    updateTime();
    const interval = window.setInterval(updateTime, 30_000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      if (!navigator.geolocation) {
        setWeather("Indisponível");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const response = await fetch(
              `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m`
            );
            const data = await response.json();
            setWeather(`${Math.round(data.current.temperature_2m)}°C agora`);
          } catch {
            setWeather("Clima indisponível");
          }
        },
        () => setWeather("Localização bloqueada")
      );
    }, 0);

    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <section className="mt-4 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
      <div className="max-w-2xl">
        <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
          Pecuária • Agricultura • Mercado • Clima
        </span>

        <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
          O agro do Brasil,{" "}
          <span className="text-emerald-700">resumido todos os dias.</span>
        </h1>

        <p className="mt-3 max-w-xl text-sm leading-relaxed text-zinc-500 sm:text-base">
          Notícias de pecuária, agricultura, mercado, clima e política agrícola
          das principais fontes do país — resumidas por IA para o produtor
          ficar em dia.
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Link
            href="/agro/briefing"
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 active:scale-[0.97]"
          >
            Ler o briefing de hoje
          </Link>

          <Link
            href="/agro#newsletter"
            className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:border-zinc-300 hover:shadow-sm active:scale-[0.97]"
          >
            Receber por e-mail
          </Link>
        </div>

        <div className="mt-5">
          <SearchBox />
        </div>
      </div>

      <div className="w-full max-w-xs rounded-xl border border-zinc-200 bg-white p-5 lg:shrink-0">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
            Agora no campo
          </p>
          <span className="flex size-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
            <CloudSun className="size-4" />
          </span>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-zinc-400">Horário</p>
            <p className="mt-0.5 text-lg font-bold text-zinc-900">
              {time || "--:--"}
            </p>
          </div>
          <div>
            <p className="text-xs text-zinc-400">Clima</p>
            <p className="mt-0.5 text-sm font-semibold leading-tight text-zinc-900">
              {weather}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
