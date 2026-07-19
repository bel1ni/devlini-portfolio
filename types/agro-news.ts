// Notícia como sai do RSS, no idioma original da fonte
export type RawNews = {
    id: string
    title: string
    description: string
    url: string
    source: string
    category: string
    language: string
    impact: number
    featured: boolean
    logo: string
    publishedAt: string
    // UF da notícia: vem da fonte (ex.: ADAPAR = PR) ou é detectada
    // pelo nome do estado no título; null = nacional/indefinido.
    uf: string | null
}

// Notícia bilíngue como é salva na tabela `agro_news` do Supabase
export type StoredNews = {
    id: string
    title_en: string
    title_pt: string
    description_en: string
    description_pt: string
    url: string
    source: string
    category: string
    language: string
    impact: number
    featured: boolean
    logo: string
    published_at: string
    uf?: string | null
    ai_summary_en?: string | null
    ai_summary_pt?: string | null
    created_at?: string | null
    // Colunas do esquema antigo, lidas apenas como fallback até a
    // migração supabase/schema.sql ser aplicada.
    title?: string | null
    description?: string | null
    ai_summary?: string | null
}

// Notícia já localizada para o idioma do leitor, usada pelos componentes
export type NewsItem = {
    id: string
    title: string
    description: string
    url: string
    source: string
    category: string
    language: string
    impact: number
    featured: boolean
    logo: string
    publishedAt: string
    uf: string | null
}
