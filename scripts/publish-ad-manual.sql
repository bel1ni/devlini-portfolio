-- Publicar um anúncio vendido manualmente (por e-mail/DM), sem Stripe.
-- Rode no SQL Editor do Supabase. O card entra no ar em até 5 min (ISR)
-- e SAI DO AR SOZINHO quando ends_at passa — sem precisar de redeploy.
--
-- Edite os valores marcados e rode:

INSERT INTO ads (
  stripe_session_id, email, plan, duration_days, token,
  title, description, url, image_url,
  slot, status, starts_at, ends_at
)
VALUES (
  'manual-' || gen_random_uuid(),        -- venda manual: id único automático
  'anunciante@email.com',                -- EDITAR: e-mail do anunciante
  'month',                               -- EDITAR: week | month | quarter
  30,                                    -- EDITAR: 7 | 30 | 90 (dias)
  gen_random_uuid()::text,
  'Nome do produto',                     -- EDITAR: título (até 40 caracteres)
  'O que ele faz, em uma linha',         -- EDITAR: descrição (até 90 caracteres)
  'https://sitedoanunciante.com',        -- EDITAR: link de destino
  NULL,                                  -- EDITAR: URL da imagem, ou NULL sem imagem
  1,                                     -- EDITAR: slot 1, 2 ou 3 (livre)
  'ativo',
  now(),
  now() + make_interval(days => 30)     -- EDITAR: mesmo nº de dias acima
);

-- Conferir o que está no ar:
-- SELECT slot, title, ends_at FROM ads WHERE status = 'ativo' AND ends_at > now() ORDER BY slot;

-- Tirar um anúncio do ar antes da hora:
-- UPDATE ads SET status = 'expirado' WHERE id = <ID>;
