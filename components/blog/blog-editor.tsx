"use client";

import { useCallback, useEffect, useState } from "react";
import { ImagePlus, Plus, Trash2 } from "lucide-react";
import { getSession } from "@/lib/agro/supabase/get-session";
import { signInWithGoogle, signOut } from "@/lib/agro/supabase/auth";
import { profile } from "@/content/site";
import {
  addPost,
  deletePost,
  loadAllPosts,
  updatePost,
  uploadImage,
} from "@/lib/blog/mutations";
import type { Post } from "@/lib/blog/types";

const ADMIN_EMAIL = profile.personalEmail;

const input =
  "w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 outline-none focus:border-emerald-500";
const label = "block text-xs font-medium text-zinc-600";

export default function BlogEditor() {
  const [status, setStatus] = useState<
    "loading" | "anon" | "unauthorized" | "ready"
  >("loading");
  const [email, setEmail] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [msg, setMsg] = useState("");
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const flash = useCallback((text: string) => {
    setMsg(text);
    window.setTimeout(() => setMsg(""), 2500);
  }, []);

  const refresh = useCallback(async () => {
    setPosts(await loadAllPosts());
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

  function setField(id: string, field: keyof Post, value: unknown) {
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  }

  async function onSave(p: Post) {
    const { error } = await updatePost(p.id, {
      slug: p.slug.trim(),
      title: p.title,
      excerpt: p.excerpt,
      cover_url: p.cover_url,
      body: p.body,
      published: p.published,
      published_at: p.published_at,
    });
    flash(error ? `Erro: ${error}` : "Post salvo!");
  }

  async function onDelete(id: string) {
    const { error } = await deletePost(id);
    setConfirmId(null);
    if (error) return flash(`Erro: ${error}`);
    await refresh();
    flash("Post removido.");
  }

  async function onAdd() {
    const { error } = await addPost();
    if (error) return flash(`Erro: ${error}`);
    await refresh();
  }

  async function onUpload(p: Post, file: File) {
    setUploadingId(p.id);
    const { url, error } = await uploadImage(file);
    setUploadingId(null);
    if (error || !url) return flash(`Erro: ${error ?? "upload"}`);
    setField(p.id, "cover_url", url);
    flash("Imagem enviada — clique em Salvar.");
  }

  if (status === "loading")
    return <p className="py-16 text-center text-sm text-zinc-600">Carregando…</p>;

  if (status === "anon")
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <h1 className="text-xl font-bold text-zinc-900">Editar blog</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Entre com sua conta Google para escrever posts.
        </p>
        <button
          onClick={() => signInWithGoogle("/blog/editar")}
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
        <p className="mt-2 text-sm text-zinc-600">
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

  return (
    <div className="mx-auto max-w-2xl py-8">
      <div className="flex items-center justify-between">
        <div>
          <a href="/painel" className="text-xs font-medium text-zinc-500 hover:text-zinc-600">
            ← Painel
          </a>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-zinc-900">Editar blog</h1>
          <p className="mt-1 text-xs text-zinc-500">Logada como {email}</p>
        </div>
        <button
          onClick={onAdd}
          className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          <Plus size={14} /> Novo post
        </button>
      </div>

      {msg && (
        <div className="sticky top-2 z-10 mt-4 rounded-lg bg-zinc-900 px-4 py-2 text-center text-sm font-medium text-white">
          {msg}
        </div>
      )}

      <div className="mt-6 space-y-6">
        {posts.map((p) => (
          <div key={p.id} className="space-y-3 rounded-2xl border border-zinc-200 bg-white p-5">
            <div className="flex flex-wrap items-center gap-4">
              <label className="flex items-center gap-2 text-sm text-zinc-700">
                <input
                  type="checkbox"
                  checked={p.published}
                  onChange={(e) => setField(p.id, "published", e.target.checked)}
                  className="size-4 accent-emerald-600"
                />
                Publicado
              </label>
              <label className="flex items-center gap-2 text-xs text-zinc-600">
                Data
                <input
                  type="date"
                  value={p.published_at.slice(0, 10)}
                  onChange={(e) =>
                    setField(
                      p.id,
                      "published_at",
                      new Date(e.target.value + "T12:00:00").toISOString()
                    )
                  }
                  className="rounded-lg border border-zinc-200 px-2 py-1 text-sm"
                />
              </label>
            </div>

            <label className="block">
              <span className={label}>Título</span>
              <input value={p.title} onChange={(e) => setField(p.id, "title", e.target.value)} className={input} />
            </label>
            <label className="block">
              <span className={label}>Endereço (slug na URL)</span>
              <input value={p.slug} onChange={(e) => setField(p.id, "slug", e.target.value)} className={input} />
            </label>
            <label className="block">
              <span className={label}>Resumo (aparece na lista)</span>
              <textarea rows={2} value={p.excerpt ?? ""} onChange={(e) => setField(p.id, "excerpt", e.target.value)} className={input} />
            </label>

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
                    className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs text-zinc-600 hover:border-zinc-300"
                  >
                    Remover
                  </button>
                )}
              </div>
            </div>

            <label className="block">
              <span className={label}>Texto do post</span>
              <textarea rows={10} value={p.body ?? ""} onChange={(e) => setField(p.id, "body", e.target.value)} className={input} />
            </label>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => onSave(p)}
                className="rounded-lg bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
              >
                Salvar
              </button>
              <a
                href={`/blog/${p.slug}`}
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

        {posts.length === 0 && (
          <p className="rounded-xl border border-dashed border-zinc-200 p-8 text-center text-sm text-zinc-500">
            Nenhum post ainda. Clique em &quot;Novo post&quot;.
          </p>
        )}
      </div>

      <p className="mt-10 text-center text-xs text-zinc-500">
        As mudanças aparecem no blog público em até ~30 segundos.
      </p>
    </div>
  );
}
