import { getSupabaseAdmin } from "./admin"

export type Subscriber = {
    email: string
    token: string
}

export async function addSubscriber(email: string) {
    const supabase = getSupabaseAdmin()

    const { error } = await supabase
        .from("agro_subscribers")
        .upsert(
            { email },
            { onConflict: "email", ignoreDuplicates: true }
        )

    if (error) {
        console.error("Erro ao inscrever e-mail:", error.message)
        return false
    }

    return true
}

export async function getSubscribers(): Promise<Subscriber[]> {
    const supabase = getSupabaseAdmin()

    const { data, error } = await supabase
        .from("agro_subscribers")
        .select("email, token")

    if (error) {
        console.error("Erro ao buscar inscritos:", error.message)
        return []
    }

    return data ?? []
}

export async function removeSubscriberByToken(token: string) {
    const supabase = getSupabaseAdmin()

    const { data, error } = await supabase
        .from("agro_subscribers")
        .delete()
        .eq("token", token)
        .select("email")

    if (error) {
        console.error("Erro ao remover inscrito:", error.message)
        return false
    }

    return (data?.length ?? 0) > 0
}
