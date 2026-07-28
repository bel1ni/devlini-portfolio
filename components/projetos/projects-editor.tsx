"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowDown, ArrowUp, ImagePlus, Plus, Trash2 } from "lucide-react";
import { getSession } from "@/lib/agro/supabase/get-session";
import { signInWithGoogle, signOut } from "@/lib/agro/supabase/auth";
import { profile } from "@/content/site";
import {
  addProject,
  deleteProject,
  loadAllProjects,
  swapProjectPositions,
  updateProject,
  uploadCover,
} from "@/lib/projetos/mutations";
import type { Project, ProjectStatus } from "@/lib/projetos/types";

const ADMIN_EMAIL = profile.personalEmail;

type Editable = Project & { techText: string };

const input =
  "w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 outline-none focus:border-emerald-500";
const label = "block text-xs font-medium text-zinc-500";

export default function ProjectsEditor() {
  const [status, setStatus] = useState<
    "loading" | "anon" | "unauthorized" | "ready"
  >("loading");
  const [email, setEmail] = useState("");
  const [projects, setProjects] = useState<Editable[]>([]);
  const [msg, setMsg] = useState("");
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const flash = useCallback((text: string) => {
    setMsg(text);
    window.setTimeout(() => setMsg(""), 2500);
  }, []);

  const refresh = useCallback(async () => {
    const rows = await loadAllProjects();
    setProjects(rows.map((p) => ({ ...p, techText: p.tech.join(", ") })));
  }, []);

  useEffect(() => {
    async function init() {
      const session = await getSession();
      if (!session) return setStatus("anon");
      const userEmail = session.user.email ?? "";
      setEmail(userEmail);
      if (userEmail !== ADMIN_EMAIL) return setStatus("unauthorized");
      await refresh();
      setStatus("ready");
    }
    init();
  }, [refresh]);

  function setField(id: string, field: keyof Editable, value: unknown) {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  }

  async function onSave(p: Editable) {
    const { error } = await updateProject(p.id, {
      slug: p.slug.trim(),
      name: p.name,
      summary: p.summary,
      cover_url: p.cover_url,
      tech: p.techText.split(",").map((t) => t.trim()).filter(Boolean),
      status: p.status,
      live_url: p.live_url,
      repo_url: p.repo_url,
      problem: p.problem,
      solution: p.solution,
      role: p.role,
      result: p.result,
      published: p.published,
    });
    flash(error ? `Erro: ${error}` : "Projeto salvo!");
  }

  async function onDelete(id: string) {
    const { error } = await deleteProject(id);
    setConfirmId(null);
    if (error) return flash(`Erro: ${error}`);
    await refresh();
    flash("Projeto removido.");
  }

  async function onAdd() {
    const max = Math.max(-1, ...projects.map((p) => p.position));
    const { error } = await addProject(max + 1);
    if (error) return flash(`Erro: ${error}`);
    await refresh();
  }

  async function onMove(p: Editable, dir: -1 | 1) {
    const sorted = [...projects].sort((a, b) => a.position - b.position);
    const idx = sorted.findIndex((x) => x.id === p.id);
    const neighbor = sorted[idx + dir];
    if (!neighbor) return;
    await swapProjectPositions(p, neighbor);
    await refresh();
  }

  async function onUpload(p: Editable, file: File) {
    setUploadingId(p.id);
    const { url, error } = await uploadCover(file);
    setUploadingId(null);
    if (error || !url) return flash(`Erro: ${error ?? "upload"}`);
    setField(p.id, "cover_url", url);
    flash("Imagem enviada — clique em Salvar.");
  }

  if (status === "loading")
    return <p className="py-16 text-center text-sm text-zinc-500">Carregando…</p>;

  if (status === "anon")
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <h1 className="text-xl font-bold text-zinc-900">Editar projetos</h1>
        <p className="mt-2 text-sm text-zinc-500">
          Entre com sua conta Google para editar os projetos.
        </p>
        <button
          onClick={() => signInWithGoogle("/projetos/editar")}
          className="mt-6 rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-zinc-700"
        >
          Entrar com Google
        </button>
      </div>
    );

  if (status === "unauthorized")
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <h1 className="text-xl font-bold text-zinc-900">Acesso restrito</h1>
        <p className="mt-2 text-sm text-zinc-500">
          A conta {email} não pode editar este site.
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

  const sorted = [...projects].sort((a, b) => a.position - b.position);

  return (
    <div className="mx-auto max-w-2xl py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            Editar projetos
          </h1>
          <p className="mt-1 text-xs text-zinc-400">Logada como {email}</p>
        </div>
        <button
          onClick={onAdd}
          className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          <Plus size={14} /> Novo projeto
        </button>
      </div>

      {msg && (
        <div className="sticky top-2 z-10 mt-4 rounded-lg bg-zinc-900 px-4 py-2 text-center text-sm font-medium text-white">
          {msg}
        </div>
      )}

      <div className="mt-6 space-y-6">
        {sorted.map((p, idx) => (
          <div key={p.id} className="space-y-3 rounded-2xl border border-zinc-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-zinc-700">
                <input
                  type="checkbox"
                  checked={p.published}
                  onChange={(e) => setField(p.id, "published", e.target.checked)}
                  className="size-4 accent-emerald-600"
                />
                Publicado
              </label>
              <div className="flex gap-1">
                <button
                  onClick={() => onMove(p, -1)}
                  disabled={idx === 0}
                  aria-label="Subir"
                  className="rounded-lg border border-zinc-200 p-1.5 text-zinc-500 hover:border-zinc-300 disabled:opacity-30"
                >
                  <ArrowUp size={14} />
                </button>
                <button
                  onClick={() => onMove(p, 1)}
                  disabled={idx === sorted.length - 1}
                  aria-label="Descer"
                  className="rounded-lg border border-zinc-200 p-1.5 text-zinc-500 hover:border-zinc-300 disabled:opacity-30"
                >
                  <ArrowDown size={14} />
                </button>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className={label}>Nome</span>
                <input value={p.name} onChange={(e) => setField(p.id, "name", e.target.value)} className={input} />
              </label>
              <label className="block">
                <span className={label}>Endereço (slug na URL)</span>
                <input value={p.slug} onChange={(e) => setField(p.id, "slug", e.target.value)} className={input} />
              </label>
            </div>

            <label className="block">
              <span className={label}>Resumo</span>
              <textarea rows={2} value={p.summary ?? ""} onChange={(e) => setField(p.id, "summary", e.target.value)} className={input} />
            </label>

            {/* Imagem de capa */}
            <div>
              <span className={label}>Imagem de capa</span>
              {p.cover_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.cover_url} alt="" className="mt-1 h-32 w-full rounded-lg border border-zinc-200 object-cover" />
              )}
              <div className="mt-2 flex items-center gap-2">
                <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-600 hover:border-zinc-300">
                  <ImagePlus size={14} />
                  {uploadingId === p.id ? "Enviando…" : p.cover_url ? "Trocar imagem" : "Enviar imagem"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) onUpload(p, file);
                    }}
                  />
                </label>
                {p.cover_url && (
                  <button
                    onClick={() => setField(p.id, "cover_url", null)}
                    className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs text-zinc-500 hover:border-zinc-300"
                  >
                    Remover
                  </button>
                )}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className={label}>Status</span>
                <select
                  value={p.status}
                  onChange={(e) => setField(p.id, "status", e.target.value as ProjectStatus)}
                  className={input}
                >
                  <option value="live">No ar</option>
                  <option value="building">Em construção</option>
                  <option value="paused">Pausado</option>
                </select>
              </label>
              <label className="block">
                <span className={label}>Tecnologias (vírgula)</span>
                <input value={p.techText} onChange={(e) => setField(p.id, "techText", e.target.value)} className={input} />
              </label>
              <label className="block">
                <span className={label}>Link ao vivo</span>
                <input value={p.live_url ?? ""} onChange={(e) => setField(p.id, "live_url", e.target.value)} className={input} />
              </label>
              <label className="block">
                <span className={label}>Link do código</span>
                <input value={p.repo_url ?? ""} onChange={(e) => setField(p.id, "repo_url", e.target.value)} className={input} />
              </label>
            </div>

            {(
              [
                ["problem", "O problema"],
                ["solution", "A solução"],
                ["role", "O que eu fiz"],
                ["result", "Resultado"],
              ] as const
            ).map(([field, lbl]) => (
              <label key={field} className="block">
                <span className={label}>{lbl}</span>
                <textarea
                  rows={2}
                  value={(p[field] as string | null) ?? ""}
                  onChange={(e) => setField(p.id, field, e.target.value)}
                  className={input}
                />
              </label>
            ))}

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => onSave(p)}
                className="rounded-lg bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
              >
                Salvar
              </button>
              <a
                href={`/projetos/${p.slug}`}
                target="_blank"
                rel="noopener"
                className="rounded-lg border border-zinc-200 bg-white px-4 py-1.5 text-xs font-semibold text-zinc-600 hover:border-zinc-300"
              >
                Ver página
              </a>
              {confirmId === p.id ? (
                <button
                  onClick={() => onDelete(p.id)}
                  className="ml-auto rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
                >
                  Confirmar exclusão
                </button>
              ) : (
                <button
                  onClick={() => setConfirmId(p.id)}
                  aria-label="Excluir"
                  className="ml-auto rounded-lg border border-red-200 bg-red-50 p-1.5 text-red-600 hover:bg-red-100"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          </div>
        ))}

        {sorted.length === 0 && (
          <p className="rounded-xl border border-dashed border-zinc-200 p-8 text-center text-sm text-zinc-400">
            Nenhum projeto ainda. Clique em &quot;Novo projeto&quot;.
          </p>
        )}
      </div>

      <p className="mt-10 text-center text-xs text-zinc-400">
        As mudanças aparecem nas páginas públicas em até ~30 segundos.
      </p>
    </div>
  );
}
