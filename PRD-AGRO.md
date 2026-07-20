# PRD — BELAGRO Parte 2: de portal de notícias a assistente do produtor

Status: rascunho para decisão (jul/2026). Parte 1 (agregador + briefing) está no ar.
Este documento define planos, anúncios, controle de acesso e o diferencial —
o que transforma o BELAGRO de "mais um site de notícias" em produto útil e rentável.

## 1. O problema e o diferencial

Sites de notícia agro existem aos montes e todos fazem a mesma coisa: publicam
manchetes. O produtor não tem tempo de ler 20 fontes. **O diferencial do BELAGRO
não é ter notícia — é dizer "o que VOCÊ precisa saber hoje, e o que fazer".**

Três coisas que ninguém entrega junto:
1. **Personalização por localização** — filtro por estado (já existe) evolui para
   "só o que importa pra MINHA região".
2. **Alertas acionáveis** (não manchete): prazo de vacinação/atualização de rebanho
   da sua UF, geada/seca chegando, nova linha de crédito, preço do boi/soja hoje.
3. **"Para o produtor:"** — cada item explica em uma frase o impacto prático
   (já está no prompt da IA). Linguagem de quem está no campo, não de economista.

Frase-âncora: *"O BELAGRO te avisa antes de você perder prazo ou dinheiro."*

## 2. Planos e o que cada um libera (entitlements)

Regra revenue-centric: **nunca lançar tier pago vazio**. Primeiro medir o que o
grátis usa (Analytics já ativo), depois cobrar pelo que já usam. Preços de
lançamento (validar com produtores reais antes de fixar):

| Recurso | Grátis | Produtor (~R$14,90/mês) | Fazenda (~R$29,90/mês) |
|---|---|---|---|
| Feed de notícias + busca | ✅ | ✅ | ✅ |
| Filtro por estado | ✅ | ✅ | ✅ |
| Briefing diário por e-mail | ✅ | ✅ | ✅ |
| Sem anúncios | — | ✅ | ✅ |
| Briefing personalizado (suas categorias + sua UF) | — | ✅ | ✅ |
| Alertas por WhatsApp da sua UF | — | ✅ | ✅ |
| Cotações no e-mail (boi, soja, milho, leite) | — | ✅ | ✅ |
| Multi-UF (acompanhar vários estados) | — | — | ✅ |
| Alertas de prazo (vacinação/documentos) com antecedência | — | — | ✅ |
| Desconto no controledegado.app | — | — | ✅ (cross-sell) |

O cross-sell com o controledegado.app é o trunfo: mesma dona, mesmo público
(pecuarista), pagamento na mesma conta. "Assine Fazenda e ganhe X% no app de
gestão de rebanho."

## 3. Controle de acesso (arquitetura)

- Tabela `agro_entitlements` no Supabase: `user_id` (FK auth.users), `plan`
  ('free'|'produtor'|'fazenda'), `uf_preferences` (text[]), `expires_at`,
  `updated_at`. RLS: usuário lê só a própria linha; escrita só via server
  (webhook de pagamento).
- Gate no servidor: helper `getPlan(userId)` → default 'free' se sem linha ou
  expirado. Recursos pagos checam o plano no server component / API antes de
  entregar. Nunca confiar no client.
- Login já existe (Google via Supabase Auth, usado nos Salvos). Reutilizar.

## 4. Pagamento (destrava a monetização)

Trava conhecida: Stripe e AdSense exigem 18 anos. **Mas o controledegado.app já
processa pagamento via Mercado Pago.** Ação: verificar como aquela conta foi
aberta (responsável legal?) e se pode cobrar também o BELAGRO. Se sim, o
Mercado Pago (Checkout Pro + webhook, igual ao painel de anúncios do hub) vira
o gateway das assinaturas — sem depender de completar 18 anos.

## 5. Anúncios (receita do tier grátis)

Duas fontes, complementares:
1. **Google AdSense** — já codado (AdSlots + ads.txt + consentimento LGPD).
   Liga quando houver conta (18 anos / responsável legal). Renda passiva no
   tier grátis; some para assinantes.
2. **Patrocínio direto** — mais valioso que AdSense num público de nicho.
   Vender card patrocinado (revendas de insumo, cooperativas, leilões, casas
   de máquinas) pelo mesmo painel self-serve que o hub já tem. Nicho agro
   paga mais por clique qualificado que display genérico.

## 6. O diferencial chamativo (fase por fase)

Detalhado em `Obsidian/DEVLINI/Roadmap BELAGRO`. Resumo da ordem de construção:
1. **Alertas por estado** (clima/sanidade/crédito) — cruzar itens já coletados
   com a UF; selo "⚠️ Alerta" no topo do feed da UF do leitor.
2. **Canal do WhatsApp** (grátis, dá pra começar HOJE, sem API): posta o
   briefing e valida a demanda por alertas antes de pagar API.
3. **Cotações do dia** (boi, soja, milho, leite) — bloco no topo + no e-mail.
   Fonte: CEPEA publica indicadores diários (avaliar termos de uso).
4. **Alertas por WhatsApp automáticos** (recurso pago) — WhatsApp Business API.
5. **Assinaturas** — quando o pagamento estiver resolvido (§4).

## 7. Métricas de sucesso

- Ativação: % de visitantes que assinam o briefing (grátis).
- Retenção: aberturas do briefing / semana; visitas recorrentes (streak).
- Conversão: grátis → pago (meta inicial modesta: 1–2%).
- Receita: MRR das assinaturas + AdSense + patrocínios diretos.
- Publicar números de audiência mensalmente (mesma honestidade do painel do hub).

## 8. Fora de escopo agora (YAGNI)

App nativo, login social além do Google, fórum/comunidade, multi-idioma no
/agro. Só entram quando a audiência grátis justificar.
