import { favicon, googleNews, type Source } from "./helpers"

// Federações estaduais de agricultura (Sistema CNA) — cobrem crédito rural,
// política agrícola e defesa dos produtores. Nenhuma tem RSS próprio; entram
// pelo Google News por nome (a imprensa regional cita muito). priority 2/3
// para não pesar no feed.
export const federacoes: Source[] = [
    {
        name: "Sistema FAEP",
        url: googleNews('"Sistema FAEP"'),
        category: "Política Agro",
        language: "pt-BR",
        logo: favicon("sistemafaep.org.br"),
        uf: "PR",
        priority: 2,
    },
    {
        name: "Famato",
        url: googleNews('"Famato"'),
        category: "Política Agro",
        language: "pt-BR",
        logo: favicon("famato.org.br"),
        uf: "MT",
        priority: 2,
    },
    {
        name: "Faeg",
        url: googleNews('"Faeg" agro'),
        category: "Política Agro",
        language: "pt-BR",
        logo: favicon("faeg.com.br"),
        uf: "GO",
        priority: 3,
    },
    {
        name: "Farsul",
        url: googleNews('"Farsul"'),
        category: "Política Agro",
        language: "pt-BR",
        logo: favicon("farsul.org.br"),
        uf: "RS",
        priority: 2,
    },
    {
        name: "Famasul",
        url: googleNews('"Famasul"'),
        category: "Política Agro",
        language: "pt-BR",
        logo: favicon("famasul.com.br"),
        uf: "MS",
        priority: 2,
    },
    {
        name: "Faemg",
        url: googleNews('"Faemg" agro'),
        category: "Política Agro",
        language: "pt-BR",
        logo: favicon("sistemafaemg.com.br"),
        uf: "MG",
        priority: 3,
    },
]

// Próximas (testar antes): Faesp-SP, Faeb-BA, Faepa-PA, Faec-CE, Faern-RN.
