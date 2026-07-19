// Logos: o logo.clearbit.com foi desligado em 2025/2026 — os favicons agora
// vêm do serviço público do Google, que funciona para qualquer domínio.
function favicon(domain: string) {
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`
}

// Feeds do Google News para sites sem RSS próprio; `when:45d` já descarta
// páginas antigas/institucionais indexadas (há também um filtro de data
// de segurança em rss.ts).
function googleNews(query: string) {
    return `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=pt-BR&gl=BR&ceid=BR:pt-419`
}

export type Source = {
    name: string
    url: string
    category: string
    language: string
    logo: string
    // UF da fonte (ex.: "PR" para ADAPAR); null = cobertura nacional
    uf: string | null
}

export const sources: Source[] = [
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
    name: "Compre Rural",
    url: "https://www.comprerural.com/feed/",
    category: "Pecuária",
    language: "pt-BR",
    logo: favicon("comprerural.com"),
    uf: null,
},

{
    name: "BeefPoint",
    url: "https://www.beefpoint.com.br/feed/",
    category: "Pecuária",
    language: "pt-BR",
    logo: favicon("beefpoint.com.br"),
    uf: null,
},

// Portal DBO ficou de fora: o feed devolve 403 para requisições
// fora de navegador (bloqueio anti-bot), mesmo com User-Agent de browser.

{
    name: "Money Times Agro",
    url: "https://www.moneytimes.com.br/tag/agronegocio/feed/",
    category: "Mercado",
    language: "pt-BR",
    logo: favicon("moneytimes.com.br"),
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
    name: "Forbes Agro",
    url: "https://forbes.com.br/forbesagro/feed/",
    category: "Mercado",
    language: "pt-BR",
    logo: favicon("forbes.com.br"),
    uf: null,
},

// A Embrapa e o Ministério da Agricultura não publicam RSS próprio;
// o Google News RSS restrito ao domínio oficial cobre as duas fontes.
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

// Fontes locais do Paraná — avisos de defesa agropecuária (atualização de
// rebanho, vacinação, documentos) e extensão rural, perto do produtor.
{
    name: "ADAPAR",
    url: googleNews("site:adapar.pr.gov.br/Noticia when:45d"),
    category: "Sanidade",
    language: "pt-BR",
    logo: favicon("adapar.pr.gov.br"),
    uf: "PR",
},

// O site do IDR-Paraná indexa páginas de cadastro com dados pessoais no
// Google News; o "Giro Paraná" cobre IDR/Adapar pela imprensa regional.
{
    name: "Giro Paraná",
    url: googleNews('"IDR-Paraná" OR "Adapar" when:45d'),
    category: "Agronegócio",
    language: "pt-BR",
    logo: favicon("pr.gov.br"),
    uf: "PR",
},
]
