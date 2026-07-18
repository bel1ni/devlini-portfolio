import { createClient } from "@supabase/supabase-js"

// Sem as envs o client vira um stub apontando para um host inexistente:
// as queries falham em runtime (e todos os get-* já tratam erro devolvendo
// vazio), mas o site NÃO quebra no import — mesma lição do lib/ads-db.ts.
const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co"
const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key"

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.warn(
        "NEXT_PUBLIC_SUPABASE_URL não definida; a seção /agro roda sem banco (feed vazio)."
    )
}

export const supabase = createClient(
supabaseUrl,
supabaseAnonKey
)
