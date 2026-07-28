import { supabase } from "@/lib/agro/supabase/client";
import type { Project } from "./types";

// Semente: os mesmos 2 projetos do seed SQL. Serve de fallback para a página
// funcionar antes da migração ser rodada (e para verificação local).
const SEED: Project[] = [
  {
    id: "seed-controledegado",
    slug: "controledegado",
    name: "controledegado.app",
    summary:
      "SaaS de gestão de rebanho para produtores rurais — animais, pesagens e manejo no celular, construído do zero e publicado na Google Play.",
    cover_url: null,
    tech: ["React Native", "TypeScript", "Supabase", "PostgreSQL", "PWA"],
    status: "live",
    live_url: "https://controledegado.app",
    repo_url: null,
    problem:
      "O produtor rural controla o rebanho no caderno: dados soltos, difíceis de consultar e fáceis de perder.",
    solution:
      "Um app de gestão de rebanho direto ao ponto: cadastro de animais, pesagens e manejo, acessível pelo celular.",
    role: "Construí sozinha, de ponta a ponta: banco, back-end, interface, app mobile e publicação na loja.",
    result: "App no ar, publicado na Google Play e sendo usado por produtores.",
    position: 0,
    published: true,
  },
  {
    id: "seed-belagro",
    slug: "belagro",
    name: "BELAGRO",
    summary:
      "Portal de notícias do agronegócio que agrega dezenas de fontes e usa IA para resumir e priorizar o que importa para o produtor.",
    cover_url: null,
    tech: ["Next.js", "Supabase", "OpenRouter", "TypeScript"],
    status: "live",
    live_url: "https://devlini.com/agro",
    repo_url: null,
    problem:
      "O produtor não tem tempo de acompanhar dezenas de sites para saber o que realmente importa para ele.",
    solution:
      "Um agregador que coleta, resume e prioriza notícias com IA, com alertas por estado e briefing diário por e-mail.",
    role: "Idealizei e construí todo o produto: ingestão, curadoria e resumo por IA, feed, alertas e briefing.",
    result: "No ar em devlini.com/agro, atualizado automaticamente todos os dias.",
    position: 1,
    published: true,
  },
];

export async function getProjects(): Promise<Project[]> {
  try {
    const { data } = await supabase
      .from("projects")
      .select("*")
      .eq("published", true)
      .order("position", { ascending: true });

    if (data && data.length > 0) return data as Project[];
    return SEED;
  } catch {
    return SEED;
  }
}

export async function getProject(slug: string): Promise<Project | null> {
  try {
    const { data } = await supabase
      .from("projects")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (data) return data as Project;
  } catch {
    // cai na semente abaixo
  }
  return SEED.find((p) => p.slug === slug) ?? null;
}

export async function getProjectSlugs(): Promise<string[]> {
  try {
    const { data } = await supabase.from("projects").select("slug");
    if (data && data.length > 0) return data.map((r) => r.slug as string);
  } catch {
    // cai na semente
  }
  return SEED.map((p) => p.slug);
}
