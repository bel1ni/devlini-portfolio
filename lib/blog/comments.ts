import { supabase } from "@/lib/agro/supabase/client";

export type Comment = {
  id: string;
  post_slug: string;
  author_name: string;
  body: string;
  created_at: string;
};

export async function getComments(slug: string): Promise<Comment[]> {
  const { data } = await supabase
    .from("post_comments")
    .select("*")
    .eq("post_slug", slug)
    .order("created_at", { ascending: true });
  return (data ?? []) as Comment[];
}

export async function addComment(
  slug: string,
  authorName: string,
  body: string
): Promise<{ error: string | null }> {
  const name = authorName.trim().slice(0, 60);
  const text = body.trim().slice(0, 2000);
  if (!name || !text) return { error: "Preencha nome e comentário." };

  const { error } = await supabase.from("post_comments").insert({
    post_slug: slug,
    author_name: name,
    body: text,
  });
  return { error: error?.message ?? null };
}

// Só funciona para a dona logada (RLS). Usado no botão de apagar que aparece
// apenas quando ela está logada.
export async function deleteComment(id: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from("post_comments").delete().eq("id", id);
  return { error: error?.message ?? null };
}
