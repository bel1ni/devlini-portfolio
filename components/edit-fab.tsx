"use client";

import { useEffect, useState } from "react";
import { Pencil } from "lucide-react";
import { getSession } from "@/lib/agro/supabase/get-session";
import { profile } from "@/content/site";

// Botão flutuante "Editar" que só aparece para a dona logada. Deixa a edição
// a um clique da página pública — feito para o dono, invisível para visitantes.
export function EditFab({ href, label = "Editar" }: { href: string; label?: string }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    getSession().then((s) => setShow(s?.user.email === profile.personalEmail));
  }, []);

  if (!show) return null;

  return (
    <a
      href={href}
      className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-1.5 rounded-full bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-zinc-700 active:scale-95"
    >
      <Pencil size={15} />
      {label}
    </a>
  );
}
