import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contato",
  description:
    "Entre em contato com o BELAGRO para dúvidas, sugestões, parcerias ou remoção de conteúdo.",
  alternates: {
    canonical: "/agro/contato",
  },
};

export default function ContatoPage() {
  return (
    <div className="mx-auto max-w-3xl py-8">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
        Contato
      </h2>

      <h1 className="mt-3 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
        Fale com o BELAGRO
      </h1>

      <p className="mt-5 text-base leading-7 text-zinc-600">
        Tem alguma dúvida, sugestão de pauta, proposta de parceria ou pedido
        relacionado a conteúdo? Fale com a gente pelos canais abaixo.
      </p>

      <h2 className="mt-8 text-lg font-semibold text-zinc-900">E-mail</h2>

      <p className="mt-3 text-base leading-7 text-zinc-600">
        <a
          href="mailto:devlinibr@gmail.com"
          className="font-medium text-emerald-700 underline underline-offset-2 hover:text-emerald-600"
        >
          devlinibr@gmail.com
        </a>
      </p>

      <h2 className="mt-8 text-lg font-semibold text-zinc-900">
        Redes sociais
      </h2>

      <p className="mt-3 text-base leading-7 text-zinc-600">
        Você também pode acompanhar e falar com a criadora do projeto pelo{" "}
        <a
          href="https://www.instagram.com/devlini_/"
          target="_blank"
          rel="noreferrer"
          className="font-medium text-emerald-700 underline underline-offset-2 hover:text-emerald-600"
        >
          Instagram
        </a>
        ,{" "}
        <a
          href="https://github.com/bel1ni"
          target="_blank"
          rel="noreferrer"
          className="font-medium text-emerald-700 underline underline-offset-2 hover:text-emerald-600"
        >
          GitHub
        </a>{" "}
        ou{" "}
        <a
          href="https://linkedin.com/in/marianebelini"
          target="_blank"
          rel="noreferrer"
          className="font-medium text-emerald-700 underline underline-offset-2 hover:text-emerald-600"
        >
          LinkedIn
        </a>
        .
      </p>

      <h2 className="mt-8 text-lg font-semibold text-zinc-900">
        Fontes e direitos autorais
      </h2>

      <p className="mt-3 text-base leading-7 text-zinc-600">
        O BELAGRO agrega e resume notícias de veículos externos, sempre
        com crédito e link para a matéria original. Se você representa um
        veículo e deseja ajustar ou remover algum conteúdo, escreva para o
        e-mail acima que responderemos o mais rápido possível.
      </p>
    </div>
  );
}
