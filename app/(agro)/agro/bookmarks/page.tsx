"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { signInWithGoogle } from "@/lib/agro/supabase/auth";
import { getSession } from "@/lib/agro/supabase/get-session";
import {
  getUserBookmarks,
  removeBookmark,
} from "@/lib/agro/supabase/save-bookmark";

export default function BookmarksPage() {
  type BookmarkItem = {
    id: string;
    user_id: string;
    news_id: string;
    title: string;
    description: string;
    image?: string | null;
    source: string;
    category: string;
    slug?: string | null;
    url: string;
    created_at?: string | null;
  };

  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    async function loadBookmarks() {
      const session = await getSession();

      if (!session) {
        setIsLoggedIn(false);
        return;
      }

      setIsLoggedIn(true);

      const data = await getUserBookmarks();
      setBookmarks(data);
    }

    loadBookmarks();
  }, []);

  if (isLoggedIn === null) {
    return (
      <p className="mt-10 text-sm text-zinc-500">Carregando salvos...</p>
    );
  }

  return (
    <div className="mx-auto max-w-3xl py-8">
      <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
        Notícias salvas
      </h1>

      <p className="mt-1 text-sm text-zinc-500">
        Suas notícias favoritas para ler depois.
      </p>

      {!isLoggedIn ? (
        <div className="mt-8 rounded-xl border border-emerald-600/20 bg-emerald-50 p-8">
          <h2 className="text-lg font-semibold text-zinc-900">
            Entre para salvar suas notícias
          </h2>

          <p className="mt-2 text-sm text-zinc-600">
            Faça login com Google para criar sua lista pessoal de leitura no
            AGROLINI.
          </p>

          <button
            onClick={signInWithGoogle}
            className="mt-5 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 active:scale-[0.97]"
          >
            Entrar com Google
          </button>
        </div>
      ) : bookmarks.length === 0 ? (
        <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-8 text-sm text-zinc-500">
          Você ainda não salvou nenhuma notícia.
        </div>
      ) : (
        <div className="mt-8 grid gap-3">
          {bookmarks.map((bookmark) => (
            <Link
              key={`${bookmark.news_id}-${bookmark.created_at || bookmark.title}`}
              href={`/agro/news/${bookmark.news_id}`}
              className="block rounded-xl border border-zinc-200 bg-white p-5 transition hover:border-zinc-300 hover:shadow-sm"
            >
              <div className="mb-3 flex items-center gap-2">
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                  {bookmark.category || "Agro"}
                </span>

                <span className="text-xs text-zinc-400">
                  {bookmark.source || "Fonte"}
                </span>
              </div>

              <h2 className="text-base font-semibold leading-snug text-zinc-900">
                {bookmark.title}
              </h2>

              <p className="mt-2 line-clamp-3 text-sm leading-6 text-zinc-500">
                {bookmark.description || "Sem descrição disponível."}
              </p>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-zinc-400">
                  Clique para abrir a notícia
                </span>

                <button
                  onClick={async (e) => {
                    e.preventDefault();

                    await removeBookmark(bookmark.news_id);

                    setBookmarks((prev) =>
                      prev.filter((item) => item.news_id !== bookmark.news_id)
                    );
                  }}
                  className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100"
                >
                  Remover
                </button>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
