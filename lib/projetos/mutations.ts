import { supabase } from "@/lib/agro/supabase/client";
import type { Project, ProjectStatus } from "./types";

const BUCKET = "project-images";

export async function loadAllProjects(): Promise<Project[]> {
  const { data } = await supabase
    .from("projects")
    .select("*")
    .order("position", { ascending: true });
  return (data ?? []) as Project[];
}

export type ProjectDraft = {
  slug: string;
  name: string;
  summary: string | null;
  cover_url: string | null;
  tech: string[];
  status: ProjectStatus;
  live_url: string | null;
  repo_url: string | null;
  problem: string | null;
  solution: string | null;
  role: string | null;
  result: string | null;
  published: boolean;
};

export async function addProject(position: number) {
  const suffix = Math.random().toString(36).slice(2, 7);
  const { error } = await supabase.from("projects").insert({
    slug: `novo-projeto-${suffix}`,
    name: "Novo projeto",
    status: "building",
    published: false,
    position,
  });
  return { error: error?.message ?? null };
}

export async function updateProject(id: string, draft: ProjectDraft) {
  const { error } = await supabase
    .from("projects")
    .update({ ...draft, updated_at: new Date().toISOString() })
    .eq("id", id);
  return { error: error?.message ?? null };
}

export async function deleteProject(id: string) {
  const { error } = await supabase.from("projects").delete().eq("id", id);
  return { error: error?.message ?? null };
}

export async function swapProjectPositions(a: Project, b: Project) {
  await supabase.from("projects").update({ position: b.position }).eq("id", a.id);
  await supabase.from("projects").update({ position: a.position }).eq("id", b.id);
}

// Envia uma imagem para o Storage e devolve a URL pública.
export async function uploadCover(
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
