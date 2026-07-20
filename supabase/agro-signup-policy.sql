-- Deixa o formulário de inscrição do briefing funcionar SEM a service-role key.
-- anon pode SÓ inserir e-mail; ler/editar/apagar a lista continua bloqueado
-- (os e-mails dos inscritos seguem protegidos — LGPD).
-- Rode no SQL Editor do projeto xbdfxifdfepxnvunyupd (o do Tech Journal).

drop policy if exists "agro_subscribers inscrição anon" on public.agro_subscribers;
create policy "agro_subscribers inscrição anon"
    on public.agro_subscribers for insert
    to anon
    with check (true);
