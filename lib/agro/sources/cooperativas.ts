import { favicon, googleNews, type Source } from "./helpers"

// Cooperativas — concentram grande parte da produção agro. Só a Castrolanda
// publica RSS aberto; as demais entram pelo Google News por nome (a imprensa
// cobre bastante os investimentos e safras delas). priority 2/3.
export const cooperativas: Source[] = [
    {
        name: "Castrolanda",
        url: "https://www.castrolanda.coop.br/feed/",
        category: "Agronegócio",
        language: "pt-BR",
        logo: favicon("castrolanda.coop.br"),
        uf: "PR",
        priority: 2,
    },
    {
        name: "Coamo",
        url: googleNews('"Coamo"'),
        category: "Agronegócio",
        language: "pt-BR",
        logo: favicon("coamo.com.br"),
        uf: "PR",
        priority: 2,
    },
    {
        name: "C.Vale",
        url: googleNews('"C.Vale" cooperativa'),
        category: "Agronegócio",
        language: "pt-BR",
        logo: favicon("cvale.com.br"),
        uf: "PR",
        priority: 3,
    },
    {
        name: "Cocamar",
        url: googleNews('"Cocamar"'),
        category: "Agronegócio",
        language: "pt-BR",
        logo: favicon("cocamar.com.br"),
        uf: "PR",
        priority: 3,
    },
    {
        name: "Aurora Coop",
        url: googleNews('"Aurora Coop"'),
        category: "Pecuária",
        language: "pt-BR",
        logo: favicon("aurora.coop.br"),
        uf: null,
        priority: 3,
    },
]
