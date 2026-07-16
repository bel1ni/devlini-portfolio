import type { CSSProperties, ReactNode } from "react";

export function Section({
  title,
  children,
  className = "",
  style,
}: {
  title: string;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <section className={`mt-10 ${className}`} style={style}>
      <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
        {title}
      </h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}
