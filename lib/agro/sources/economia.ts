import { favicon, type Source } from "./helpers"

// Economia e mercado (feeds com recorte agro)
export const economia: Source[] = [
    {
        name: "Money Times Agro",
        url: "https://www.moneytimes.com.br/tag/agronegocio/feed/",
        category: "Mercado",
        language: "pt-BR",
        logo: favicon("moneytimes.com.br"),
        uf: null,
    },
    {
        name: "Forbes Agro",
        url: "https://forbes.com.br/forbesagro/feed/",
        category: "Mercado",
        language: "pt-BR",
        logo: favicon("forbes.com.br"),
        uf: null,
    },
]

// Sem feed utilizável: InfoMoney (tag agro sem feed), Valor (paywall),
// Reuters Brasil (RSS descontinuado), CNN Brasil (sem feed por tema).
