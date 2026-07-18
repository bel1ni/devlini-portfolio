"use client";

import { useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (status === "loading") return;

    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/agro/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setStatus("error");
        setMessage(data?.error || "Não foi possível concluir a inscrição.");
        return;
      }

      setStatus("success");
      setMessage(
        "Inscrição confirmada! Você vai receber o briefing diário no seu e-mail."
      );
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Não foi possível concluir a inscrição. Tente novamente.");
    }
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5">
      <h4 className="text-sm font-semibold text-zinc-900">
        Briefing diário por e-mail
      </h4>

      <p className="mt-1.5 text-xs leading-relaxed text-zinc-500">
        As notícias mais importantes do agro, resumidas por IA, direto na sua
        caixa de entrada.
      </p>

      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="seu@email.com"
          aria-label="Seu e-mail"
          className="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-600 focus:outline-none"
        />

        <button
          type="submit"
          disabled={status === "loading"}
          className="shrink-0 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "loading" ? "Enviando..." : "Assinar"}
        </button>
      </form>

      {message && (
        <p
          className={`mt-3 text-xs ${
            status === "success" ? "text-emerald-700" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
