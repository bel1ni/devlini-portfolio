import { favicon, type Source } from "./helpers"

// Cooperativas — das 10 grandes testadas em 07/2026, só a Castrolanda
// publica RSS aberto (Coamo, C.Vale, Copacol, Cocamar e Frísia não têm
// feed público; reavaliar via Google News numa próxima onda).
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
]
