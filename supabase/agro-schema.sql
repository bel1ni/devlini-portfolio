-- Esquema completo do BELAGRO (referência) — projeto Supabase
-- xbdfxifdfepxnvunyupd (o mesmo do Tech Journal; tabelas prefixadas).
-- Já aplicado em 19/07/2026 + migração da coluna uf.

create table if not exists public.agro_news (
    id text primary key,
    title_en text,
    title_pt text,
    description_en text,
    description_pt text,
    ai_summary_en text,
    ai_summary_pt text,
    url text not null,
    source text,
    category text,
    language text,
    impact integer not null default 50,
    featured boolean not null default false,
    logo text,
    published_at timestamptz,
    uf text,
    created_at timestamptz not null default now()
);

create index if not exists agro_news_impact_idx
    on public.agro_news (impact desc);

create index if not exists agro_news_published_at_idx
    on public.agro_news (published_at desc);

create index if not exists agro_news_category_idx
    on public.agro_news (category);

create index if not exists agro_news_uf_idx
    on public.agro_news (uf);

alter table public.agro_news enable row level security;

drop policy if exists "agro_news leitura pública" on public.agro_news;
create policy "agro_news leitura pública"
    on public.agro_news for select
    using (true);

drop policy if exists "agro_news escrita da ingestão" on public.agro_news;
create policy "agro_news escrita da ingestão"
    on public.agro_news for insert
    with check (true);

drop policy if exists "agro_news atualização da ingestão" on public.agro_news;
create policy "agro_news atualização da ingestão"
    on public.agro_news for update
    using (true)
    with check (true);

create table if not exists public.agro_bookmarks (
    id bigint generated always as identity primary key,
    user_id uuid not null references auth.users (id) on delete cascade,
    news_id text not null,
    title text,
    description text,
    image text,
    source text,
    category text,
    url text,
    created_at timestamptz not null default now(),
    unique (user_id, news_id)
);

alter table public.agro_bookmarks enable row level security;

drop policy if exists "agro_bookmarks do próprio usuário" on public.agro_bookmarks;
create policy "agro_bookmarks do próprio usuário"
    on public.agro_bookmarks for all
    to authenticated
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

create table if not exists public.agro_subscribers (
    email text primary key,
    token uuid not null default gen_random_uuid(),
    created_at timestamptz not null default now()
);

create index if not exists agro_subscribers_token_idx
    on public.agro_subscribers (token);

alter table public.agro_subscribers enable row level security;
