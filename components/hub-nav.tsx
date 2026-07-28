"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/locale-switcher";

export type NavItem = {
  href: string;
  label: string;
  external?: boolean;
  accent?: boolean;
};

function ItemLink({
  item,
  onClick,
  block,
}: {
  item: NavItem;
  onClick?: () => void;
  block?: boolean;
}) {
  const cls = `${block ? "block rounded-lg px-3 py-2 hover:bg-zinc-50" : ""} text-sm font-medium transition ${
    item.accent
      ? "text-emerald-700 hover:text-emerald-600"
      : "text-zinc-600 hover:text-zinc-900"
  }`;

  if (item.external) {
    return (
      <a href={item.href} onClick={onClick} className={cls}>
        {item.label}
      </a>
    );
  }
  return (
    <Link href={item.href} onClick={onClick} className={cls}>
      {item.label}
    </Link>
  );
}

export function HubNav({ items }: { items: NavItem[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative flex items-center gap-2 sm:gap-3">
      {/* Desktop */}
      <nav className="hidden items-center gap-4 sm:flex">
        {items.map((item) => (
          <ItemLink key={item.href} item={item} />
        ))}
        <LocaleSwitcher />
      </nav>

      {/* Mobile: idioma + hambúrguer */}
      <div className="flex items-center gap-2 sm:hidden">
        <LocaleSwitcher />
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
          aria-expanded={open}
          className="rounded-lg border border-zinc-200 bg-white p-2 text-zinc-600 transition hover:border-zinc-300 active:scale-95"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Dropdown mobile */}
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-52 rounded-xl border border-zinc-200 bg-white p-1.5 shadow-lg sm:hidden">
          {items.map((item) => (
            <ItemLink
              key={item.href}
              item={item}
              block
              onClick={() => setOpen(false)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
