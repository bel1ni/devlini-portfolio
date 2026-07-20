import { favicon, type Source } from "./helpers"

// Pecuária
export const pecuaria: Source[] = [
    {
        name: "BeefPoint",
        url: "https://www.beefpoint.com.br/feed/",
        category: "Pecuária",
        language: "pt-BR",
        logo: favicon("beefpoint.com.br"),
        uf: null,
    },
    {
        name: "Compre Rural",
        url: "https://www.comprerural.com/feed/",
        category: "Pecuária",
        language: "pt-BR",
        logo: favicon("comprerural.com"),
        uf: null,
    },
]

// Sem feed utilizável: MilkPoint, Scot Consultoria, Portal DBO (403).
