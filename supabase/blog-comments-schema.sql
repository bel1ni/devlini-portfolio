-- Comentários dos posts do blog. Rodar no projeto Supabase xbdfxifdfepxnvunyupd.
-- Leitura pública; qualquer visitante pode comentar (com limites); só a dona apaga.

create table if not exists public.post_comments (
    id uuid primary key default gen_random_uuid(),
    post_slug text not null,
    author_name text not null,
    body text not null,
    created_at timestamptz not null default now()
);

create index if not exists post_comments_slug_idx
    on public.post_comments (post_slug, created_at desc);

alter table public.post_comments enable row level security;

-- Leitura pública
drop policy if exists "post_comments leitura pública" on public.post_comments;
create policy "post_comments leitura pública"
    on public.post_comments for select using (true);

-- Qualquer um pode comentar, com limites de tamanho (anti-lixo básico)
drop policy if exists "post_comments comentar" on public.post_comments;
create policy "post_comments comentar"
    on public.post_comments for insert
    to anon, authenticated
    with check (
        char_length(author_name) between 1 and 60
        and char_length(body) between 1 and 2000
        and char_length(post_slug) between 1 and 200
    );

-- Só a dona apaga (moderação)
drop policy if exists "post_comments apagar da dona" on public.post_comments;
create policy "post_comments apagar da dona"
    on public.post_comments for delete
    to authenticated
    using ((auth.jwt() ->> 'email') = 'mariane.r.belini@gmail.com');
