"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export default function SearchBox() {
  const [search, setSearch] = useState("");
  const router = useRouter();

  function handleSearch() {
    if (search.trim()) {
      router.push(`/agro?q=${encodeURIComponent(search.trim())}#noticias`);
    } else {
      router.push("/agro");
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSearch();
      }}
      className="flex w-full max-w-md items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2.5 transition focus-within:border-emerald-600"
    >
      <Search className="size-4 shrink-0 text-zinc-400" />

      <input
        type="text"
        placeholder="Buscar notícias do agro"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full min-w-0 bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-400"
      />
    </form>
  );
}
