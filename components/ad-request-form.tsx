"use client";

import { useEffect, useState } from "react";
import { adPlans } from "@/content/site";
import type { Locale } from "@/i18n/routing";
import { addAdRequest } from "@/lib/anuncie/requests";

const copy = {
  pt: {
    plan: "Plano de interesse",
    name: "Seu nome / empresa",
    contact: "Contato (e-mail ou WhatsApp)",
    url: "Link do que você quer anunciar (opcional)",
    message: "Mensagem (opcional)",
    submit: "Enviar pedido",
    sending: "Enviando…",
    success: "Pedido enviado! A Mariane vai entrar em contato para combinar o pagamento e publicar o anúncio.",
    fill: "Preencha nome e contato.",
  },
  en: {
    plan: "Plan of interest",
    name: "Your name / company",
    contact: "Contact (email or WhatsApp)",
    url: "Link to what you want to advertise (optional)",
    message: "Message (optional)",
    submit: "Send request",
    sending: "Sending…",
    success: "Request sent! Mariane will get in touch to arrange payment and publish your ad.",
    fill: "Please fill in name and contact.",
  },
};

export function AdRequestForm({ locale }: { locale: Locale }) {
  const t = copy[locale];

  const [plan, setPlan] = useState(adPlans[1]?.id ?? adPlans[0]?.id ?? "");

  // Pré-seleciona o plano vindo da URL (?plano=), sem useSearchParams (que
  // prendia o form num Suspense pendente).
  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get("plano");
    if (p && adPlans.some((pl) => pl.id === p)) setPlan(p);
  }, []);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [adUrl, setAdUrl] = useState("");
  const [message, setMessage] = useState("");
  const [trap, setTrap] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (trap) return; // bot
    if (!name.trim() || !contact.trim()) {
      setErr(t.fill);
      return;
    }
    setSending(true);
    const { error } = await addAdRequest({
      plan,
      name,
      contact,
      ad_url: adUrl,
      message,
    });
    setSending(false);
    if (error) {
      setErr(`Erro: ${error}`);
      return;
    }
    setDone(true);
  }

  const input =
    "mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 outline-none focus:border-emerald-500";
  const label = "block text-xs font-medium text-zinc-600";

  if (done) {
    return (
      <div className="rounded-2xl border border-emerald-600/20 bg-emerald-50 p-6 text-center">
        <p className="text-sm font-medium text-emerald-900">{t.success}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-3 rounded-2xl border border-zinc-200 bg-white p-5"
    >
      <label className="block">
        <span className={label}>{t.plan}</span>
        <select value={plan} onChange={(e) => setPlan(e.target.value)} className={input}>
          {adPlans.map((p) => (
            <option key={p.id} value={p.id}>
              {p.duration[locale]} — R$ {p.price}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className={label}>{t.name}</span>
        <input value={name} onChange={(e) => setName(e.target.value)} required maxLength={120} className={input} />
      </label>
      <label className="block">
        <span className={label}>{t.contact}</span>
        <input value={contact} onChange={(e) => setContact(e.target.value)} required maxLength={200} className={input} />
      </label>
      <label className="block">
        <span className={label}>{t.url}</span>
        <input value={adUrl} onChange={(e) => setAdUrl(e.target.value)} maxLength={500} className={input} />
      </label>
      <label className="block">
        <span className={label}>{t.message}</span>
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3} maxLength={2000} className={input} />
      </label>
      {/* honeypot */}
      <input
        value={trap}
        onChange={(e) => setTrap(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="hidden"
      />
      <div className="flex items-center gap-3 pt-1">
        <button
          type="submit"
          disabled={sending}
          className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 active:scale-[0.97] disabled:opacity-50"
        >
          {sending ? t.sending : t.submit}
        </button>
        {err && <span className="text-sm text-red-600">{err}</span>}
      </div>
    </form>
  );
}
