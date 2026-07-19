// O logo.clearbit.com foi desligado — linhas antigas do banco ainda
// guardam URLs dele. Este helper converte qualquer URL do Clearbit no
// favicon equivalente do serviço do Google, e deixa o resto passar.
export function resolveLogo(logo: string) {
    const clearbitMatch = logo.match(/logo\.clearbit\.com\/([^/?#]+)/)

    if (clearbitMatch) {
        return `https://www.google.com/s2/favicons?domain=${clearbitMatch[1]}&sz=128`
    }

    return logo
}
