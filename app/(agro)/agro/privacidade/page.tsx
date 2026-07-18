import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description:
    "Como o devlini.com e a seção DEVLINI Agro coletam e usam informações durante a navegação.",
  alternates: {
    canonical: "/agro/privacidade",
  },
};

export default function PrivacidadePage() {
  return (
    <div className="mx-auto max-w-3xl py-8">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
        Privacidade
      </h2>

      <h1 className="mt-3 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
        Política de Privacidade
      </h1>

      <p className="mt-5 text-base leading-7 text-zinc-600">
        O devlini.com — incluindo a seção de notícias DEVLINI Agro — é um
        projeto independente criado por Mariane Belini. Esta política explica
        como informações podem ser coletadas e usadas durante a navegação no
        site.
      </p>

      <h2 className="mt-8 text-lg font-semibold text-zinc-900">
        Informações coletadas
      </h2>

      <p className="mt-3 text-base leading-7 text-zinc-600">
        Podemos coletar dados básicos de uso, informações de login via Google
        quando o usuário optar por entrar, notícias salvas e dados técnicos
        necessários para o funcionamento da plataforma.
      </p>

      <h2 className="mt-8 text-lg font-semibold text-zinc-900">
        Localização e clima
      </h2>

      <p className="mt-3 text-base leading-7 text-zinc-600">
        A seção Agro pode solicitar acesso à localização aproximada do
        navegador para exibir clima e horário local. Essa permissão é opcional
        e pode ser negada pelo usuário.
      </p>

      <h2 className="mt-8 text-lg font-semibold text-zinc-900">
        Conteúdo de terceiros
      </h2>

      <p className="mt-3 text-base leading-7 text-zinc-600">
        O DEVLINI Agro organiza notícias de fontes externas por meio de RSS,
        exibindo resumos, categorias e links para os conteúdos originais.
      </p>

      <h2 className="mt-8 text-lg font-semibold text-zinc-900">
        Cookies e publicidade
      </h2>

      <p className="mt-3 text-base leading-7 text-zinc-600">
        O site pode exibir anúncios por meio do Google AdSense. O Google e seus
        parceiros utilizam cookies e tecnologias semelhantes para exibir
        anúncios com base em visitas anteriores a este e a outros sites. O
        cookie DART, por exemplo, permite a veiculação de anúncios
        personalizados.
      </p>

      <p className="mt-3 text-base leading-7 text-zinc-600">
        Você pode desativar a publicidade personalizada acessando as{" "}
        <a
          href="https://adssettings.google.com"
          target="_blank"
          rel="noreferrer"
          className="font-medium text-emerald-700 underline underline-offset-2 hover:text-emerald-600"
        >
          Configurações de anúncios do Google
        </a>
        . Também usamos cookies e armazenamento local para funcionalidades do
        site, como login, notícias salvas e preferências de leitura, além de
        ferramentas de análise de audiência para entender como o site é
        utilizado.
      </p>

      <h2 className="mt-8 text-lg font-semibold text-zinc-900">
        Seus direitos (LGPD)
      </h2>

      <p className="mt-3 text-base leading-7 text-zinc-600">
        Nos termos da Lei Geral de Proteção de Dados (Lei nº 13.709/2018), você
        pode solicitar acesso, correção ou exclusão dos seus dados pessoais a
        qualquer momento. Para exercer esses direitos ou tirar dúvidas sobre
        esta política, entre em contato pela nossa{" "}
        <Link
          href="/agro/contato"
          className="font-medium text-emerald-700 underline underline-offset-2 hover:text-emerald-600"
        >
          página de contato
        </Link>
        .
      </p>

      <p className="mt-8 text-sm text-zinc-400">
        Última atualização: julho de 2026.
      </p>
    </div>
  );
}
