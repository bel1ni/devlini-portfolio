import postgres from "postgres";
import { profile } from "@/content/site";

export type AdStatus =
  | "pendente_arte"
  | "em_revisao"
  | "ativo"
  | "expirado"
  | "rejeitado";

export type DbAd = {
  id: number;
  stripe_session_id: string;
  email: string;
  plan: string;
  duration_days: number;
  token: string;
  title: string | null;
  description: string | null;
  url: string | null;
  image_url: string | null;
  slot: number | null;
  status: AdStatus;
  starts_at: string | null;
  ends_at: string | null;
  created_at: string;
};

// Compatível com Supabase (use a connection string do pooler) e Neon.
// prepare: false é obrigatório no transaction pooler (pgbouncer) do Supabase.
// URL malformada não pode derrubar o build/site: degrada para desativado.
function createClient() {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  try {
    return postgres(url, { ssl: "require", prepare: false, max: 1 });
  } catch {
    console.error("DATABASE_URL inválida — painel de anúncios desativado");
    return null;
  }
}

const sql = createClient();

/** Painel de anúncios ativo apenas quando o banco está configurado. */
export const adsDbEnabled = sql !== null;

/** Anúncios ativos (expiração é resolvida na query — sem cron; PRD §4.6). */
export async function getActiveAds(): Promise<DbAd[]> {
  if (!sql) return [];
  try {
    return (await sql`
      SELECT * FROM ads
      WHERE status = 'ativo' AND ends_at > now()
      ORDER BY slot
    `) as DbAd[];
  } catch {
    return [];
  }
}

/** Cria o registro após o pagamento (idempotente por session_id). */
export async function ensureAdFromSession(input: {
  sessionId: string;
  email: string;
  plan: string;
  durationDays: number;
}): Promise<DbAd | null> {
  if (!sql) return null;
  const token = crypto.randomUUID();
  await sql`
    INSERT INTO ads (stripe_session_id, email, plan, duration_days, token)
    VALUES (${input.sessionId}, ${input.email}, ${input.plan}, ${input.durationDays}, ${token})
    ON CONFLICT (stripe_session_id) DO NOTHING
  `;
  const rows = (await sql`
    SELECT * FROM ads WHERE stripe_session_id = ${input.sessionId}
  `) as DbAd[];
  return rows[0] ?? null;
}

export async function getAdById(id: number): Promise<DbAd | null> {
  if (!sql) return null;
  const rows = (await sql`SELECT * FROM ads WHERE id = ${id}`) as DbAd[];
  return rows[0] ?? null;
}

export async function getAdByToken(token: string): Promise<DbAd | null> {
  if (!sql || !token) return null;
  const rows = (await sql`SELECT * FROM ads WHERE token = ${token}`) as DbAd[];
  return rows[0] ?? null;
}

/** Anunciante enviou a arte: entra na fila de revisão. */
export async function submitArt(
  token: string,
  data: { title: string; description: string; url: string; imageUrl: string },
): Promise<boolean> {
  if (!sql) return false;
  const rows = (await sql`
    UPDATE ads SET
      title = ${data.title},
      description = ${data.description},
      url = ${data.url},
      image_url = ${data.imageUrl},
      status = 'em_revisao'
    WHERE token = ${token} AND status IN ('pendente_arte', 'em_revisao')
    RETURNING id
  `) as { id: number }[];
  return rows.length > 0;
}

export async function listForReview(): Promise<DbAd[]> {
  if (!sql) return [];
  return (await sql`
    SELECT * FROM ads
    WHERE status IN ('em_revisao', 'ativo')
    ORDER BY status, created_at DESC
  `) as DbAd[];
}

/** Aprova e publica: atribui o primeiro slot livre e agenda a expiração. */
export async function approveAd(
  id: number,
): Promise<{ ok: boolean; reason?: string }> {
  if (!sql) return { ok: false, reason: "db_disabled" };
  const active = (await sql`
    SELECT slot FROM ads WHERE status = 'ativo' AND ends_at > now()
  `) as { slot: number }[];
  const used = new Set(active.map((r) => r.slot));
  const free = [1, 2, 3].find((n) => !used.has(n));
  if (!free) return { ok: false, reason: "sem_slot_livre" };
  await sql`
    UPDATE ads SET
      status = 'ativo',
      slot = ${free},
      starts_at = now(),
      ends_at = now() + make_interval(days => duration_days)
    WHERE id = ${id} AND status = 'em_revisao'
  `;
  return { ok: true };
}

/** Rejeita (reembolso é feito manualmente no dashboard do Stripe). */
export async function rejectAd(id: number): Promise<void> {
  if (!sql) return;
  await sql`UPDATE ads SET status = 'rejeitado' WHERE id = ${id}`;
}

/** Notificação por e-mail via Resend (best-effort; sem a chave, ignora). */
export async function notifyByEmail(input: {
  to: string;
  subject: string;
  html: string;
}): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return;
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM ?? "Link Hub <onboarding@resend.dev>",
        to: input.to,
        subject: input.subject,
        html: input.html,
      }),
    });
  } catch {
    // e-mail é opcional; falha não pode quebrar o fluxo de pagamento
  }
}

export const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? profile.email;

/** Diagnóstico da conexão, passo a passo (exposto em /api/db-health). */
export async function dbHealth() {
  if (!process.env.DATABASE_URL) {
    return { configured: false, parseable: false, connected: false, tableExists: false };
  }
  if (!sql) {
    return { configured: true, parseable: false, connected: false, tableExists: false };
  }
  try {
    await sql`SELECT 1`;
  } catch (e) {
    return {
      configured: true,
      parseable: true,
      connected: false,
      tableExists: false,
      reason: (e as Error).message.slice(0, 120),
    };
  }
  try {
    const rows = (await sql`SELECT count(*)::int AS n FROM ads`) as { n: number }[];
    return { configured: true, parseable: true, connected: true, tableExists: true, ads: rows[0].n };
  } catch {
    return { configured: true, parseable: true, connected: true, tableExists: false };
  }
}
