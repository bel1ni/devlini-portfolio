import { favicon, googleNews, type Source } from "./helpers"

// Clima e meteorologia
export const clima: Source[] = [
    {
        name: "Metsul",
        url: "https://metsul.com/feed/",
        category: "Clima",
        language: "pt-BR",
        logo: favicon("metsul.com"),
        uf: null,
    },
    {
        name: "INMET",
        url: googleNews("site:inmet.gov.br when:45d"),
        category: "Clima",
        language: "pt-BR",
        logo: favicon("inmet.gov.br"),
        uf: null,
    },
]

// Sem feed utilizável: Climatempo, CPTEC/INPE. NOAA fica para a fase
// internacional (inglês, precisa curadoria).
