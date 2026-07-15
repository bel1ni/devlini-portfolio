# PRD — MVP "Link Hub" (Linktree próprio + Portfolio monetizado)

| Campo | Valor |
|---|---|
| Autora | Mariane Belini |
| Data | 15/07/2026 (rev. pós-grilling) |
| Status | Aprovado em entrevista de decisões (/grill-me) |
| Stack | Next.js (App Router) + Tailwind CSS |
| Deliverable | Site pessoal em domínio próprio, link único para currículo e bio das redes |

**Decisões fechadas na entrevista (15/07/2026):** bilíngue pt-BR + EN desde a Fase 1 · única criação hoje é a assinatura do [controledegado.app](https://controledegado.app) · sem order bump por enquanto (melhoria futura no checkout do app) · domínio próprio: **devlini.com** (comprado em 15/07/2026) · preços de lançamento dos slots R$19 / R$49 / R$119 · posicionamento híbrido "dev + fundadora".

---

## 1. Visão geral

**One-liner:** um Linktree próprio, minimalista e sob meu controle total, que funciona como portfolio profissional, hub de tráfego para minhas redes/apps/sites e **ativo que gera renda** — via cards de anúncio laterais (estilo [trustmrr.com](https://trustmrr.com/)) e via venda das minhas criações com order bump no checkout.

**Problema que resolve:**
- Linktree/Beacons genéricos não mostram *o que eu construo nem como construo* — servem mal como portfolio de currículo.
- Meu tráfego hoje se dispersa; não existe um ponto central que eu controle e que converta visitante em seguidor, cliente ou anunciante.
- Nenhuma dessas ferramentas me paga; um hub próprio com slots de anúncio transforma audiência em receita recorrente.

**Princípio norteador (Revenue-Centric Design):** *"Neutrality is omission"* — cada seção da página direciona o visitante para uma ação clara (seguir, baixar, comprar ou anunciar). Nada é decorativo.

---

## 2. Público-alvo (personas)

| Persona | Quem é | O que busca | Ação-alvo |
|---|---|---|---|
| **Recrutador/Empresa** | Chega pelo link no currículo/LinkedIn | Avaliar em ~30s: quem sou, o que construo, quais tecnologias domino | Clicar em projeto/GitHub/LinkedIn, me contatar |
| **Audiência** | Chega pela bio das redes sociais | Encontrar meus links, apps, conteúdos e produtos | Clicar/seguir/baixar/comprar uma criação |
| **Anunciante** | Indie hacker, dev com produto, infoprodutor que quer visibilidade nesse nicho | Espaço de divulgação barato com audiência qualificada | Comprar um slot de anúncio self-serve |

> RCD: *"Who talks to everyone convinces no one."* A página fala com essas 3 personas em zonas distintas — hero/projetos para recrutador, links/criações para audiência, sidebar + página "Anuncie" para anunciante.

---

## 3. Objetivos de negócio e métricas de sucesso

**Objetivos (3 meses pós-lançamento):**
1. Substituir o Linktree atual e entrar no currículo como link oficial.
2. Centralizar e medir 100% do tráfego de saída para redes/apps/sites.
3. Primeira receita: ≥ 1 slot de anúncio vendido e ≥ 1 assinatura do controledegado.app atribuída ao site (via UTM).

**Métricas (North Star: receita mensal do site):**

| Métrica | Definição | Meta inicial |
|---|---|---|
| Visitantes únicos/mês | via analytics | baseline no 1º mês |
| CTR de links | cliques ÷ visitas, por link | ≥ 30% de visitas com ≥ 1 clique |
| Cliques → controledegado.app | cliques no CTA do app (com UTM) e assinaturas atribuídas | medir e otimizar |
| Slots vendidos/mês | compras concluídas no painel de anúncios | 1º slot até o mês 3 |
| Receita mensal | anúncios + comissão atribuída às vendas | > R$ 0 no mês 3 |

> RCD (*metrics*): medir conversão, não beleza — cada iteração de design é julgada por essas métricas, não por estética.

---

## 4. Escopo do MVP (requisitos funcionais)

### 4.1 Perfil / Hero
- Foto real (não avatar genérico), nome, headline profissional de 1 linha e bio curta.
- **Posicionamento (decidido):** híbrido dev + fundadora — ex.: *"Desenvolvedora full-stack e fundadora do controledegado.app"*. Impressiona recrutador (constrói produto real no ar) e sustenta a marca de criadora. Seção de projetos vem logo após o hero.
- **Teste dos 5 segundos** (RCD): quem chega precisa responder em 5s — *quem é, o que constrói, por que importa*. A headline lidera com valor/transformação, não com lista de cargos.
- Badges da **stack de tecnologias** que uso (ex.: TypeScript, React, Next.js, Node…), escaneáveis de relance.
- Localização + link para contato/e-mail profissional.

### 4.2 Links principais (o "linktree")
- Lista de links em cards: redes sociais, apps publicados, sites, GitHub, LinkedIn, currículo em PDF.
- Cada link tem ícone, rótulo e **tracking de clique** (evento por link, agregado por dia).
- Ordenação manual via arquivo de configuração/CMS leve (ver §6) — sem painel admin no MVP.
- Redirecionamento com UTM (`utm_source=linkhub`) para atribuir tráfego nas plataformas de destino.

### 4.3 "O que estou construindo" (portfolio vivo)
- Cards de projeto com: nome, descrição de 1–2 linhas orientada a problema/resultado, **tecnologias usadas** (badges), status (`construindo` / `no ar` / `pausado`) e link (demo/GitHub/app store).
- Máximo de 4–6 projetos visíveis (RCD: *attention hierarchy* — menos itens, mais destaque para o que importa).
- Ordenado por relevância para recrutador (projeto mais forte primeiro — efeito de primazia).

### 4.4 Minhas criações — hoje: assinaturas do controledegado.app
- **Produto único no lançamento (decidido):** as assinaturas do [controledegado.app](https://controledegado.app). O card destaca a promessa de transformação (não lista de features), plano a partir de R$ X e CTA.
- **CTA com microcopy que responde "o que acontece ao clicar"** (RCD): ex. "Testar o app — grátis por X dias" em vez de "Saiba mais".
- O clique leva **direto à página de planos do app**, sempre com UTM (`utm_source=linkhub`) para atribuir assinaturas ao portfolio.
- **Order bump (decidido): sem bump por enquanto.** Quando fizer sentido, a oferta de 1 clique será implementada **no checkout do próprio app** (ex.: cross-sell do Stripe Checkout — upgrade anual com desconto ou módulo extra). Fica registrado como melhoria futura do app, não do hub.
- A seção é extensível: novos produtos digitais (curso, template, e-book) entram como cards adicionais, aí sim com checkout externo (Kiwify/Hotmart/Stripe Link) e order bump nativo.
- Elemento de prova social quando existir (nº de fazendas/usuários, avaliação — mirar 4.2–4.5★, não 5.0 perfeito; RCD: unanimidade parece fake).

### 4.5 Cards de anúncio laterais (estilo trustMRR)
- **Desktop:** coluna lateral direita fixa (sticky) com 2–3 slots de anúncio em cards.
- **Mobile:** os mesmos cards aparecem inline entre as seções (1 card a cada ~2 seções), nunca em popup/interstitial.
- Anatomia do card: imagem/logo, título curto, 1 linha de descrição, link com `rel="sponsored"` e selo discreto "Patrocinado".
- Slot vazio exibe card **"Anuncie aqui →"** apontando para a página de anúncios (o estado vazio vende o espaço; RCD: default é decisão).
- Rotação: cada slot mostra 1 anúncio ativo por período contratado (sem leilão/rotação múltipla no MVP).

### 4.6 Painel self-serve de anúncios (automatizado)
Fluxo do anunciante, sem intervenção manual:

1. Acessa a página **/anuncie**.
2. Escolhe o slot e a duração → paga via **Stripe Checkout**.
3. Após o pagamento, recebe link (e-mail do Stripe + página de sucesso) para **enviar arte + URL de destino + texto** em formulário próprio.
4. O anúncio entra em fila com status `em revisão` → **aprovação em 1 clique** pela dona (salvaguarda contra conteúdo impróprio; SLA de 24h comunicado ao anunciante).
5. Aprovado → publica automaticamente no slot; **expira sozinho** no fim do período e o slot volta ao estado "Anuncie aqui".

Requisitos técnicos:
- Banco de dados com entidade `Ad` (email do anunciante, imagem, URL, texto, slot, início, fim, status: `pendente_arte` / `em_revisao` / `ativo` / `expirado` / `rejeitado`).
- Webhook do Stripe (`checkout.session.completed`) cria o registro e dispara o e-mail de envio de arte.
- Upload de imagem com validação de formato/tamanho (specs na página /anuncie).
- Job/cron diário para expirar anúncios vencidos.
- Sem conta/login de anunciante no MVP — identificação pelo e-mail do Stripe + link mágico para o formulário de arte. Rejeição = reembolso via Stripe.

### 4.7 Página "/anuncie" (venda dos slots)
- Above the fold: números da audiência (visitantes/mês, CTR, perfil do público) — *"your promise is the size of your proof"*; enquanto o tráfego for pequeno, usar preço de lançamento honesto em vez de inflar números.
- **Tabela de preços com 3 opções (Good-Better-Best + decoy) — valores de lançamento decididos:**
  - **1 semana — R$ 19** (entrada/decoy: existe para fazer o mensal parecer óbvio)
  - **1 mês — R$ 49** **(alvo, destacada como "Mais popular")**
  - **3 meses — R$ 119** (âncora de valor, com desconto implícito)
  - Preços de lançamento intencionalmente baixos para vender os primeiros slots e gerar prova social; reajustar com dados reais de tráfego.
  - Regras RCD aplicadas: exatamente 3 opções; alvo no meio; eixo de valor único (duração); feature principal no topo da lista e bônus no final (serial-position effect).
- Specs da arte, política de conteúdo (o que não é aceito) e prazo de aprovação.
- CTA: "Reservar meu slot — no ar em até 24h".

### 4.8 SEO, Open Graph e Analytics
- Meta tags completas + **imagem OG caprichada** (o link vai em currículo e bios — o preview é a primeira impressão).
- Dados estruturados `Person` (schema.org), sitemap, favicon.
- **Domínio (decidido e comprado):** `devlini.com`. Conectar na Vercel antes de divulgar no currículo — trocar de domínio depois do lançamento quebra links impressos/QR.

### 4.9 Bilíngue pt-BR + inglês (decidido: já na Fase 1)
- i18n com rotas por idioma (`/` pt-BR, `/en` inglês) via `next-intl` ou equivalente do App Router.
- Detecção automática pelo `Accept-Language` do navegador + seletor manual discreto no topo; pt-BR como fallback.
- Para vagas internacionais, o currículo pode apontar direto para `/en`.
- Todo o conteúdo tipado (`content/*.ts`) carrega os dois idiomas desde o início — nada de tradução "depois".
- Analytics privacy-friendly (Vercel Analytics ou Umami) + eventos de clique por link/CTA.
- Performance: página inicial estática (SSG/ISR), imagens otimizadas (`next/image`).

---

## 5. Requisitos não-funcionais

| Requisito | Critério de aceite |
|---|---|
| **Responsividade** | Layout perfeito em 360px (mobile), 768px (tablet) e ≥1280px (desktop); sidebar de anúncios colapsa para inline no mobile |
| **Estilo minimalista** | Referência trustMRR: fundo neutro, tipografia limpa, cards com bordas sutis, 1 cor de acento para CTAs (contraste é relativo — o CTA primário vence a disputa visual; RCD) |
| **Motion** | Micro-interações sutis (hover, entrada de cards) guiadas pelas skills `emil-design-eng` / `animation-vocabulary` na implementação; nada que atrase o LCP |
| **Performance** | Core Web Vitals verdes; LCP < 2,5s em 4G |
| **Acessibilidade** | Contraste ≥ 4.5:1, navegação por teclado, alt em imagens, HTML semântico |
| **LGPD** | Analytics sem cookies de rastreio pessoal; dados de anunciante (e-mail) usados só para o serviço; política de privacidade simples |
| **Anúncios responsáveis** | `rel="sponsored"`, selo "Patrocinado" visível, política de conteúdo pública; **recusar apostas/cassino/gambling** (alinhado à restrição da skill revenue-centric-design) |

---

## 6. Stack técnica

| Camada | Escolha | Justificativa |
|---|---|---|
| Framework | **Next.js (App Router) + TypeScript** | SSG/ISR para a home (rápida e SEO-friendly) + rotas de API para o painel de anúncios |
| Estilo | **Tailwind CSS** | Iteração rápida, consistência do design minimalista |
| Conteúdo (links/projetos/criações) | Arquivos tipados (`content/*.ts` ou MDX) no repositório | Zero infra; editar conteúdo = commit; CMS fica para fase futura |
| Banco (anúncios) | **Postgres gerenciado (Neon ou Supabase)** + Drizzle/Prisma | Necessário só para o painel de anúncios |
| Pagamentos (slots) | **Stripe Checkout + webhooks** | Self-serve sem construir checkout |
| Vendas das criações | **Link direto para os planos do controledegado.app** (com UTM) | Assinatura fecha no checkout do próprio app; futuros infoprodutos usam plataforma externa (Kiwify/Hotmart) com order bump nativo |
| i18n | **next-intl** (pt-BR default + `/en`) | Bilíngue desde a Fase 1, decisão da entrevista |
| Upload de arte | Supabase Storage ou Vercel Blob | Simples e barato |
| E-mail transacional | Resend | Link de envio de arte + confirmações |
| Analytics | Vercel Analytics ou Umami | Privacy-friendly, eventos de clique |
| Deploy | **Vercel** + domínio próprio | CI/CD nativo do Next.js |

---

## 7. Fora de escopo do MVP (fases futuras)

- Checkout próprio com order bump **dentro do site**; order bump da assinatura do controledegado.app (melhoria futura no checkout do app, ex.: cross-sell do Stripe).
- Dashboard de métricas para o anunciante (impressões/cliques do card).
- Login/conta de anunciante, múltiplos anúncios em rotação por slot, leilão de preço.
- Blog/conteúdo SEO.
- CMS com painel admin para editar links/projetos.
- Newsletter/captura de e-mail.

---

## 8. Roadmap sugerido

| Fase | Entrega | Conteúdo |
|---|---|---|
| **Fase 1 — Página viva** (1º release) | Site estático completo, bilíngue, no domínio próprio | Hero híbrido dev+fundadora, links com tracking, projetos, card do controledegado.app com UTM, **pt-BR + EN**, slots de anúncio **preenchidos manualmente** (hardcoded) + página /anuncie com a tabela R$19/49/119 e contato por e-mail, SEO/OG, analytics. **Já entra no currículo.** |
| **Fase 2 — Monetização automatizada** | Painel self-serve de anúncios | Stripe Checkout, webhook, formulário de arte, aprovação 1-clique, publicação e expiração automáticas |
| **Fase 3 — Escala** | Otimizações | Dashboard do anunciante, newsletter, CMS, novos produtos digitais com order bump |

> Racional: a Fase 1 já cumpre 3 dos 4 objetivos (portfolio, tráfego, vendas com order bump) e começa a gerar o social proof de tráfego que a página /anuncie precisa para vender slots na Fase 2.

---

## 9. Riscos e mitigações

| Risco | Impacto | Mitigação |
|---|---|---|
| Anúncio com conteúdo impróprio/ilegal | Dano à marca pessoal (o site está no currículo!) | Aprovação manual de 1 clique antes de publicar + política de conteúdo pública + reembolso automático na rejeição |
| Tráfego inicial baixo → slots não vendem | Receita zero de anúncios | Preço de lançamento honesto, permuta com outros criadores, números reais na /anuncie (nunca inflar — cold traffic é teste de honestidade; RCD) |
| Escopo bilíngue atrasa a Fase 1 | Lançamento mais lento | Conteúdo é curto (1 página); traduzir junto com a escrita, nunca depois; i18n entra no scaffold desde o dia 1 |
| Escopo do painel self-serve crescer | Atraso no lançamento | Painel é Fase 2; Fase 1 vai ao ar sem ele |
| Site "portfolio" com cara de outdoor | Recrutador percebe poluição visual | Máx. 2–3 slots, cards discretos com selo, estilo minimalista domina a hierarquia visual |

---

## 10. Critérios de aceite do MVP (checklist de lançamento)

**Fase 1**
- [ ] Passa o teste dos 5 segundos com alguém que não me conhece
- [ ] 100% responsivo (360px → 1440px), sidebar → inline no mobile
- [ ] pt-BR e EN completos, detecção de idioma + seletor manual funcionando
- [ ] Todo link de saída dispara evento de analytics com UTM
- [ ] Card do controledegado.app leva à página de planos do app com UTM de atribuição
- [ ] Página /anuncie no ar com a tabela R$19/49/119
- [ ] OG image renderiza bem no WhatsApp, LinkedIn e X
- [ ] Core Web Vitals verdes no PageSpeed Insights
- [ ] Link publicado no currículo e nas bios das redes

**Fase 2**
- [ ] Compra de slot → pagamento → envio de arte → aprovação → publicação sem nenhum passo manual além do 1 clique de aprovação
- [ ] Anúncio expira sozinho e o slot volta a exibir "Anuncie aqui"
- [ ] Webhook do Stripe idempotente e testado com pagamento real de valor mínimo

---

*Skills instaladas neste projeto e usadas na elaboração/implementação: `revenue-centric-design` (princípios de conversão e pricing citados ao longo do PRD), `grill-me` (pressão de decisões — rodar `/grill-me` sobre este PRD antes de implementar), `emil-design-eng` + `animation-vocabulary` + `apple-design` + `improve-animations` + `review-animations` (design/motion na fase de implementação).*
