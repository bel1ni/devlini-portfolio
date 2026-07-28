import { supabase } from "@/lib/agro/supabase/client";
import type { AboutEntry, AboutProfile, AboutSection } from "./types";

// Todas as escritas passam pelo cliente autenticado (sessão do login Google);
// a RLS no banco só deixa o e-mail da dona gravar. Retornam { error } para a UI
// mostrar feedback.

export async function saveProfile(profile: AboutProfile) {
  const { error } = await supabase
    .from("about_profile")
    .upsert({ id: 1, ...profile, updated_at: new Date().toISOString() });
  return { error: error?.message ?? null };
}

export async function loadEntries(): Promise<AboutEntry[]> {
  const { data } = await supabase
    .from("about_entries")
    .select("*")
    .order("section", { ascending: true })
    .order("position", { ascending: true });
  return (data ?? []) as AboutEntry[];
}

export type EntryDraft = {
  section: AboutSection;
  title?: string | null;
  body?: string | null;
  tag?: string | null;
  url?: string | null;
  items?: string[];
  position?: number;
};

export async function addEntry(draft: EntryDraft) {
  const { error } = await supabase.from("about_entries").insert({
    section: draft.section,
    title: draft.title ?? null,
    body: draft.body ?? null,
    tag: draft.tag ?? null,
    url: draft.url ?? null,
    items: draft.items ?? [],
    position: draft.position ?? 0,
  });
  return { error: error?.message ?? null };
}

export async function updateEntry(id: string, draft: EntryDraft) {
  const { error } = await supabase
    .from("about_entries")
    .update({
      title: draft.title ?? null,
      body: draft.body ?? null,
      tag: draft.tag ?? null,
      url: draft.url ?? null,
      items: draft.items ?? [],
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  return { error: error?.message ?? null };
}

export async function deleteEntry(id: string) {
  const { error } = await supabase.from("about_entries").delete().eq("id", id);
  return { error: error?.message ?? null };
}

// Move um item para cima/baixo trocando a posição com o vizinho.
export async function swapPositions(a: AboutEntry, b: AboutEntry) {
  await supabase.from("about_entries").update({ position: b.position }).eq("id", a.id);
  await supabase.from("about_entries").update({ position: a.position }).eq("id", b.id);
}
