"use client";

import { useCallback, useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { getSession } from "@/lib/agro/supabase/get-session";
import { profile } from "@/content/site";
import {
  addComment,
  deleteComment,
  getComments,
  type Comment,
} from "@/lib/blog/comments";

function fmt(date: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

export function Comments({ slug }: { slug: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [trap, setTrap] = useState(""); // honeypot: bots preenchem, humanos não
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState("");
  const [isOwner, setIsOwner] = useState(false);

  const load = useCallback(async () => {
    setComments(await getComments(slug));
  }, [slug]);

  useEffect(() => {
    load();
    getSession().then((s) => setIsOwner(s?.user.email === profile.personalEmail));
  }, [load]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (trap) return; // provável bot
    setSending(true);
    const { error } = await addComment(slug, name, body);
    setSending(false);
    if (error) {
      setMsg(`Erro: ${error}`);
      return;
    }
    setBody("");
    setMsg("Comentário publicado!");
    window.setTimeout(() => setMsg(""), 2500);
    await load();
  }

  async function onDelete(id: string) {
    await deleteComment(id);
    await load();
  }

  return (
    <section className="mt-12 border-t border-zinc-200 pt-8">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
        Comentários{comments.length > 0 && ` (${comments.length})`}
      </h2>

      <ul className="mt-4 space-y-4">
        {comments.length === 0 && (
          <li className="text-sm text-zinc-500">
            Seja o primeiro a comentar.
          </li>
        )}
        {comments.map((c) => (
          <li key={c.id} className="rounded-xl border border-zinc-200 bg-white p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-semibold text-zinc-900">
                {c.author_name}
              </span>
              <span className="flex items-center gap-2">
                <span className="text-xs text-zinc-500">{fmt(c.created_at)}</span>
                {isOwner && (
                  <button
                    onClick={() => onDelete(c.id)}
                    aria-label="Apagar comentário"
                    className="rounded p-1 text-red-500 hover:bg-red-50"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </span>
            </div>
            <p className="mt-1 whitespace-pre-line text-sm leading-6 text-zinc-700">
              {c.body}
            </p>
          </li>
        ))}
      </ul>

      <form onSubmit={onSubmit} className="mt-6 space-y-3">
        <p className="text-sm font-medium text-zinc-700">Deixe um comentário</p>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Seu nome"
          maxLength={60}
          required
          className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 outline-none focus:border-emerald-500"
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Escreva algo legal…"
          rows={3}
          maxLength={2000}
          required
          className="w-full resize-y rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 outline-none focus:border-emerald-500"
        />
        {/* honeypot invisível */}
        <input
          value={trap}
          onChange={(e) => setTrap(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden
          className="hidden"
        />
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={sending}
            className="rounded-lg bg-emerald-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 active:scale-[0.97] disabled:opacity-50"
          >
            {sending ? "Enviando…" : "Comentar"}
          </button>
          {msg && <span className="text-sm text-zinc-600">{msg}</span>}
        </div>
      </form>
    </section>
  );
}
