import { supabase } from "@/lib/agro/supabase/client";
import { sobre as seed } from "@/content/sobre";
import type { AboutEntry, AboutProfile } from "./types";

// Conteúdo atual do código como fallback: se a tabela ainda não foi criada
// (migração pendente) ou o banco estiver indisponível, a página /sobre continua
// funcionando com a semente. Assim nada quebra antes de rodar o SQL.
function seedData(): { profile: AboutProfile; entries: AboutEntry[] } {
  const profile: AboutProfile = {
    positioning: seed.positioning,
    intro: seed.intro,
    availability_open: seed.availability.open,
    availability_headline: seed.availability.headline,
    availability_note: seed.availability.note,
    roles: seed.availability.roles,
  };

  let i = 0;
  const entry = (e: Partial<AboutEntry> & { section: AboutEntry["section"] }): AboutEntry => ({
    id: `seed-${i}`,
    title: null,
    body: null,
    tag: null,
    url: null,
    items: [],
    position: i++,
    ...e,
  });

  const entries: AboutEntry[] = [
    ...seed.story.map((body) => entry({ section: "story", body })),
    ...seed.skills.map((s) =>
      entry({ section: "skill", title: s.group, body: s.note, items: s.items })
    ),
    ...seed.highlights.map((h) =>
      entry({ section: "highlight", title: h.name, body: h.blurb, tag: h.tag, url: h.url })
    ),
    ...seed.learning.items.map((l) =>
      entry({ section: "learning", title: l.name, body: l.note })
    ),
  ];

  return { profile, entries };
}

// Escolhe o campo em inglês (com fallback para o pt) quando locale === "en".
function pick(en: string | null | undefined, pt: string, useEn: boolean): string {
  return useEn ? (en && en.trim() ? en : pt) : pt;
}

export async function getAboutData(
  locale: string = "pt"
): Promise<{ profile: AboutProfile; entries: AboutEntry[] }> {
  const en = locale === "en";

  try {
    const [{ data: profileRow }, { data: entryRows }] = await Promise.all([
      supabase.from("about_profile").select("*").eq("id", 1).maybeSingle(),
      supabase
        .from("about_entries")
        .select("*")
        .order("section", { ascending: true })
        .order("position", { ascending: true }),
    ]);

    if (!profileRow) return seedData();

    const rolesEn: string[] = profileRow.roles_en ?? [];

    return {
      profile: {
        positioning: pick(profileRow.positioning_en, profileRow.positioning ?? "", en),
        intro: pick(profileRow.intro_en, profileRow.intro ?? "", en),
        availability_open: profileRow.availability_open ?? false,
        availability_headline: pick(
          profileRow.availability_headline_en,
          profileRow.availability_headline ?? "",
          en
        ),
        availability_note: pick(
          profileRow.availability_note_en,
          profileRow.availability_note ?? "",
          en
        ),
        roles: en && rolesEn.length ? rolesEn : profileRow.roles ?? [],
      },
      entries: ((entryRows ?? []) as Record<string, unknown>[]).map((row) => ({
        id: row.id as string,
        section: row.section as AboutEntry["section"],
        title: pick((row.title_en as string) ?? null, (row.title as string) ?? "", en) || null,
        body: pick((row.body_en as string) ?? null, (row.body as string) ?? "", en) || null,
        tag: pick((row.tag_en as string) ?? null, (row.tag as string) ?? "", en) || null,
        url: (row.url as string) ?? null,
        items: (row.items as string[]) ?? [],
        position: (row.position as number) ?? 0,
      })),
    };
  } catch {
    return seedData();
  }
}

export function entriesBySection(entries: AboutEntry[], section: AboutEntry["section"]) {
  return entries
    .filter((e) => e.section === section)
    .sort((a, b) => a.position - b.position);
}
