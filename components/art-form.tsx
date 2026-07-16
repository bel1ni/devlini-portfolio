"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";

export function ArtForm({ token }: { token: string }) {
  const t = useTranslations("artForm");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">(
    "idle",
  );
  const [errorKey, setErrorKey] = useState<string>("genericError");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    const form = new FormData(e.currentTarget);
    form.set("token", token);
    const res = await fetch("/api/ads/art", { method: "POST", body: form });
    if (res.ok) {
      setState("done");
    } else {
      const data = (await res.json().catch(() => null)) as {
        error?: string;
      } | null;
      setErrorKey(
        data?.error === "image_too_large" ? "imageTooLarge" : "genericError",
      );
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-sm leading-relaxed text-emerald-800">
        {t("success")}
      </div>
    );
  }

  const inputClass =
    "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-emerald-600";

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5 text-sm font-medium text-zinc-700">
        {t("fieldTitle")}
        <input
          name="title"
          required
          maxLength={40}
          className={inputClass}
          placeholder={t("fieldTitlePlaceholder")}
        />
      </label>
      <label className="flex flex-col gap-1.5 text-sm font-medium text-zinc-700">
        {t("fieldDescription")}
        <input
          name="description"
          required
          maxLength={90}
          className={inputClass}
          placeholder={t("fieldDescriptionPlaceholder")}
        />
      </label>
      <label className="flex flex-col gap-1.5 text-sm font-medium text-zinc-700">
        {t("fieldUrl")}
        <input
          name="url"
          type="url"
          required
          className={inputClass}
          placeholder="https://"
        />
      </label>
      <label className="flex flex-col gap-1.5 text-sm font-medium text-zinc-700">
        {t("fieldImage")}
        <input
          name="image"
          type="file"
          accept="image/png,image/jpeg"
          required
          className="text-sm text-zinc-600 file:mr-3 file:rounded-lg file:border-0 file:bg-zinc-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-zinc-700"
        />
        <span className="text-xs font-normal text-zinc-400">
          {t("imageHint")}
        </span>
      </label>

      {state === "error" && (
        <p className="text-sm text-red-600">{t(errorKey)}</p>
      )}

      <button
        type="submit"
        disabled={state === "sending"}
        className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 active:scale-[0.97] disabled:opacity-50"
      >
        {state === "sending" ? t("sending") : t("submit")}
      </button>
    </form>
  );
}
