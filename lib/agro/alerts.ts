import type { NewsItem } from "@/types/agro-news"

// Alertas acionáveis — o diferencial do BELAGRO. Em vez de mais uma manchete,
// dizemos "isto exige ação". Detecção por palavra-chave sobre título+descrição,
// mesmo padrão já usado em process-news.ts (categoria/impacto/breaking): puro,
// sem IA, sem migração de banco, roda no cliente sobre os campos que já existem.

// Clima saiu daqui: agora vem dos avisos oficiais do INMET (lib/agro/inmet.ts),
// geolocalizados e sem o ruído de casar palavra em manchete. Sanidade e crédito
// seguem derivados das notícias — o INMET não cobre esses temas.
export type AlertKind = "sanidade" | "credito"

export type AlertInfo = {
	kind: AlertKind
	// Rótulo curto para o selo/faixa (ex.: "📋 Alerta sanitário")
	label: string
	emoji: string
	// Prioridade de exibição: prazo sanitário vem antes de crédito
	priority: number
	// Classes de cor (tema claro do BELAGRO)
	badgeCls: string
}

// Dias a partir de hoje em que um alerta ainda é relevante. Sanidade/crédito
// têm prazo mais longo que uma notícia comum.
const ALERT_MAX_AGE_DAYS: Record<AlertKind, number> = {
	sanidade: 21,
	credito: 30,
}

const SANIDADE_KEYWORDS = [
	// Vacinação / campanhas sanitárias (nunca "prazo" solto: "curto/longo prazo"
	// é linguagem financeira e casava com notícia de crédito por engano)
	"vacina",
	"vacinação",
	"vacinacao",
	"campanha de vacina",
	// "obrigatóri" solto casava com "mistura obrigatória" (biodiesel), "uso
	// obrigatório" etc. — só compostos ligados a sanidade/cadastro de rebanho
	"vacinação obrigatória",
	"atualização obrigatória",
	"atualizacao obrigatoria",
	"declaração obrigatória",
	"declaracao obrigatoria",
	// Doenças de notificação
	"aftosa",
	"brucelose",
	"tuberculose",
	"gripe aviária",
	"gripe aviaria",
	"influenza aviária",
	"influenza aviaria",
	"febre suína",
	"febre suina",
	// Documentação de rebanho
	"atualização de rebanho",
	"atualizacao de rebanho",
	"declaração de rebanho",
	"declaracao de rebanho",
	"guia de trânsito animal",
	"prazo de vacina",
	"prazo da atualização",
	"prazo para atualização",
]

const CREDITO_KEYWORDS = [
	"linha de crédito",
	"linha de credito",
	"plano safra",
	"pronaf",
	"pronamp",
	"financiamento",
	"juros",
	"crédito rural",
	"credito rural",
	"custeio",
	"subvenção",
	"subvencao",
	"renegociação de dívida",
	"renegociacao de divida",
]

const KIND_META: Record<AlertKind, Omit<AlertInfo, "kind">> = {
	sanidade: {
		label: "Alerta sanitário",
		emoji: "📋",
		priority: 2,
		badgeCls: "bg-amber-50 text-amber-700 ring-amber-600/20",
	},
	credito: {
		label: "Crédito rural",
		emoji: "💸",
		priority: 3,
		badgeCls: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
	},
}

function matches(content: string, keywords: string[]) {
	return keywords.some((keyword) => content.includes(keyword))
}

function isRecent(publishedAt: string, kind: AlertKind) {
	const published = new Date(publishedAt).getTime()

	if (Number.isNaN(published)) return false

	const ageDays = (Date.now() - published) / (1000 * 60 * 60 * 24)

	return ageDays <= ALERT_MAX_AGE_DAYS[kind]
}

// Classifica uma notícia como alerta acionável, ou null se for notícia comum.
// Retorna só o alerta de maior prioridade (sanidade > crédito).
export function detectAlert(item: NewsItem): AlertInfo | null {
	const content = `${item.title} ${item.description}`.toLowerCase()

	const keywordsByKind: Record<AlertKind, string[]> = {
		sanidade: SANIDADE_KEYWORDS,
		credito: CREDITO_KEYWORDS,
	}

	// Ordem = prioridade: prazo sanitário antes de crédito.
	const kinds: AlertKind[] = ["sanidade", "credito"]

	for (const kind of kinds) {
		if (matches(content, keywordsByKind[kind]) && isRecent(item.publishedAt, kind)) {
			return { kind, ...KIND_META[kind] }
		}
	}

	return null
}

export type FeedAlert = { item: NewsItem; alert: AlertInfo }

// Alertas relevantes para a UF do leitor: itens da UF escolhida + itens
// nacionais (uf null), que valem para todo mundo. Ordenados por prioridade
// do alerta e depois por impacto. Usado na faixa de alerta do topo do feed.
export function getAlertsForUf(news: NewsItem[], uf: string): FeedAlert[] {
	return news
		.filter((item) => item.uf === uf || item.uf === null)
		.map((item) => ({ item, alert: detectAlert(item) }))
		.filter((entry): entry is FeedAlert => entry.alert !== null)
		.sort((a, b) => {
			if (a.alert.priority !== b.alert.priority) {
				return a.alert.priority - b.alert.priority
			}

			return b.item.impact - a.item.impact
		})
}
