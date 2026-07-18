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

function cleanText(text?: string) {
    if (!text) return "Sem descrição disponível.";

    return text
        .replace(/<[^>]*>/g, "")
        .replace(/\s+/g, " ")
        .trim();
}

function detectCategory(
title: string,
description: string
) {
const content =
    `${title} ${description}`.toLowerCase()

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
        const feeds = await Promise.allSettled(
        sources.map(async (source) => {
        const feed = await parser.parseURL(source.url);

        // Feeds do Google News repetem a fonte no fim do título ("... - www.gov.br")
        const isGoogleNews = source.url.includes("news.google.com");

            return feed.items.slice(0, 6).map((item) => {
            let title = cleanText(item.title);

            if (isGoogleNews) {
                title = title.replace(/\s+-\s+[^-]+$/, "").trim() || title;
            }

            const rawDescription =
            item.contentSnippet || item.summary || item.content || item.contentEncoded || item["content:encoded"] || item.description || "";

            const description = cleanText(rawDescription);
            const category = detectCategory(title, description) ?? source.category;

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
