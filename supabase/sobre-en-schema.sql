-- Versão em inglês da página /sobre. Rodar no projeto xbdfxifdfepxnvunyupd.
-- Adiciona colunas _en e traduz o conteúdo atual. A página cai no pt quando o
-- campo em inglês estiver vazio. Depois, edite o inglês pelo painel /sobre/editar.

alter table public.about_profile add column if not exists positioning_en text;
alter table public.about_profile add column if not exists intro_en text;
alter table public.about_profile add column if not exists availability_headline_en text;
alter table public.about_profile add column if not exists availability_note_en text;
alter table public.about_profile add column if not exists roles_en text[] not null default '{}';

alter table public.about_entries add column if not exists title_en text;
alter table public.about_entries add column if not exists body_en text;
alter table public.about_entries add column if not exists tag_en text;

-- ── Perfil ──────────────────────────────────────────────────────────────────
update public.about_profile set
    positioning_en = 'Full-stack developer',
    intro_en = 'I turn ideas into reality. I built controledegado.app, a livestock-management app that went from the first database schema to the Google Play Store, and BELAGRO, an agribusiness news portal with AI-powered curation and summaries. I learn by shipping: every project of mine is live and in use.',
    availability_headline_en = 'Open to new opportunities',
    availability_note_en = 'Remote · available to start',
    roles_en = array['Full-Stack Developer','Mobile / React Native','Games','SaaS']
where id = 1;

-- ── Skills (casa pelo título) ───────────────────────────────────────────────
update public.about_entries set title_en = 'Front-end',
    body_en = 'Fast, accessible interfaces with attention to detail.'
    where section = 'skill' and title = 'Front-end';

update public.about_entries set title_en = 'Mobile',
    body_en = 'From prototype to publishing on Google Play.'
    where section = 'skill' and title = 'Mobile';

update public.about_entries set title_en = 'Back-end & data',
    body_en = 'APIs, data modeling and end-to-end authentication.'
    where section = 'skill' and title = 'Back-end & dados';

update public.about_entries set title_en = 'Applied AI',
    body_en = 'Using language models to solve real problems, with cost under control.'
    where section = 'skill' and title = 'IA aplicada';

update public.about_entries set title_en = 'Games',
    body_en = 'I create Roblox experiences as a hobby, for fun.'
    where section = 'skill' and title = 'Games';

-- ── Destaques (casa pelo título) ────────────────────────────────────────────
update public.about_entries set
    body_en = 'Livestock-management SaaS for farmers, built from scratch and published on Google Play. Animals, weighing and handling on your phone.',
    tag_en = 'Founder & solo dev'
    where section = 'highlight' and title = 'controledegado.app';

update public.about_entries set
    body_en = 'An agribusiness news portal that aggregates dozens of sources and uses AI to summarize and prioritize what matters to the producer.',
    tag_en = 'Own product'
    where section = 'highlight' and title = 'BELAGRO';

-- ── Aprendendo agora (casa pelo título) ─────────────────────────────────────
update public.about_entries set
    title_en = 'studio.dev — game development in Roblox Studio',
    body_en = 'A course on building games with Roblox Studio (Luau). Exploring game logic, physics and player experience.'
    where section = 'learning' and title like 'studio.dev%';

-- ── História (casa pelo início do texto) ────────────────────────────────────
update public.about_entries set
    body_en = 'I started programming out of a desire to solve real problems. controledegado.app was born from that: turning the paper notebook into a simple livestock-management app. I handled everything — data modeling, back-end, interface, the mobile app and publishing to the store.'
    where section = 'story' and body like 'Comecei programando%';

update public.about_entries set
    body_en = 'I like owning the whole stack because it makes me autonomous: I can take a vague idea and carry it to a working product, deciding architecture, design and trade-offs along the way. I have a special taste for applying AI in useful ways. On BELAGRO, I use AI to summarize and filter agribusiness news that can make a difference for the producer.'
    where section = 'story' and body like 'Gosto de dominar%';

update public.about_entries set
    body_en = 'I''m always building and learning something new — this site is part of that.'
    where section = 'story' and body like 'Estou sempre construindo%';
