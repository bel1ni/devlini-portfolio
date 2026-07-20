import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sobre",
  description:
    "O que é o BELAGRO: portal de notícias do agronegócio brasileiro com curadoria automatizada e resumos por IA.",
  alternates: {
    canonical: "/agro/sobre",
  },
};

export default function SobrePage() {
  return (
    <div className="mx-auto max-w-3xl py-8">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
        Sobre
      </h2>

      <h1 className="mt-3 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
        Sobre o BELAGRO
      </h1>

      <p className="mt-5 text-base leading-7 text-zinc-600">
        O BELAGRO é a seção de notícias do agronegócio do{" "}
        <Link href="/" className="font-medium text-emerald-700 hover:text-emerald-600">
          devlini.com
        </Link>
        : pecuária, agricultura, mercado, clima, política agrícola e tecnologia
        no campo. Nosso objetivo é organizar as notícias de fontes confiáveis —
        como Canal Rural, Globo Rural, Embrapa e Ministério da Agricultura — em
        uma experiência rápida, clara e moderna.
      </p>

      <p className="mt-5 text-base leading-7 text-zinc-600">
        O projeto utiliza curadoria automatizada, categorização inteligente e
        links para as fontes originais, respeitando o conteúdo dos veículos e
        direcionando os leitores para as matérias completas.
      </p>

      <p className="mt-5 text-base leading-7 text-zinc-600">
        A proposta é ajudar o produtor rural e os profissionais do agronegócio
        a acompanharem o que importa no campo e no mercado em menos tempo —
        direto do celular, todos os dias.
      </p>

      <p className="mt-5 text-base leading-7 text-zinc-600">
        O portal é criado e mantido por Mariane Belini, desenvolvedora
        full-stack e fundadora do controledegado.app.{" "}
        <Link href="/" className="font-medium text-emerald-700 hover:text-emerald-600">
          Conheça o restante do meu trabalho →
        </Link>
      </p>
    </div>
  );
}
