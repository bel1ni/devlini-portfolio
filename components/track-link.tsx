"use client";

import { track } from "@vercel/analytics";
import type { AnchorHTMLAttributes, ReactNode } from "react";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  event: string;
  eventData?: Record<string, string>;
  children: ReactNode;
};

/** Âncora que dispara um evento de analytics no clique (PRD §4.2/§4.8).
 *  Abre em nova aba por padrão (target="_blank"); sobrescreva via props se preciso. */
export function TrackLink({
  event,
  eventData,
  children,
  target = "_blank",
  rel = "noopener",
  ...props
}: Props) {
  return (
    <a {...props} target={target} rel={rel} onClick={() => track(event, eventData)}>
      {children}
    </a>
  );
}
