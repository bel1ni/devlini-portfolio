"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/lib/agro/supabase/client";
import { getSession } from "@/lib/agro/supabase/get-session";
import { signInWithGoogle, signOut } from "@/lib/agro/supabase/auth";
import { profile } from "@/content/site";
import {
  addEntry,
  deleteEntry,
  loadEntries,
  saveProfile,
  swapPositions,
  updateEntry,
} from "@/lib/sobre/mutations";
import type { AboutEntryRow, AboutSection } from "@/lib/sobre/types";

const ADMIN_EMAIL = profile.personalEmail;

type Field = "title" | "body" | "items" | "tag" | "url";

const SECTION_SPEC: Record<AboutSection, { label: string; fields: Field[] }> = {
  story: { label: "Minha história", fields: ["body"] },
  skill: { label: "No que sou boa", fields: ["title", "items", "body"] },
  highlight: { label: "O que já construí", fields: ["title", "body", "tag", "url"] },
  learning: { label: "Aprendendo agora", fields: ["title", "body"] },
};

const FIELD_LABEL: Record<Field, string> = {
  title: "Título",
  body: "Texto",
  items: "Itens (separados por vírgula)",
  tag: "Selo",
  url: "Link",
};

type ProfState = {
  positioning: string;
  intro: string;
  availability_open: boolean;
  availability_headline: string;
  availability_note: string;
  positioning_en: string;
  intro_en: string;
  availability_headline_en: string;
  availability_note_en: string;
};

type Editable = AboutEntryRow & { itemsText: string };

const input =
  "w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 outline-none focus:border-emerald-500";

export default function AboutEditor() {
  const [status, setStatus] = useState<
    "loading" | "anon" | "unauthorized" | "ready"
  >("loading");
  const [email, setEmail] = useState("");
  const [lang, setLang] = useState<"pt" | "en">("pt");
  const [prof, setProf] = useState<ProfState | null>(null);
  const [rolesText, setRolesText] = useState("");
  const [rolesTextEn, setRolesTextEn] = useState("");
  const [entries, setEntries] = useState<Editable[]>([]);
  const [msg, setMsg] = useState("");

  const en = lang === "en";

  const flash = useCallback((text: string) => {
    setMsg(text);
    window.setTimeout(() => setMsg(""), 2500);
  }, []);

  const refreshEntries = useCallback(async () => {
    const rows = await loadEntries();
    setEntries(rows.map((e) => ({ ...e, itemsText: e.items.join(", ") })));
  }, []);

  useEffect(() => {
    async function init() {
      const session = await getSession();
      if (!session) return setStatus("anon");

      const userEmail = session.user.email ?? "";
      setEmail(userEmail);
      if (userEmail !== ADMIN_EMAIL) return setStatus("unauthorized");

      const { data: r } = await supabase
        .from("about_profile")
        .select("*")
        .eq("id", 1)
        .maybeSingle();

      setProf({
        positioning: r?.positioning ?? "",
        intro: r?.intro ?? "",
        availability_open: r?.availability_open ?? true,
        availability_headline: r?.availability_headline ?? "",
        availability_note: r?.availability_note ?? "",
        positioning_en: r?.positioning_en ?? "",
        intro_en: r?.intro_en ?? "",
        availability_headline_en: r?.availability_headline_en ?? "",
        availability_note_en: r?.availability_note_en ?? "",
      });
      setRolesText((r?.roles ?? []).join(", "));
      setRolesTextEn((r?.roles_en ?? []).join(", "));
      await refreshEntries();
      setStatus("ready");
    }
    init();
  }, [refreshEntries]);

  async function onSaveProfile() {
    if (!prof) return;
    const { error } = await saveProfile({
      positioning: prof.positioning,
      intro: prof.intro,
      availability_open: prof.availability_open,
      availability_headline: prof.availability_headline,
      availability_note: prof.availability_note,
      roles: rolesText.split(",").map((r) => r.trim()).filter(Boolean),
      positioning_en: prof.positioning_en,
      intro_en: prof.intro_en,
      availability_headline_en: prof.availability_headline_en,
      availability_note_en: prof.availability_note_en,
      roles_en: rolesTextEn.split(",").map((r) => r.trim()).filter(Boolean),
    });
    flash(error ? `Erro: ${error}` : "Perfil salvo!");
  }

  async function onSaveEntry(entry: Editable) {
    const items = entry.itemsText.split(",").map((i) => i.trim()).filter(Boolean);
    const { error } = await updateEntry(entry.id, {
      section: entry.section,
      title: entry.title,
      body: entry.body,
      tag: entry.tag,
      url: entry.url,
      items,
      title_en: entry.title_en,
      body_en: entry.body_en,
      tag_en: entry.tag_en,
    });
    flash(error ? `Erro: ${error}` : "Item salvo!");
  }

  async function onDelete(id: string) {
    const { error } = await deleteEntry(id);
    if (error) return flash(`Erro: ${error}`);
    await refreshEntries();
    flash("Item removido.");
  }

  async function onAdd(section: AboutSection) {
    const max = Math.max(
      -1,
      ...entries.filter((e) => e.section === section).map((e) => e.position)
    );
    const { error } = await addEntry({ section, position: max + 1 });
    if (error) return flash(`Erro: ${error}`);
    await refreshEntries();
  }

  async function onMove(entry: Editable, dir: -1 | 1) {
    const siblings = entries
      .filter((e) => e.section === entry.section)
      .sort((a, b) => a.position - b.position);
    const idx = siblings.findIndex((e) => e.id === entry.id);
    const neighbor = siblings[idx + dir];
    if (!neighbor) return;
    await swapPositions(entry, neighbor);
    await refreshEntries();
  }

  function setField(id: string, field: keyof Editable, value: string) {
    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, [field]: value } : e))
    );
  }

  if (status === "loading") {
    return <p className="py-16 text-center text-sm text-zinc-600">Carregando…</p>;
  }

  if (status === "anon") {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <h1 className="text-xl font-bold text-zinc-900">Painel do seu site</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Entre com sua conta Google para editar a página Sobre.
        </p>
        <button
          onClick={() => signInWithGoogle("/sobre/editar")}
          className="mt-6 rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-700 active:scale-[0.97]"
        >
          Entrar com Google
        </button>
      </div>
    );
  }

  if (status === "unauthorized") {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <h1 className="text-xl font-bold text-zinc-900">Acesso restrito</h1>
        <p className="mt-2 text-sm text-zinc-600">
          A conta {email} não tem permissão para editar este site.
        </p>
        <button
          onClick={async () => {
            await signOut();
            location.reload();
          }}
          className="mt-6 rounded-lg border border-zinc-200 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-700 hover:border-zinc-300"
        >
          Sair
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl py-8">
      <div className="flex items-center justify-between">
        <div>
          <a href="/painel" className="text-xs font-medium text-zinc-500 hover:text-zinc-600">
            ← Painel
          </a>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-zinc-900">
            Editar página Sobre
          </h1>
          <p className="mt-1 text-xs text-zinc-500">Logada como {email}</p>
        </div>
        <button
          onClick={async () => {
            await signOut();
            location.reload();
          }}
          className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600 hover:border-zinc-300"
        >
          Sair
        </button>
      </div>

      {/* Seletor de idioma */}
      <div className="mt-4 inline-flex rounded-lg border border-zinc-200 bg-white p-1">
        {(["pt", "en"] as const).map((l) => (
          <button
            key={l}
            onClick={() => setLang(l)}
            className={`rounded-md px-4 py-1.5 text-sm font-medium transition ${
              lang === l ? "bg-emerald-600 text-white" : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            {l === "pt" ? "🇧🇷 Português" : "🇬🇧 English"}
          </button>
        ))}
      </div>
      <p className="mt-2 text-xs text-zinc-500">
        {en
          ? "Editando o inglês (/en/sobre). Itens e links são compartilhados — edite-os no português."
          : "Editando o português (/sobre)."}
      </p>

      {msg && (
        <div className="sticky top-2 z-10 mt-4 rounded-lg bg-zinc-900 px-4 py-2 text-center text-sm font-medium text-white">
          {msg}
        </div>
      )}

      {/* Perfil */}
      {prof && (
        <section className="mt-6 space-y-3 rounded-2xl border border-zinc-200 bg-white p-5">
          <h2 className="text-sm font-bold text-zinc-900">Perfil</h2>
          <label className="block">
            <span className="text-xs font-medium text-zinc-600">Frase de posicionamento</span>
            <textarea
              rows={2}
              value={en ? prof.positioning_en : prof.positioning}
              onChange={(e) =>
                setProf({ ...prof, [en ? "positioning_en" : "positioning"]: e.target.value })
              }
              className={input}
            />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-zinc-600">Apresentação</span>
            <textarea
              rows={4}
              value={en ? prof.intro_en : prof.intro}
              onChange={(e) =>
                setProf({ ...prof, [en ? "intro_en" : "intro"]: e.target.value })
              }
              className={input}
            />
          </label>
          {!en && (
            <label className="flex items-center gap-2 text-sm text-zinc-700">
              <input
                type="checkbox"
                checked={prof.availability_open}
                onChange={(e) => setProf({ ...prof, availability_open: e.target.checked })}
                className="size-4 accent-emerald-600"
              />
              Mostrar faixa &quot;aberta a oportunidades&quot;
            </label>
          )}
          <label className="block">
            <span className="text-xs font-medium text-zinc-600">Título da faixa</span>
            <input
              value={en ? prof.availability_headline_en : prof.availability_headline}
              onChange={(e) =>
                setProf({
                  ...prof,
                  [en ? "availability_headline_en" : "availability_headline"]: e.target.value,
                })
              }
              className={input}
            />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-zinc-600">Vagas (separadas por vírgula)</span>
            <input
              value={en ? rolesTextEn : rolesText}
              onChange={(e) => (en ? setRolesTextEn : setRolesText)(e.target.value)}
              className={input}
            />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-zinc-600">Observação (modalidade, disponibilidade)</span>
            <input
              value={en ? prof.availability_note_en : prof.availability_note}
              onChange={(e) =>
                setProf({
                  ...prof,
                  [en ? "availability_note_en" : "availability_note"]: e.target.value,
                })
              }
              className={input}
            />
          </label>
          <button
            onClick={onSaveProfile}
            className="rounded-lg bg-emerald-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 active:scale-[0.97]"
          >
            Salvar perfil
          </button>
        </section>
      )}

      {/* Seções de itens */}
      {(Object.keys(SECTION_SPEC) as AboutSection[]).map((section) => {
        const spec = SECTION_SPEC[section];
        // No inglês só os campos traduzíveis (itens e links são compartilhados).
        const fields = en
          ? spec.fields.filter((f) => f === "title" || f === "body" || f === "tag")
          : spec.fields;
        const items = entries
          .filter((e) => e.section === section)
          .sort((a, b) => a.position - b.position);

        return (
          <section key={section} className="mt-8">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-zinc-900">{spec.label}</h2>
              {!en && (
                <button
                  onClick={() => onAdd(section)}
                  className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-600 hover:border-zinc-300"
                >
                  <Plus size={14} /> Adicionar
                </button>
              )}
            </div>

            <div className="mt-3 space-y-3">
              {items.length === 0 && (
                <p className="rounded-lg border border-dashed border-zinc-200 p-4 text-center text-xs text-zinc-500">
                  Nenhum item ainda.
                </p>
              )}

              {items.map((entry, idx) => (
                <div key={entry.id} className="space-y-2 rounded-xl border border-zinc-200 bg-white p-4">
                  {fields.map((field) => {
                    // chave da coluna conforme idioma (title→title_en, etc.)
                    const key: keyof Editable =
                      field === "items"
                        ? "itemsText"
                        : en && (field === "title" || field === "body" || field === "tag")
                          ? (`${field}_en` as keyof Editable)
                          : (field as keyof Editable);
                    const value = (entry[key] as string | null) ?? "";

                    return field === "body" ? (
                      <label key={field} className="block">
                        <span className="text-xs font-medium text-zinc-600">{FIELD_LABEL[field]}</span>
                        <textarea
                          rows={2}
                          value={value}
                          onChange={(e) => setField(entry.id, key, e.target.value)}
                          className={input}
                        />
                      </label>
                    ) : (
                      <label key={field} className="block">
                        <span className="text-xs font-medium text-zinc-600">{FIELD_LABEL[field]}</span>
                        <input
                          value={value}
                          onChange={(e) => setField(entry.id, key, e.target.value)}
                          className={input}
                        />
                      </label>
                    );
                  })}

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => onSaveEntry(entry)}
                      className="rounded-lg bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-700"
                    >
                      Salvar
                    </button>
                    {!en && (
                      <>
                        <button
                          onClick={() => onDelete(entry.id)}
                          aria-label="Excluir"
                          className="rounded-lg border border-red-200 bg-red-50 p-1.5 text-red-600 hover:bg-red-100"
                        >
                          <Trash2 size={14} />
                        </button>
                        <div className="ml-auto flex gap-1">
                          <button
                            onClick={() => onMove(entry, -1)}
                            disabled={idx === 0}
                            aria-label="Subir"
                            className="rounded-lg border border-zinc-200 p-1.5 text-zinc-600 hover:border-zinc-300 disabled:opacity-30"
                          >
                            <ArrowUp size={14} />
                          </button>
                          <button
                            onClick={() => onMove(entry, 1)}
                            disabled={idx === items.length - 1}
                            aria-label="Descer"
                            className="rounded-lg border border-zinc-200 p-1.5 text-zinc-600 hover:border-zinc-300 disabled:opacity-30"
                          >
                            <ArrowDown size={14} />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      })}

      <p className="mt-10 text-center text-xs text-zinc-500">
        As mudanças aparecem na página pública em até ~30 segundos.
      </p>
    </div>
  );
}
