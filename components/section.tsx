import type { ReactNode } from "react";

export function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-10">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
        {title}
      </h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}
