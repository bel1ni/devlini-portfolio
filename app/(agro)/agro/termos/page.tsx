import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termos de Uso",
  description:
    "Termos de uso do devlini.com e da seção de notícias AGROLINI.",
  alternates: {
    canonical: "/agro/termos",
  },
};

export default function TermosPage() {
  return (
    <div className="mx-auto max-w-3xl py-8">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
        Termos
      </h2>

      <h1 className="mt-3 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
        Termos de Uso
      </h1>

      <p className="mt-5 text-base leading-7 text-zinc-600">
        Ao acessar o devlini.com e a seção AGROLINI, você concorda com os
        termos descritos nesta página.
      </p>

      <h2 className="mt-8 text-lg font-semibold text-zinc-900">
        Uso da plataforma
      </h2>

      <p className="mt-3 text-base leading-7 text-zinc-600">
        O AGROLINI fornece conteúdo editorial, resumos de notícias e links
        para fontes externas com finalidade informativa.
      </p>

      <h2 className="mt-8 text-lg font-semibold text-zinc-900">
        Conteúdo de terceiros
      </h2>

      <p className="mt-3 text-base leading-7 text-zinc-600">
        As notícias exibidas no portal pertencem aos seus respectivos autores e
        veículos originais. O AGROLINI atua como agregador e direciona
        usuários para as fontes oficiais.
      </p>

      <h2 className="mt-8 text-lg font-semibold text-zinc-900">
        Responsabilidades
      </h2>

      <p className="mt-3 text-base leading-7 text-zinc-600">
        Embora busquemos organizar informações relevantes e atualizadas, não
        garantimos precisão absoluta, disponibilidade contínua ou ausência de
        erros em conteúdos de terceiros. As informações do portal não
        constituem recomendação de investimento ou de decisões comerciais.
      </p>

      <h2 className="mt-8 text-lg font-semibold text-zinc-900">Modificações</h2>

      <p className="mt-3 text-base leading-7 text-zinc-600">
        Estes termos podem ser alterados futuramente para refletir mudanças na
        plataforma, funcionalidades ou requisitos legais.
      </p>

      <p className="mt-8 text-sm text-zinc-400">Última atualização: 2026.</p>
    </div>
  );
}
