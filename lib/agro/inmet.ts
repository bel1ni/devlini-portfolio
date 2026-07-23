// Avisos meteorológicos oficiais do INMET (alertas.inmet.gov.br). Substituem a
// detecção de clima por palavra-chave nas notícias: são avisos oficiais,
// geolocalizados por estado, com severidade e janela de validade. Só clima —
// sanidade e crédito seguem derivados das notícias.

const INMET_URL = "https://apiprevmet3.inmet.gov.br/avisos/ativos"

// Nome do estado como o INMET devolve no campo "estados" → sigla UF.
const UF_BY_STATE_NAME: Record<string, string> = {
	"Acre": "AC",
	"Alagoas": "AL",
	"Amapá": "AP",
	"Amazonas": "AM",
	"Bahia": "BA",
	"Ceará": "CE",
	"Distrito Federal": "DF",
	"Espírito Santo": "ES",
	"Goiás": "GO",
	"Maranhão": "MA",
	"Mato Grosso": "MT",
	"Mato Grosso do Sul": "MS",
	"Minas Gerais": "MG",
	"Pará": "PA",
	"Paraíba": "PB",
	"Paraná": "PR",
	"Pernambuco": "PE",
	"Piauí": "PI",
	"Rio de Janeiro": "RJ",
	"Rio Grande do Norte": "RN",
	"Rio Grande do Sul": "RS",
	"Rondônia": "RO",
	"Roraima": "RR",
	"Santa Catarina": "SC",
	"São Paulo": "SP",
	"Sergipe": "SE",
	"Tocantins": "TO",
}

export type InmetSeverity = "potencial" | "perigo" | "grande"

// Aviso já normalizado para o BELAGRO (serializável, vai do server ao client).
export type InmetAlert = {
	id: number
	ufs: string[]
	event: string
	severity: InmetSeverity
	// Frase de risco resumida (campo "riscos" do INMET)
	risks: string
	// Janela amigável, ex.: "hoje, 12:00 → 18:00"
	window: string
}

// Formato cru relevante do aviso do INMET (só os campos que usamos).
type RawInmetAviso = {
	id: number
	descricao?: string
	severidade?: string
	estados?: string
	riscos?: string
	inicio?: string
	fim?: string
	data_inicio?: string
}

const SEVERITY_BY_NAME: Record<string, InmetSeverity> = {
	"Perigo Potencial": "potencial",
	"Perigo": "perigo",
	"Grande Perigo": "grande",
}

export const SEVERITY_ORDER: Record<InmetSeverity, number> = {
	grande: 1,
	perigo: 2,
	potencial: 3,
}

function parseUfs(estados?: string): string[] {
	if (!estados) return []

	return estados
		.split(",")
		.map((name) => UF_BY_STATE_NAME[name.trim()])
		.filter((uf): uf is string => Boolean(uf))
}

// "2026-07-23 12:00" (data + hora locais do aviso) → "hoje, 12:00" quando é
// hoje, senão "23/07, 12:00". Só a hora inicial + a final para não poluir.
function friendlyWindow(inicio?: string, fim?: string): string {
	const start = inicio?.split(" ") ?? []
	const end = fim?.split(" ") ?? []

	const startTime = start[1] ?? ""
	const endTime = end[1] ?? ""

	const today = new Date().toISOString().slice(0, 10)
	const startDay = (start[0] ?? "").trim()

	const dayLabel =
		startDay === today
			? "hoje"
			: startDay.split("-").reverse().slice(0, 2).join("/")

	if (startTime && endTime) return `${dayLabel}, ${startTime} → ${endTime}`
	if (startTime) return `${dayLabel}, a partir de ${startTime}`
	return dayLabel
}

function normalize(aviso: RawInmetAviso): InmetAlert | null {
	const severity = SEVERITY_BY_NAME[aviso.severidade ?? ""]
	const ufs = parseUfs(aviso.estados)

	if (!severity || ufs.length === 0 || !aviso.descricao) return null

	return {
		id: aviso.id,
		ufs,
		event: aviso.descricao,
		severity,
		risks: (aviso.riscos ?? "").trim(),
		window: friendlyWindow(aviso.inicio, aviso.fim),
	}
}

// Busca os avisos ativos do INMET. Cache de 1h (a API tem rate limit e os
// avisos mudam em escala de horas). Qualquer falha devolve [] — o feed nunca
// depende disto para renderizar.
export async function getInmetAlerts(): Promise<InmetAlert[]> {
	try {
		const response = await fetch(INMET_URL, {
			headers: {
				"User-Agent":
					"Mozilla/5.0 (compatible; BELAGRO/1.0; +https://devlini.com/agro)",
				Accept: "application/json",
			},
			next: { revalidate: 3600 },
			signal: AbortSignal.timeout(8000),
		})

		if (!response.ok) {
			console.warn(`[INMET] resposta não-ok: ${response.status}`)
			return []
		}

		const text = await response.text()

		// A API às vezes responde 200 com "Você atingiu o limite de requisições".
		if (!text.trim().startsWith("{")) {
			console.warn(`[INMET] corpo inesperado: ${text.slice(0, 60)}`)
			return []
		}

		const data = JSON.parse(text) as {
			hoje?: RawInmetAviso[]
			futuro?: RawInmetAviso[]
		}

		const avisos = [...(data.hoje ?? []), ...(data.futuro ?? [])]

		return avisos
			.map(normalize)
			.filter((alert): alert is InmetAlert => alert !== null)
			.sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity])
	} catch (error) {
		console.warn("Não foi possível buscar avisos do INMET:", error)
		return []
	}
}

// Avisos que valem para uma UF, já ordenados por severidade.
export function inmetAlertsForUf(alerts: InmetAlert[], uf: string): InmetAlert[] {
	return alerts.filter((alert) => alert.ufs.includes(uf))
}
