import { supabase } from "@/lib/agro/supabase/client";

export type AdRequest = {
  id: string;
  plan: string | null;
  name: string;
  contact: string;
  ad_url: string | null;
  message: string | null;
  created_at: string;
};

export type AdRequestDraft = {
  plan?: string | null;
  name: string;
  contact: string;
  ad_url?: string | null;
  message?: string | null;
};

export async function addAdRequest(draft: AdRequestDraft) {
  const name = draft.name.trim().slice(0, 120);
  const contact = draft.contact.trim().slice(0, 200);
  if (!name || !contact) return { error: "Preencha nome e contato." };

  const { error } = await supabase.from("ad_requests").insert({
    plan: draft.plan ?? null,
    name,
    contact,
    ad_url: draft.ad_url?.trim().slice(0, 500) || null,
    message: draft.message?.trim().slice(0, 2000) || null,
  });
  return { error: error?.message ?? null };
}

// Owner-only (RLS): usado no /painel.
export async function loadAdRequests(): Promise<AdRequest[]> {
  const { data } = await supabase
    .from("ad_requests")
    .select("*")
    .order("created_at", { ascending: false });
  return (data ?? []) as AdRequest[];
}

export async function deleteAdRequest(id: string) {
  const { error } = await supabase.from("ad_requests").delete().eq("id", id);
  return { error: error?.message ?? null };
}
