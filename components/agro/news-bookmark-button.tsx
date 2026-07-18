"use client";

import { useEffect, useState } from "react";
import { Bookmark } from "lucide-react";

import {
  saveBookmark,
  removeBookmark,
  isBookmarked,
} from "@/lib/agro/supabase/save-bookmark";

type NewsBookmarkButtonProps = {
  id: string | number;
  title: string;
  description: string;
  source: string;
  category: string;
  url: string;
};

export default function NewsBookmarkButton({
  id,
  title,
  description,
  source,
  category,
  url,
}: NewsBookmarkButtonProps) {
  const [saved, setSaved] = useState(false);
  const [loadingBookmark, setLoadingBookmark] = useState(false);

  useEffect(() => {
    async function loadBookmark() {
      const bookmarked = await isBookmarked(id);
      setSaved(bookmarked);
    }

    loadBookmark();
  }, [id]);

  async function toggleBookmark() {
    if (loadingBookmark) return;

    setLoadingBookmark(true);

    try {
      if (saved) {
        await removeBookmark(id);
        setSaved(false);

        return;
      }

      const result = await saveBookmark({
        id,
        title,
        description,
        source,
        category,
        url,
      });

      if (!result) {
        setSaved(false);
        return;
      }

      setSaved(true);
    } finally {
      setLoadingBookmark(false);
    }
  }

  return (
    <button
      type="button"
      disabled={loadingBookmark}
      onClick={toggleBookmark}
      className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition active:scale-[0.97] ${
        saved
          ? "border-emerald-600/40 bg-emerald-50 text-emerald-700"
          : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 disabled:cursor-not-allowed disabled:opacity-60"
      }`}
    >
      <Bookmark
        size={16}
        fill={saved ? "currentColor" : "none"}
        className={loadingBookmark ? "animate-pulse" : ""}
      />

      {saved ? "Salvo" : "Salvar"}
    </button>
  );
}
