import { sources } from "./sources"
import Parser from "rss-parser";

// Alguns portais (ex.: Portal DBO) devolvem 403 para o user-agent
// padrão do rss-parser; um UA de navegador evita o bloqueio.
const parser = new Parser({
    headers: {
        "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36",
    },
});

// Feeds do Google News indexam páginas antigas/institucionais; além do
// `when:45d` na query, este corte de segurança descarta o que passar.
const GOOGLE_NEWS_MAX_AGE_DAYS = 45;

function cleanText(text?: string) {
    if (!text) return "Sem descrição disponível.";

    return text
        .replace(/<[^>]*>/g, "")
        .replace(/\s+/g, " ")
        .trim();
}

// Nome do estado no título → UF. Bordas de palavra com suporte a acentos
// evitam falsos positivos (ex.: "Acre" dentro de "acredita").
const UF_BY_STATE_NAME: [RegExp, string][] = [
    // Nomes compostos primeiro, para "Mato Grosso do Sul" não virar MT
    [stateRegex("mato grosso do sul"), "MS"],
    [stateRegex("mato grosso"), "MT"],
    [stateRegex("rio grande do sul"), "RS"],
    [stateRegex("rio grande do norte"), "RN"],
    [stateRegex("minas gerais"), "MG"],
    [stateRegex("são paulo"), "SP"],
    [stateRegex("santa catarina"), "SC"],
    [stateRegex("espírito santo"), "ES"],
    [stateRegex("rio de janeiro"), "RJ"],
    [stateRegex("paraná"), "PR"],
    [stateRegex("goiás"), "GO"],
    [stateRegex("bahia"), "BA"],
    [stateRegex("tocantins"), "TO"],
    [stateRegex("pará"), "PA"],
    [stateRegex("rondônia"), "RO"],
    [stateRegex("roraima"), "RR"],
    [stateRegex("amazonas"), "AM"],
    [stateRegex("amapá"), "AP"],
    [stateRegex("acre"), "AC"],
    [stateRegex("maranhão"), "MA"],
    [stateRegex("piauí"), "PI"],
    [stateRegex("ceará"), "CE"],
    [stateRegex("paraíba"), "PB"],
    [stateRegex("pernambuco"), "PE"],
    [stateRegex("alagoas"), "AL"],
    [stateRegex("sergipe"), "SE"],
    [stateRegex("distrito federal"), "DF"],
];

function stateRegex(name: string) {
    return new RegExp(`(^|[^\\p{L}])${name}([^\\p{L}]|$)`, "iu");
}

function detectUf(title: string) {
    for (const [regex, uf] of UF_BY_STATE_NAME) {
        if (regex.test(title)) return uf;
    }

    return null;
}

function detectCategory(
title: string,
description: string
) {
const content =
    `${title} ${description}`.toLowerCase()

if (
    content.includes("vacinação") ||
    content.includes("defesa agropecuária") ||
    content.includes("defesa sanitária") ||
    content.includes("educação sanitária") ||
    content.includes("vigilância agropecuária") ||
    content.includes("guia de trânsito") ||
    content.includes("atualização de rebanho") ||
    content.includes("declaração de rebanho") ||
    content.includes("cadastro agropecuário") ||
    content.includes("adapar") ||
    content.includes("fiscalização agropecuária")
) {
    return "Sanidade"
}

if (
    content.includes("boi ") ||
    content.includes("boi,") ||
    content.includes("gado") ||
    content.includes("bovin") ||
    content.includes("pecuár") ||
    content.includes("frigorífic") ||
    content.includes("carne") ||
    content.includes("arroba") ||
    content.includes("nelore") ||
    content.includes("angus") ||
    content.includes("confinamento") ||
    content.includes("abate") ||
    content.includes("rebanho") ||
    content.includes("bezerr") ||
    content.includes("vaca") ||
    content.includes("leite") ||
    content.includes("laticín") ||
    content.includes("frango") ||
    content.includes("suín") ||
    content.includes("avicultura") ||
    content.includes("aftosa") ||
    content.includes("gripe aviária")
) {
    return "Pecuária"
}

if (
    content.includes("soja") ||
    content.includes("milho") ||
    content.includes("trigo") ||
    content.includes("café") ||
    content.includes("algodão") ||
    content.includes("cana") ||
    content.includes("arroz") ||
    content.includes("feijão") ||
    content.includes("safra") ||
    content.includes("plantio") ||
    content.includes("colheita") ||
    content.includes("lavoura") ||
    content.includes("grão") ||
    content.includes("fertilizante") ||
    content.includes("defensivo") ||
    content.includes("sement") ||
    content.includes("laranja") ||
    content.includes("citros") ||
    content.includes("hortifruti")
) {
    return "Agricultura"
}

if (
    content.includes("chuva") ||
    content.includes("seca") ||
    content.includes("geada") ||
    content.includes("estiagem") ||
    content.includes("el niño") ||
    content.includes("la niña") ||
    content.includes("previsão do tempo") ||
    content.includes("clima")
) {
    return "Clima"
}

if (
    content.includes("ministério") ||
    content.includes("plano safra") ||
    content.includes("crédito rural") ||
    content.includes("governo") ||
    content.includes("decreto") ||
    content.includes("senado") ||
    content.includes("câmara") ||
    content.includes("congresso") ||
    content.includes("funrural") ||
    content.includes("regulament") ||
    content.includes("fiscalizaç")
) {
    return "Política Agro"
}

if (
    content.includes("exportaç") ||
    content.includes("importaç") ||
    content.includes("preço") ||
    content.includes("cotaç") ||
    content.includes("mercado") ||
    content.includes("dólar") ||
    content.includes("commodit") ||
    content.includes("bolsa") ||
    content.includes("chicago") ||
    content.includes("tarifa") ||
    content.includes("balança comercial")
) {
    return "Mercado"
}

if (
    content.includes("drone") ||
    content.includes("agtech") ||
    content.includes("agricultura de precisão") ||
    content.includes("inteligência artificial") ||
    content.includes("startup") ||
    content.includes("aplicativo") ||
    content.includes("satélite") ||
    content.includes("biotecnolog") ||
    content.includes("tecnologia")
) {
    return "AgTech"
}

if (
    content.includes("sustentab") ||
    content.includes("carbono") ||
    content.includes("desmatamento") ||
    content.includes("ambiental") ||
    content.includes("orgânic") ||
    content.includes("bioinsumo") ||
    content.includes("biogás") ||
    content.includes("energia solar")
) {
    return "Sustentabilidade"
}

return null
}

function calculateImpact(title: string, description: string) {
    const content = `${title} ${description}`.toLowerCase();

    let score = 50;

    const highImpactKeywords = [
        "soja",
        "milho",
        "boi gordo",
        "carne",
        "exportaç",
        "china",
        "plano safra",
        "embrapa",
        "recorde",
        "bilhõ",
        "dólar",
        "tarifa",
        "frigorífic",
        "safra",
        "aftosa",
        "gripe aviária",
        "crédito rural",
        "juros",
        "seca",
        "geada",
        "el niño",
        "prazo",
        "vacinação",
    ];

    highImpactKeywords.forEach((keyword) => {
        if (content.includes(keyword)) {
            score += 5;
        }
    });

    return Math.min(score, 100);
}

export async function getAgroNews() {
    try {
        const maxAgeMs = GOOGLE_NEWS_MAX_AGE_DAYS * 24 * 60 * 60 * 1000;

        const feeds = await Promise.allSettled(
        sources.map(async (source) => {
        const feed = await parser.parseURL(source.url);

        // Feeds do Google News repetem a fonte no fim do título ("... - www.gov.br")
        const isGoogleNews = source.url.includes("news.google.com");

            return feed.items
            .filter((item) => {
                if (!isGoogleNews) return true;

                // Google News mistura páginas antigas; sem data confiável
                // ou fora da janela de recência, descarta.
                if (!item.pubDate) return false;

                const age = Date.now() - new Date(item.pubDate).getTime();
                return Number.isFinite(age) && age >= 0 && age <= maxAgeMs;
            })
            .slice(0, 6)
            .map((item) => {
            let title = cleanText(item.title);

            if (isGoogleNews) {
                title = title.replace(/\s+-\s+[^-]+$/, "").trim() || title;
            }

            const rawDescription =
            item.contentSnippet || item.summary || item.content || item.contentEncoded || item["content:encoded"] || item.description || "";

            const description = cleanText(rawDescription);
            const category = detectCategory(title, description) ?? source.category;
            const uf = source.uf ?? detectUf(title);

            const slug = title
                .toLowerCase()
                .normalize("NFD")
                .replace(/[̀-ͯ]/g, "")
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "")

            return {
                id: slug,
                title,
                description,
                url: item.link ?? "#",
                source: source.name,
                publishedAt: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
                category,
                language: source.language,
                impact: calculateImpact(title, description),
                featured: false,
                logo: source.logo,
                uf,
            };
        });
        })
    );

    return feeds
        .filter((result)=> result.status==="fulfilled")
        .flatMap((result)=>result.value)
        .sort((a,b)=> b.impact - a.impact);
    } catch (error) {
    console.error("Erro ao buscar notícias:", error);
    return [];
    }
}
