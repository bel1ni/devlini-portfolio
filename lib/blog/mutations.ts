import { supabase } from "@/lib/agro/supabase/client";
import type { Post } from "./types";

const BUCKET = "project-images";

export async function loadAllPosts(): Promise<Post[]> {
  const { data } = await supabase
    .from("posts")
    .select("*")
    .order("published_at", { ascending: false });
  return (data ?? []) as Post[];
}

export type PostDraft = {
  slug: string;
  title: string;
  excerpt: string | null;
  cover_url: string | null;
  body: string | null;
  published: boolean;
  published_at: string;
};

export async function addPost() {
  const suffix = Math.random().toString(36).slice(2, 7);
  const { error } = await supabase.from("posts").insert({
    slug: `novo-post-${suffix}`,
    title: "Novo post",
    published: false,
  });
  return { error: error?.message ?? null };
}

export async function updatePost(id: string, draft: PostDraft) {
  const { error } = await supabase
    .from("posts")
    .update({ ...draft, updated_at: new Date().toISOString() })
    .eq("id", id);
  return { error: error?.message ?? null };
}

export async function deletePost(id: string) {
  const { error } = await supabase.from("posts").delete().eq("id", id);
  return { error: error?.message ?? null };
}

export async function uploadImage(
  file: File
): Promise<{ url: string | null; error: string | null }> {
  if (!file.type.startsWith("image/")) {
    return { url: null, error: "Selecione um arquivo de imagem." };
  }
  if (file.size > 5 * 1024 * 1024) {
    return { url: null, error: "Imagem muito grande (máx. 5 MB)." };
  }
  const ext = file.name.split(".").pop()?.toLowerCase() || "png";
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false });
  if (error) return { url: null, error: error.message };
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { url: data.publicUrl, error: null };
}
