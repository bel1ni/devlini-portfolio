import { supabase } from "@/lib/agro/supabase/client";
import type { Post } from "./types";

// Semente = o mesmo post do seed SQL, para a página funcionar antes da migração.
const SEED: Post[] = [
  {
    id: "seed-roblox",
    slug: "comecei-a-estudar-roblox-studio",
    title: "Comecei a estudar desenvolvimento de jogos no Roblox Studio",
    excerpt:
      "Entrei no studio.dev para aprender a criar jogos no Roblox Studio com a linguagem Lua. Primeiras impressões.",
    cover_url: null,
    body: "Comecei o curso studio.dev, focado em criação de jogos no Roblox Studio.\n\nA proposta é aprender do zero: lógica de jogo, física, scripts em Lua e a experiência do jogador. Estou animada porque é uma forma diferente de programar — pensar em interação, diversão e ritmo, não só em telas e dados.\n\nVou registrando aqui o que for aprendendo. 🎮",
    published: true,
    published_at: new Date().toISOString(),
  },
];

export async function getPosts(): Promise<Post[]> {
  try {
    const { data } = await supabase
      .from("posts")
      .select("*")
      .eq("published", true)
      .order("published_at", { ascending: false });
    if (data && data.length > 0) return data as Post[];
    return SEED;
  } catch {
    return SEED;
  }
}

export async function getPost(slug: string): Promise<Post | null> {
  try {
    const { data } = await supabase
      .from("posts")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    if (data) return data as Post;
  } catch {
    // cai na semente
  }
  return SEED.find((p) => p.slug === slug) ?? null;
}

export async function getPostSlugs(): Promise<string[]> {
  try {
    const { data } = await supabase.from("posts").select("slug").eq("published", true);
    if (data && data.length > 0) return data.map((r) => r.slug as string);
  } catch {
    // cai na semente
  }
  return SEED.map((p) => p.slug);
}
