-- Migração AGROLINI — filtro por estado (UF) + limpeza.
-- Execute no SQL Editor do MESMO projeto Supabase onde rodou o schema
-- inicial (xbdfxifdfepxnvunyupd, o do Tech Journal).

-- 1) Coluna de estado para o filtro por UF
alter table public.agro_news
    add column if not exists uf text;

create index if not exists agro_news_uf_idx
    on public.agro_news (uf);

-- 2) IMPORTANTE: remove itens indevidos que o feed do IDR-Paraná trouxe
-- (páginas de cadastro com nome/número de pessoas — a fonte já foi
-- substituída no código pelo "Giro Paraná", isso não volta a acontecer)
delete from public.agro_news where source = 'IDR-Paraná';
