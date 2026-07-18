"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const CONSENT_KEY = "agro-journal-cookie-consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      if (!localStorage.getItem(CONSENT_KEY)) {
        setVisible(true);
      }
    }, 0);

    return () => window.clearTimeout(timeout);
  }, []);

  function acceptCookies() {
    localStorage.setItem(CONSENT_KEY, String(Date.now()));
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4 sm:px-6">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-lg sm:flex-row">
        <p className="text-sm leading-6 text-zinc-600">
          Usamos cookies para melhorar sua experiência e exibir anúncios. Ao
          continuar navegando, você concorda com nossa{" "}
          <Link
            href="/agro/privacidade"
            className="font-medium text-emerald-700 underline underline-offset-2 hover:text-emerald-600"
          >
            Política de Privacidade
          </Link>
          .
        </p>

        <button
          type="button"
          onClick={acceptCookies}
          className="w-full shrink-0 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 active:scale-[0.97] sm:w-auto"
        >
          Entendi
        </button>
      </div>
    </div>
  );
}
