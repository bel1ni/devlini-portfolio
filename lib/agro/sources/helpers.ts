// Logos: o logo.clearbit.com foi desligado — os favicons vêm do serviço
// público do Google, que funciona para qualquer domínio.
export function favicon(domain: string) {
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`
}

// Feeds do Google News para sites sem RSS próprio; `when:45d` já descarta
// páginas antigas/institucionais indexadas (há também um filtro de data
// de segurança em rss.ts).
export function googleNews(query: string) {
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
    // Quantas notícias por coleta: 1 = 6 itens (padrão), 2 = 4, 3 = 2.
    priority?: 1 | 2 | 3
}
