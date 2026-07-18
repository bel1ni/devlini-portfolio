import { createClient, type SupabaseClient } from "@supabase/supabase-js"

let adminClient: SupabaseClient | null = null

// Client exclusivo de servidor para dados sensíveis (ex.: e-mails de
// inscritos). Usa a service role quando disponível, que ignora RLS —
// nunca importe este módulo em componentes client.
export function getSupabaseAdmin(): SupabaseClient {
    if (adminClient) return adminClient

    const url =
        process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co"
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()

    if (!serviceRoleKey) {
        console.warn(
            "SUPABASE_SERVICE_ROLE_KEY não definida; usando a chave anon (exige políticas RLS na tabela subscribers)."
        )
    }

    adminClient = createClient(
        url,
        serviceRoleKey ||
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
            "placeholder-anon-key",
        {
            auth: {
                persistSession: false,
            },
        }
    )

    return adminClient
}
