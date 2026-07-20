import type { RawNews } from "@/types/agro-news"

function improveTitle(title: string) {
return title
    .replace(/\|.*$/g, "")
    .trim()
}

function generateSummary(description: string) {
// ponytail: guarda o resumo real da fonte inteiro; corta só se for
// absurdamente longo (era 120 chars, o que jogava fora quase tudo).
if (description.length <= 600) {
    return description
}

return description.slice(0, 600).trim() + "…"
}

function detectBreaking(news: RawNews) {
const content = `${news.title} ${news.description}`.toLowerCase()

const breakingKeywords = [
    "plano safra",
    "aftosa",
    "gripe aviária",
    "embargo",
    "recorde",
    "bilhões",
    "urgente",
    "alerta",
    "emergência",
    "quebra de safra",
    "geada",
    "el niño",
    "tarifa",
]

return breakingKeywords.some((keyword) => content.includes(keyword))
}

function boostImpact(news: RawNews) {
const keywords = [
    "soja",
    "milho",
    "boi gordo",
    "arroba",
    "exportaç",
    "china",
    "plano safra",
    "embrapa",
    "dólar",
    "frigorífic",
    "safra",
    "carne",
]

let boost = 0

const content = `${news.title} ${news.description}`.toLowerCase()

keywords.forEach((keyword) => {
    if (content.includes(keyword)) {
    boost += 3
    }
})

return Math.min(news.impact + boost, 100)
}

export function processNews(news: RawNews[]) {
return news.map((item) => ({
    ...item,
    title: improveTitle(item.title),
    description: generateSummary(item.description),
    impact: boostImpact(item),
    featured: item.featured || detectBreaking(item),
}))
}
