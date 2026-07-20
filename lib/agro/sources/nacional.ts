import { favicon, type Source } from "./helpers"

// Portais nacionais de notícias do agro (RSS direto, verificados 07/2026)
export const nacional: Source[] = [
    {
        name: "Canal Rural",
        url: "https://www.canalrural.com.br/feed/",
        category: "Agronegócio",
        language: "pt-BR",
        logo: favicon("canalrural.com.br"),
        uf: null,
    },
    {
        name: "Globo Rural",
        url: "https://globorural.globo.com/rss/globorural/",
        category: "Agronegócio",
        language: "pt-BR",
        logo: favicon("globorural.globo.com"),
        uf: null,
    },
    {
        name: "G1 Agronegócio",
        url: "https://g1.globo.com/rss/g1/economia/agronegocio/",
        category: "Mercado",
        language: "pt-BR",
        logo: favicon("g1.globo.com"),
        uf: null,
    },
    {
        name: "AgFeed",
        url: "https://agfeed.com.br/feed/",
        category: "Agronegócio",
        language: "pt-BR",
        logo: favicon("agfeed.com.br"),
        uf: null,
    },
    {
        name: "Farmnews",
        url: "https://www.farmnews.com.br/feed/",
        category: "Agronegócio",
        language: "pt-BR",
        logo: favicon("farmnews.com.br"),
        uf: null,
        priority: 2,
    },
    {
        name: "Pensar Agro",
        url: "https://pensaragro.com.br/feed/",
        category: "Agronegócio",
        language: "pt-BR",
        logo: favicon("pensaragro.com.br"),
        uf: null,
        priority: 2,
    },
]

// Sem feed utilizável (testados 07/2026): Agro em Campo (WP sem feed),
// Agrolink (403 anti-bot), Notícias Agrícolas, Agrofy, Portal do
// Agronegócio, Portal DBO (403 anti-bot).
