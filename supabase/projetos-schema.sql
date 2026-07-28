-- Projetos (cases) editáveis pelo painel /projetos/editar (login Google).
-- Rodar uma vez no SQL Editor do projeto Supabase xbdfxifdfepxnvunyupd
-- (o MESMO do login e das tabelas agro_*/about_* — NÃO o projeto dos anúncios).

-- ── Tabela ──────────────────────────────────────────────────────────────────
create table if not exists public.projects (
    id uuid primary key default gen_random_uuid(),
    slug text unique not null,
    name text not null,
    summary text,
    cover_url text,
    tech text[] not null default '{}',
    -- 'live' | 'building' | 'paused'
    status text not null default 'live',
    live_url text,
    repo_url text,
    -- Corpo do case (cada um vira uma seção; vazio some)
    problem text,
    solution text,
    role text,
    result text,
    position int not null default 0,
    published boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists projects_position_idx on public.projects (position);

alter table public.projects enable row level security;

drop policy if exists "projects leitura pública" on public.projects;
create policy "projects leitura pública"
    on public.projects for select using (true);

drop policy if exists "projects escrita da dona" on public.projects;
create policy "projects escrita da dona"
    on public.projects for all
    to authenticated
    using ((auth.jwt() ->> 'email') = 'mariane.r.belini@gmail.com')
    with check ((auth.jwt() ->> 'email') = 'mariane.r.belini@gmail.com');

-- ── Storage: bucket público para as imagens dos projetos ────────────────────
insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', true)
on conflict (id) do nothing;

drop policy if exists "project-images leitura pública" on storage.objects;
create policy "project-images leitura pública"
    on storage.objects for select
    using (bucket_id = 'project-images');

drop policy if exists "project-images escrita da dona" on storage.objects;
create policy "project-images escrita da dona"
    on storage.objects for insert
    to authenticated
    with check (
        bucket_id = 'project-images'
        and (auth.jwt() ->> 'email') = 'mariane.r.belini@gmail.com'
    );

drop policy if exists "project-images update da dona" on storage.objects;
create policy "project-images update da dona"
    on storage.objects for update
    to authenticated
    using (
        bucket_id = 'project-images'
        and (auth.jwt() ->> 'email') = 'mariane.r.belini@gmail.com'
    );

drop policy if exists "project-images delete da dona" on storage.objects;
create policy "project-images delete da dona"
    on storage.objects for delete
    to authenticated
    using (
        bucket_id = 'project-images'
        and (auth.jwt() ->> 'email') = 'mariane.r.belini@gmail.com'
    );

-- ── Seed: seus dois projetos como ponto de partida (edite/complete depois) ──
insert into public.projects (slug, name, summary, tech, status, live_url, problem, solution, role, result, position)
values
    (
        'controledegado',
        'controledegado.app',
        'SaaS de gestão de rebanho para produtores rurais — animais, pesagens e manejo no celular, construído do zero e publicado na Google Play.',
        array['React Native','TypeScript','Supabase','PostgreSQL','PWA'],
        'live',
        'https://controledegado.app',
        'O produtor rural controla o rebanho no caderno: dados soltos, difíceis de consultar e fáceis de perder. Faltava uma ferramenta simples, feita para quem está no campo.',
        'Um app de gestão de rebanho direto ao ponto: cadastro de animais, pesagens e manejo, com sincronização e acesso pelo celular. Assinatura mensal.',
        'Construí sozinha, de ponta a ponta: modelagem do banco, back-end, interface, o app mobile e a publicação na loja.',
        'App no ar e sendo usado por produtores, publicado na Google Play.',
        0
    ),
    (
        'belagro',
        'BELAGRO',
        'Portal de notícias do agronegócio que agrega dezenas de fontes e usa IA para resumir e priorizar o que importa para o produtor.',
        array['Next.js','Supabase','OpenRouter','TypeScript'],
        'live',
        'https://devlini.com/agro',
        'O produtor não tem tempo de acompanhar dezenas de sites de notícia do agro para saber o que realmente importa para ele.',
        'Um agregador que coleta notícias de muitas fontes, resume e prioriza com IA, com alertas por estado (clima do INMET, sanidade, crédito) e briefing diário por e-mail.',
        'Idealizei e construí todo o produto: ingestão das fontes, curadoria e resumo por IA, feed, alertas e o briefing.',
        'No ar em devlini.com/agro, atualizado automaticamente todos os dias.',
        1
    )
on conflict (slug) do nothing;
