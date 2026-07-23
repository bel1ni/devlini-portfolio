"use client";

import { useState } from "react";
import { ArrowRightLeft } from "lucide-react";
import type { Locale } from "@/i18n/routing";
import { CopyButton } from "./copy-button";

const copy = {
  pt: {
    encode: "Codificar",
    decode: "Decodificar",
    inputEncode: "Texto para codificar",
    inputDecode: "Base64 para decodificar",
    output: "Resultado",
    invalid: "Base64 inválido.",
    placeholder: "Digite ou cole aqui…",
  },
  en: {
    encode: "Encode",
    decode: "Decode",
    inputEncode: "Text to encode",
    inputDecode: "Base64 to decode",
    output: "Result",
    invalid: "Invalid Base64.",
    placeholder: "Type or paste here…",
  },
};

// Base64 com suporte a UTF-8 (btoa/atob sozinhos quebram com acentos).
function encodeUtf8(text: string) {
  return btoa(String.fromCharCode(...new TextEncoder().encode(text)));
}
function decodeUtf8(b64: string) {
  const binary = atob(b64.trim());
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export default function Base64Tool({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("");

  let output = "";
  let error = "";
  if (input) {
    try {
      output = mode === "encode" ? encodeUtf8(input) : decodeUtf8(input);
    } catch {
      error = mode === "decode" ? t.invalid : "";
    }
  }

  return (
    <div className="space-y-4">
      <div className="inline-flex rounded-lg border border-zinc-200 bg-white p-1">
        {(["encode", "decode"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`rounded-md px-4 py-1.5 text-sm font-medium transition ${
              mode === m
                ? "bg-emerald-600 text-white"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            {m === "encode" ? t.encode : t.decode}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-center">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-zinc-700">
            {mode === "encode" ? t.inputEncode : t.inputDecode}
          </span>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.placeholder}
            rows={6}
            className="w-full resize-y rounded-xl border border-zinc-200 bg-white p-3 font-mono text-sm text-zinc-900 outline-none focus:border-emerald-500"
          />
        </label>

        <ArrowRightLeft
          size={20}
          className="mx-auto hidden shrink-0 text-zinc-300 md:block"
        />

        <label className="block">
          <span className="mb-1 flex items-center justify-between text-sm font-medium text-zinc-700">
            {t.output}
            {output && <CopyButton value={output} locale={locale} />}
          </span>
          <textarea
            value={error || output}
            readOnly
            rows={6}
            className={`w-full resize-y rounded-xl border p-3 font-mono text-sm outline-none ${
              error
                ? "border-red-200 bg-red-50 text-red-600"
                : "border-zinc-200 bg-zinc-50 text-zinc-900"
            }`}
          />
        </label>
      </div>
    </div>
  );
}
