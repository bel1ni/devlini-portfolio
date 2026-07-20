import { favicon, googleNews, type Source } from "./helpers"

// Governo federal e pesquisa oficial — nenhum publica RSS próprio;
// o Google News restrito ao domínio oficial cobre todos.
export const governo: Source[] = [
    {
        name: "Embrapa",
        url: googleNews("site:embrapa.br when:45d"),
        category: "Agricultura",
        language: "pt-BR",
        logo: favicon("embrapa.br"),
        uf: null,
    },
    {
        name: "Ministério da Agricultura",
        url: googleNews("site:gov.br/agricultura when:45d"),
        category: "Política Agro",
        language: "pt-BR",
        logo: favicon("gov.br"),
        uf: null,
    },
    {
        name: "CONAB",
        url: googleNews("site:conab.gov.br when:45d"),
        category: "Mercado",
        language: "pt-BR",
        logo: favicon("conab.gov.br"),
        uf: null,
    },
]

// Roadmap: Banco Central (crédito rural), Receita e Diário Oficial exigem
// filtros específicos por assunto para não inundar o feed — ver
// DEVLINI/Roadmap AGROLINI no Obsidian (fase de alertas).
