-- Pedidos de anúncio (formulário do /anuncie). Rodar no projeto Supabase
-- xbdfxifdfepxnvunyupd. Qualquer um envia; só a dona lê e apaga (leads privados).

create table if not exists public.ad_requests (
    id uuid primary key default gen_random_uuid(),
    plan text,
    name text not null,
    contact text not null,
    ad_url text,
    message text,
    created_at timestamptz not null default now()
);

create index if not exists ad_requests_created_idx
    on public.ad_requests (created_at desc);

alter table public.ad_requests enable row level security;

-- Qualquer visitante pode enviar um pedido (com limites anti-lixo)
drop policy if exists "ad_requests enviar" on public.ad_requests;
create policy "ad_requests enviar"
    on public.ad_requests for insert
    to anon, authenticated
    with check (
        char_length(name) between 1 and 120
        and char_length(contact) between 1 and 200
        and char_length(coalesce(message, '')) <= 2000
        and char_length(coalesce(ad_url, '')) <= 500
    );

-- Só a dona lê os leads (privados)
drop policy if exists "ad_requests leitura da dona" on public.ad_requests;
create policy "ad_requests leitura da dona"
    on public.ad_requests for select
    to authenticated
    using ((auth.jwt() ->> 'email') = 'mariane.r.belini@gmail.com');

-- Só a dona apaga
drop policy if exists "ad_requests apagar da dona" on public.ad_requests;
create policy "ad_requests apagar da dona"
    on public.ad_requests for delete
    to authenticated
    using ((auth.jwt() ->> 'email') = 'mariane.r.belini@gmail.com');
