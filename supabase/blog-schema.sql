-- Blog / diário editável pelo painel /blog/editar (login Google).
-- Rodar no projeto Supabase xbdfxifdfepxnvunyupd (o mesmo do /sobre e /projetos).

create table if not exists public.posts (
    id uuid primary key default gen_random_uuid(),
    slug text unique not null,
    title text not null,
    excerpt text,
    cover_url text,
    body text,
    published boolean not null default false,
    published_at timestamptz not null default now(),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists posts_published_at_idx on public.posts (published_at desc);

alter table public.posts enable row level security;

drop policy if exists "posts leitura pública" on public.posts;
create policy "posts leitura pública"
    on public.posts for select using (true);

drop policy if exists "posts escrita da dona" on public.posts;
create policy "posts escrita da dona"
    on public.posts for all
    to authenticated
    using ((auth.jwt() ->> 'email') = 'mariane.r.belini@gmail.com')
    with check ((auth.jwt() ->> 'email') = 'mariane.r.belini@gmail.com');

-- Bucket de imagens (idempotente; o mesmo usado pelos projetos).
insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', true)
on conflict (id) do nothing;

-- Seed: um primeiro post (edite/publique pelo painel).
insert into public.posts (slug, title, excerpt, body, published, published_at)
values (
    'comecei-a-estudar-roblox-studio',
    'Comecei a estudar desenvolvimento de jogos no Roblox Studio',
    'Entrei no studio.dev para aprender a criar jogos no Roblox Studio com a linguagem Lua. Primeiras impressões.',
    E'Comecei o curso studio.dev, focado em criação de jogos no Roblox Studio.\n\nA proposta é aprender do zero: lógica de jogo, física, scripts em Lua e a experiência do jogador. Estou animada porque é uma forma diferente de programar — pensar em interação, diversão e ritmo, não só em telas e dados.\n\nVou registrando aqui o que for aprendendo. 🎮',
    false,
    now()
)
on conflict (slug) do nothing;
