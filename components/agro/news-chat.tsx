"use client";

import { useEffect, useRef, useState } from "react";
import { Send, Sparkles } from "lucide-react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type Props = {
  newsId: string;
};

const SUGGESTIONS = [
  "Resuma essa notícia em uma frase.",
  "Por que isso é importante para o produtor?",
  "Quem é afetado por essa novidade?",
];

const MAX_INPUT_LENGTH = 500;

export default function NewsChat({ newsId }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollRef.current;

    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages, loading]);

  async function sendMessage(text: string) {
    const content = text.trim().slice(0, MAX_INPUT_LENGTH);

    if (!content || loading) return;

    const nextMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content },
    ];

    setMessages(nextMessages);
    setInput("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/agro/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          newsId,
          messages: nextMessages.slice(-10),
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.reply) {
        setError(
          data?.error ||
            "O assistente está indisponível no momento. Tente de novo em instantes."
        );
        return;
      }

      setMessages([
        ...nextMessages,
        { role: "assistant", content: data.reply },
      ]);
    } catch {
      setError(
        "O assistente está indisponível no momento. Tente de novo em instantes."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mt-10 rounded-xl border border-zinc-200 bg-white p-6 sm:p-8">
      <div className="flex items-center gap-2">
        <Sparkles size={16} className="text-emerald-600" />

        <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
          Pergunte à IA
        </span>
      </div>

      <p className="mt-3 text-sm text-zinc-500">
        Tire dúvidas sobre esta notícia. O assistente responde com base no
        conteúdo da matéria.
      </p>

      {messages.length === 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              disabled={loading}
              onClick={() => sendMessage(suggestion)}
              className="rounded-full border border-zinc-200 bg-white px-3.5 py-1.5 text-xs font-medium text-zinc-600 transition hover:border-emerald-600/40 hover:text-emerald-700 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {messages.length > 0 && (
        <div
          ref={scrollRef}
          className="mt-4 flex max-h-96 flex-col gap-3 overflow-y-auto pr-1"
        >
          {messages.map((message, index) => (
            <div
              key={index}
              className={`max-w-[85%] rounded-xl px-4 py-2.5 text-sm leading-6 ${
                message.role === "user"
                  ? "self-end bg-emerald-600 text-white"
                  : "self-start border border-zinc-200 bg-zinc-50 text-zinc-700"
              }`}
            >
              {message.content}
            </div>
          ))}

          {loading && (
            <div className="self-start rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-400">
              <span className="animate-pulse">Pensando...</span>
            </div>
          )}
        </div>
      )}

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <form
        onSubmit={(event) => {
          event.preventDefault();
          sendMessage(input);
        }}
        className="mt-4 flex gap-2"
      >
        <input
          type="text"
          value={input}
          maxLength={MAX_INPUT_LENGTH}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Escreva sua dúvida sobre a notícia..."
          aria-label="Sua pergunta sobre a notícia"
          className="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-600 focus:outline-none"
        />

        <button
          type="submit"
          disabled={loading || !input.trim()}
          aria-label="Enviar pergunta"
          className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Send size={15} />
          <span className="hidden sm:inline">Enviar</span>
        </button>
      </form>
    </section>
  );
}
