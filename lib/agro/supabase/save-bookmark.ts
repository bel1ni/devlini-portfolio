import { supabase } from "./client"

export async function saveBookmark(news: {
id: string | number
title: string
description?: string
image?: string
source?: string
category?: string
url?: string
}) {
const {
    data: { user },
    error: userError,
} = await supabase.auth.getUser()

if (userError || !user) {
    console.error("Usuário não autenticado")
    return null
}

const { data, error } = await supabase
    .from("agro_bookmarks")
    .upsert({
    user_id: user.id,
    news_id: news.id,
    title: news.title,
    description: news.description,
    image: news.image,
    source: news.source,
    category: news.category,
    url: news.url,
    },
    {
        onConflict: "user_id, news_id",
    }
)
.select()
.single()

if (error) {
    console.error("Erro ao salvar bookmark:", error.message)
    return null
}

return data
}

export async function isBookmarked(newsId: string | number) {
const {
    data: { user },
    error: userError,
} = await supabase.auth.getUser()

if (userError || !user) {
    return false
}

const { data, error } = await supabase
    .from("agro_bookmarks")
    .select("id")
    .eq("user_id", user.id)
    .eq("news_id", String(newsId))
    .maybeSingle()

if (error) {
    console.error("Erro ao verificar bookmark:", error.message)
    return false
}

return !!data
}

export async function removeBookmark(newsId: string | number) {
const {
    data: { user },
    error: userError,
} = await supabase.auth.getUser()

if (userError || !user) {
    return false
}

const { error } = await supabase
    .from("agro_bookmarks")
    .delete()
    .eq("user_id", user.id)
    .eq("news_id", String(newsId))

if (error) {
    console.error("Erro ao remover bookmark:", error.message)
    return false
}

return true
}

export async function getBookmarkedIds() {
const {
    data: { user },
    error: userError,
} = await supabase.auth.getUser()

if (userError || !user) {
    return []
}

const { data, error } = await supabase
    .from("agro_bookmarks")
    .select("news_id")
    .eq("user_id", user.id)

if (error) {
    console.error("Erro ao buscar bookmarks:", error.message)
    return []
}

return data.map((item) => String(item.news_id))
}

export async function getUserBookmarks() {
const {
    data: { user },
    error: userError,
} = await supabase.auth.getUser()

if (userError || !user) {
    console.error("Usuário não autenticado")
    return []
}

const { data, error } = await supabase
    .from("agro_bookmarks")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

if (error) {
    console.error("Erro ao buscar bookmarks:", error.message)
    return []
}

return data
}