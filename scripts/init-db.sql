-- Painel self-serve de anúncios (PRD §4.6)
-- Rode uma vez no SQL Editor do Supabase (Dashboard → SQL Editor → New query).

CREATE TABLE IF NOT EXISTS ads (
  id serial PRIMARY KEY,
  stripe_session_id text UNIQUE NOT NULL,
  email text NOT NULL,
  plan text NOT NULL,
  duration_days int NOT NULL,
  token text UNIQUE NOT NULL,
  title text,
  description text,
  url text,
  image_url text,
  slot int,
  status text NOT NULL DEFAULT 'pendente_arte',
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ads_active_idx ON ads (status, ends_at);
