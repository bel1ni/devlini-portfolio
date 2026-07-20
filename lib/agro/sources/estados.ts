import { favicon, googleNews, type Source } from "./helpers"

// Fontes estaduais — agências de defesa agropecuária (avisos de vacinação,
// atualização de rebanho, prazos de documentos) e extensão rural.
// Nenhuma publica RSS próprio, exceto a EPAGRI; as demais entram pelo
// Google News restrito ao domínio oficial. Volume baixo por fonte
// (1–5 itens/45 dias), por isso priority 2.
export const estados: Source[] = [
    // Paraná
    {
        name: "ADAPAR",
        url: googleNews("site:adapar.pr.gov.br/Noticia when:45d"),
        category: "Sanidade",
        language: "pt-BR",
        logo: favicon("adapar.pr.gov.br"),
        uf: "PR",
    },
    {
        name: "Giro Paraná",
        url: googleNews('"IDR-Paraná" OR "Adapar" when:45d'),
        category: "Agronegócio",
        language: "pt-BR",
        logo: favicon("pr.gov.br"),
        uf: "PR",
    },

    // Santa Catarina
    {
        name: "EPAGRI",
        url: "https://www.epagri.sc.gov.br/feed/",
        category: "Agricultura",
        language: "pt-BR",
        logo: favicon("epagri.sc.gov.br"),
        uf: "SC",
        priority: 2,
    },
    {
        name: "CIDASC",
        url: googleNews("site:cidasc.sc.gov.br when:45d"),
        category: "Sanidade",
        language: "pt-BR",
        logo: favicon("cidasc.sc.gov.br"),
        uf: "SC",
        priority: 2,
    },

    // Mato Grosso
    {
        name: "INDEA-MT",
        url: googleNews("site:indea.mt.gov.br when:45d"),
        category: "Sanidade",
        language: "pt-BR",
        logo: favicon("mt.gov.br"),
        uf: "MT",
        priority: 2,
    },

    // Mato Grosso do Sul
    {
        name: "IAGRO-MS",
        url: googleNews("site:iagro.ms.gov.br when:45d"),
        category: "Sanidade",
        language: "pt-BR",
        logo: favicon("ms.gov.br"),
        uf: "MS",
        priority: 2,
    },

    // Goiás
    {
        name: "Agrodefesa-GO",
        url: googleNews("site:agrodefesa.go.gov.br when:45d"),
        category: "Sanidade",
        language: "pt-BR",
        logo: favicon("go.gov.br"),
        uf: "GO",
        priority: 2,
    },

    // Pará
    {
        name: "Adepará",
        url: googleNews("site:adepara.pa.gov.br when:45d"),
        category: "Sanidade",
        language: "pt-BR",
        logo: favicon("pa.gov.br"),
        uf: "PA",
        priority: 2,
    },
]

// NUNCA usar site:idrparana.pr.gov.br: o Google indexa páginas de
// cadastro com dados pessoais nesse domínio (incidente de 19/07/2026).
// Próximas ondas (testar antes de adicionar): RS (Emater/Fundesa),
// MG (IMA/Emater-MG), SP (Defesa Agropecuária/CATI), BA (ADAB) e as
// federações (FAEP, Famato, Faeg...) — a maioria também só via Google News.
