-- Conteúdo editável da página /sobre — a Mariane edita pelo painel /sobre/editar
-- (login Google), sem tocar no código. Rodar uma vez no SQL Editor do projeto
-- Supabase xbdfxifdfepxnvunyupd.
--
-- Segurança: leitura pública; escrita SÓ para o e-mail dela.

-- ── Perfil (linha única) ────────────────────────────────────────────────────
create table if not exists public.about_profile (
    id int primary key default 1,
    positioning text,
    intro text,
    availability_open boolean not null default true,
    availability_headline text,
    availability_note text,
    roles text[] not null default '{}',
    updated_at timestamptz not null default now(),
    constraint about_profile_singleton check (id = 1)
);

-- ── Itens das seções (história, skills, destaques, aprendizados) ────────────
create table if not exists public.about_entries (
    id uuid primary key default gen_random_uuid(),
    -- 'story' | 'skill' | 'highlight' | 'learning'
    section text not null,
    title text,
    body text,
    tag text,
    url text,
    items text[] not null default '{}',
    position int not null default 0,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists about_entries_section_idx
    on public.about_entries (section, position);

-- ── RLS ─────────────────────────────────────────────────────────────────────
alter table public.about_profile enable row level security;
alter table public.about_entries enable row level security;

-- Leitura pública
drop policy if exists "about_profile leitura pública" on public.about_profile;
create policy "about_profile leitura pública"
    on public.about_profile for select using (true);

drop policy if exists "about_entries leitura pública" on public.about_entries;
create policy "about_entries leitura pública"
    on public.about_entries for select using (true);

-- Escrita só da dona (e-mail no JWT). Troque o e-mail se mudar de conta.
drop policy if exists "about_profile escrita da dona" on public.about_profile;
create policy "about_profile escrita da dona"
    on public.about_profile for all
    to authenticated
    using ((auth.jwt() ->> 'email') = 'mariane.r.belini@gmail.com')
    with check ((auth.jwt() ->> 'email') = 'mariane.r.belini@gmail.com');

drop policy if exists "about_entries escrita da dona" on public.about_entries;
create policy "about_entries escrita da dona"
    on public.about_entries for all
    to authenticated
    using ((auth.jwt() ->> 'email') = 'mariane.r.belini@gmail.com')
    with check ((auth.jwt() ->> 'email') = 'mariane.r.belini@gmail.com');

-- ── Seed com o conteúdo atual (só na primeira vez) ──────────────────────────
insert into public.about_profile (id, positioning, intro, availability_open, availability_headline, availability_note, roles)
values (
    1,
    'Desenvolvedora full-stack que tira ideias do zero e coloca no ar — do banco de dados à loja de apps.',
    'Eu construo produtos de verdade, sozinha e de ponta a ponta. Criei o controledegado.app — um app de gestão de rebanho que foi do primeiro esquema de banco até a Google Play — e o BELAGRO, um portal de notícias do agronegócio com curadoria e resumos por inteligência artificial. Aprendo entregando: cada projeto meu está no ar, sendo usado.',
    true,
    'Aberta a novas oportunidades',
    'Remoto ou híbrido · disponível para começar',
    array['Desenvolvedora Full-Stack','Front-end','Mobile / React Native']
)
on conflict (id) do nothing;

insert into public.about_entries (section, title, body, tag, url, items, position)
values
    ('story', null, 'Comecei programando pela vontade de resolver problemas reais do campo, e não parei mais. O controledegado.app nasceu dessa raiz: transformar o caderno de anotações do pecuarista em um app simples de gestão de rebanho. Eu cuidei de tudo — modelagem de dados, back-end, interface, o app mobile e a publicação na loja.', null, null, '{}', 0),
    ('story', null, 'Gosto de dominar a stack inteira porque isso me deixa autônoma: consigo pegar uma ideia vaga e levá-la até um produto funcionando, decidindo arquitetura, design e trade-offs no caminho. Tenho paixão especial por aplicar inteligência artificial de um jeito útil — no BELAGRO, uso IA para resumir e curar notícias do agro.', null, null, '{}', 1),
    ('story', null, 'Construo em público e estou sempre aprendendo algo novo — este site é parte disso.', null, null, '{}', 2),
    ('skill', 'Front-end', 'Interfaces rápidas, acessíveis e caprichadas nos detalhes.', null, null, array['React','Next.js','TypeScript','Tailwind CSS'], 0),
    ('skill', 'Mobile', 'Do protótipo à publicação na Google Play.', null, null, array['React Native','PWA'], 1),
    ('skill', 'Back-end & dados', 'APIs, modelagem de dados e autenticação de ponta a ponta.', null, null, array['Node.js','Python','PostgreSQL','Supabase'], 2),
    ('skill', 'IA aplicada', 'Uso de modelos de linguagem para resolver problemas reais, com custo sob controle.', null, null, array['Integração de LLMs','Automação de conteúdo'], 3),
    ('highlight', 'controledegado.app', 'SaaS de gestão de rebanho para produtores rurais, construído do zero e publicado na Google Play. Animais, pesagens e manejo no celular.', 'Fundadora & dev única', 'https://controledegado.app', '{}', 0),
    ('highlight', 'BELAGRO', 'Portal de notícias do agronegócio que agrega dezenas de fontes e usa IA para resumir e priorizar o que importa para o produtor.', 'Produto próprio', '/agro', '{}', 1),
    ('learning', 'studio.dev — desenvolvimento de jogos no Roblox Studio', 'Curso de criação de jogos com Roblox Studio (linguagem Lua). Explorando lógica de jogo, física e experiência do jogador.', null, null, '{}', 0)
on conflict do nothing;
