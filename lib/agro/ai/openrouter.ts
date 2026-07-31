// Cliente único do OpenRouter para toda a IA do BELAGRO.
// IMPORTANTE: só modelos GRATUITOS (sufixo :free). O "openrouter/auto" roteava
// para modelos PAGOS e gerou dívida — nunca voltar a usá-lo aqui.
// Tenta uma lista em ordem: se um der 429 (rate limit), 404 (removido) ou vier
// vazio (modelo de reasoning que gasta os tokens "pensando"), cai no próximo.

const FREE_MODELS = [
  "nvidia/nemotron-nano-12b-v2-vl:free",
  "google/gemma-4-31b-it:free",
  "google/gemma-4-26b-a4b-it:free",
  "nvidia/nemotron-nano-9b-v2:free",
  "nvidia/nemotron-3-super-120b-a12b:free",
] as const;

type Message = { role: "system" | "user" | "assistant"; content: string };

type Options = {
  maxTokens?: number;
  temperature?: number;
  timeoutMs?: number;
};

// Devolve o texto da resposta, ou null se todos os modelos gratuitos falharem.
export async function chatCompletion(
  messages: Message[],
  { maxTokens = 700, temperature = 0.4, timeoutMs = 25_000 }: Options = {}
): Promise<string | null> {
  const apiKey = process.env.OPENROUTER_API_KEY?.trim();
  if (!apiKey) {
    console.warn("OPENROUTER_API_KEY não encontrada");
    return null;
  }

  for (const model of FREE_MODELS) {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ model, messages, max_tokens: maxTokens, temperature }),
        signal: AbortSignal.timeout(timeoutMs),
      });

      if (!response.ok) {
        // 429 rate limit / 404 removido / 402 crédito — tenta o próximo modelo
        console.warn(`OpenRouter ${model}: ${response.status}`);
        continue;
      }

      const data = await response.json();
      const content = data?.choices?.[0]?.message?.content?.trim();
      if (content) return content;
      // vazio (modelo de reasoning consumiu os tokens) — tenta o próximo
    } catch (error) {
      console.warn(`OpenRouter ${model} falhou:`, error);
    }
  }

  return null;
}
