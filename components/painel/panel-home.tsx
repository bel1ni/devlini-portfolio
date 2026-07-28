"use client";

import { useEffect, useState } from "react";
import { FileText, FolderGit2, UserRound } from "lucide-react";
import { getSession } from "@/lib/agro/supabase/get-session";
import { signInWithGoogle, signOut } from "@/lib/agro/supabase/auth";
import { profile } from "@/content/site";

const ADMIN_EMAIL = profile.personalEmail;

const cards = [
  {
    href: "/sobre/editar",
    title: "Sobre",
    desc: "Seu perfil, disponibilidade, história, skills e aprendizados.",
    icon: UserRound,
  },
  {
    href: "/projetos/editar",
    title: "Projetos",
    desc: "Seus cases: problema, solução, o que você fez e imagens.",
    icon: FolderGit2,
  },
  {
    href: "/blog/editar",
    title: "Blog",
    desc: "Seus posts de aprendendo em público.",
    icon: FileText,
  },
];

export default function PanelHome() {
  const [status, setStatus] = useState<"loading" | "anon" | "unauthorized" | "ready">(
    "loading"
  );
  const [email, setEmail] = useState("");

  useEffect(() => {
    async function init() {
      const session = await getSession();
      if (!session) return setStatus("anon");
      const userEmail = session.user.email ?? "";
      setEmail(userEmail);
      setStatus(userEmail === ADMIN_EMAIL ? "ready" : "unauthorized");
    }
    init();
  }, []);

  if (status === "loading")
    return <p className="py-16 text-center text-sm text-zinc-500">Carregando…</p>;

  if (status === "anon")
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <h1 className="text-xl font-bold text-zinc-900">Painel do seu site</h1>
        <p className="mt-2 text-sm text-zinc-500">
          Entre com sua conta Google para gerenciar seu conteúdo.
        </p>
        <button
          onClick={() => signInWithGoogle("/painel")}
          className="mt-6 rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-zinc-700"
        >
          Entrar com Google
        </button>
      </div>
    );

  if (status === "unauthorized")
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <h1 className="text-xl font-bold text-zinc-900">Acesso restrito</h1>
        <p className="mt-2 text-sm text-zinc-500">
          A conta {email} não pode editar este site.
        </p>
        <button
          onClick={async () => {
            await signOut();
            location.reload();
          }}
          className="mt-6 rounded-lg border border-zinc-200 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-700 hover:border-zinc-300"
        >
          Sair
        </button>
      </div>
    );

  return (
    <div className="mx-auto max-w-2xl py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            Painel do seu site
          </h1>
          <p className="mt-1 text-xs text-zinc-400">Logada como {email}</p>
        </div>
        <button
          onClick={async () => {
            await signOut();
            location.reload();
          }}
          className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600 hover:border-zinc-300"
        >
          Sair
        </button>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {cards.map((card) => (
          <a
            key={card.href}
            href={card.href}
            className="group rounded-2xl border border-zinc-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-sm"
          >
            <card.icon className="size-6 text-emerald-600" />
            <h2 className="mt-3 text-base font-semibold text-zinc-900 transition group-hover:text-emerald-700">
              {card.title}
            </h2>
            <p className="mt-1 text-sm leading-5 text-zinc-500">{card.desc}</p>
          </a>
        ))}
      </div>

      <p className="mt-8 text-center text-xs text-zinc-400">
        Dica: salve <span className="font-medium text-zinc-500">devlini.com/painel</span>{" "}
        nos favoritos para editar seu site quando quiser.
      </p>
    </div>
  );
}
