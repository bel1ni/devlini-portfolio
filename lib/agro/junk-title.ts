// Detecta "notícias" que na verdade são a home/seção de um site (o Google News
// às vezes indexa a página inicial de órgãos, ex.: INDEA-MT → "Mato Grosso -
// Site", que leva a uma tela de login, sem conteúdo real). Usado na ingestão
// (para não entrar) e na leitura (para esconder o que já entrou).
export function isJunkTitle(title: string, source: string): boolean {
    const t = (title ?? "").trim().toLowerCase();

    if (!t) return true;

    // Termina em rótulo de navegação, não em manchete
    if (
        /-\s*(site|portal|home|in[ií]cio|p[áa]gina inicial|not[íi]cias|imprensa|institucional|governo do estado)\s*$/.test(
            t
        )
    ) {
        return true;
    }

    // Título é só o nome da fonte/órgão
    if (t === (source ?? "").trim().toLowerCase()) return true;

    return false;
}
