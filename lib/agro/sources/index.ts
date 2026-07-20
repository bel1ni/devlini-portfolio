import { nacional } from "./nacional"
import { economia } from "./economia"
import { clima } from "./clima"
import { governo } from "./governo"
import { pecuaria } from "./pecuaria"
import { cooperativas } from "./cooperativas"
import { estados } from "./estados"

export type { Source } from "./helpers"

// Todas as coleções de fontes do AGROLINI. Para adicionar uma fonte,
// TESTE o feed antes (curl) e coloque na coleção certa — o restante
// (ingestão, favicon, UF, filtros) funciona sozinho.
export const sources = [
    ...nacional,
    ...economia,
    ...clima,
    ...governo,
    ...pecuaria,
    ...cooperativas,
    ...estados,
]
