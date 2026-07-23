-- Permite apagar SÓ notícias antigas (mais de 14 dias) da tabela agro_news.
-- A ingestão (pruneOldNews em lib/agro/supabase/save-news.ts) usa isto para
-- manter o banco enxuto. A condição no USING garante que nem a chave anon nem
-- ninguém consiga apagar notícia recente — só o que já saiu do feed.
--
-- Rodar uma vez no SQL Editor do projeto Supabase xbdfxifdfepxnvunyupd.

drop policy if exists "agro_news limpeza de antigas" on public.agro_news;
create policy "agro_news limpeza de antigas"
    on public.agro_news for delete
    using (published_at < now() - interval '14 days');
