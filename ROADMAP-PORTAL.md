# Roadmap — DEVLINI Portal (portfolio → ecossistema de tecnologia)

Visão: transformar devlini.com num portal de tecnologia com tráfego orgânico,
tráfego cruzado, autoridade e múltiplas fontes de renda — **sem nunca lançar
seção vazia** (thin content derruba SEO; seção sem conteúdo real espera a vez).

Regra de ouro (revenue-centric-design): cada fase só entra no ar quando tem
conteúdo/função de verdade. Identidade visual, i18n pt/en, minimalismo e
micro-interações atuais se aplicam a tudo.

---

## Fase A — Ferramentas + Newsletter (AGORA — maior alavancagem, zero dependência)

**Por quê primeiro:** páginas de ferramentas gratuitas são o motor de SEO mais
rápido que existe (buscas recorrentes tipo "gerador de senha", "formatador json"),
funcionam 100% no navegador (sem backend, sem conta nova) e cada página é uma
porta de entrada com CTA para o resto do site.

- [ ] Hub `/ferramentas` + 10 ferramentas client-side funcionando:
      senhas, UUID, Base64, formatador JSON, hash (SHA), QR Code, meta tags,
      robots.txt, juros compostos, precificação de software/freela
- [ ] SEO por ferramenta: title/description/canonical/OG próprios, JSON-LD,
      breadcrumbs, sitemap automático
- [ ] Tráfego cruzado v1: "outras ferramentas" + CTA no rodapé de cada página
- [ ] **Newsletter "Devlini Semanal"**: captura no site → tabela `subscribers`
      no Supabase; confirmação por e-mail ativa quando houver chave Resend;
      CTA na home e nas ferramentas
- [ ] Menu: + Ferramentas, + Newsletter

Ferramentas que ficam para A2 (precisam de mais engenharia): conversor/compressor
de imagens, conversor PDF, gerador de sitemap (crawler), formatadores SQL/HTML/CSS/JS,
gerador de contrato/orçamento/nomes/prompts, calculadoras ROI/lucro.

## Fase B — Blog (quando houver 3–5 artigos prontos)

Infra pronta é rápida (MDX + categorias da sua lista + tempo de leitura + índice +
relacionados + compartilhamento + JSON-LD Article + RSS). O gargalo é conteúdo:
**lançar com 3–5 artigos reais**, nunca vazio. Posso coescrever os primeiros
(ex.: "Como construí o controledegado.app", build-in-public do próprio site).
Comentários ficam para a fase Comunidade.

## Fase C — Cursos + Central de Recursos + Estudos de Caso

- Cursos: seus cursos do YouTube organizados em módulos/aulas, progresso via
  localStorage (sem login), créditos aos autores. **Depende de você listar os cursos.**
- Central de recursos: cheatsheets/roadmaps/guias — começa com 5+ itens reais.
- Estudos de caso: expandir o showcase atual; 1º case real = controledegado.app
  (problema, solução, arquitetura, métricas). Showcase já existe na home — evoluir,
  não duplicar.

## Fase D — AI Hub + Open Source

- AI Hub: prompts/agentes/templates com busca e filtros — lança com 20+ itens reais
  seus; estrutura preparada para venda futura.
- Open Source: componentes/hooks/utils publicados no seu GitHub com README e docs —
  lança quando houver 3+ repositórios apresentáveis.

## Fase E — Monetização avançada (DEPENDE DE STRIPE → 18 anos ou responsável legal)

- Marketplace (eBooks, planilhas, templates, packs) com página por produto,
  avaliações, FAQ — infra de checkout já existe do painel de anúncios.
- Programa de afiliados (links, painel, comissão, relatórios).
- Venda no AI Hub.

## Fase F — Comunidade (último de propósito)

Q&A, perfis, reputação exigem: autenticação, moderação ativa (LGPD, spam, menores)
e massa crítica de audiência. Lançar comunidade vazia mata a percepção do portal.
Pré-requisito: newsletter com centenas de inscritos + tráfego orgânico consolidado.

## Transversais (entram junto com as fases, não antes)

- **Busca global** com autocomplete: entra na Fase B (quando houver 2+ tipos de
  conteúdo para buscar; hoje seria buscar em 3 links)
- **Recomendações cruzadas**: v1 na Fase A (ferramentas↔ferramentas), cresce a cada fase
- **Dark mode**: candidata à Fase B (decisão de design consciente, tema completo)
- **Dashboard admin**: hoje o "admin" é o código (content-as-code) + /admin dos
  anúncios; painel completo só quando conteúdo migrar para o banco (Fase C+)
- **Analytics**: Vercel Analytics ativo; GA4/Clarity/Pixel entram quando houver
  contas (ação sua) — estrutura de eventos já preparada
- **Performance/A11y**: Lighthouse >95, WCAG, teclado — requisito permanente de
  toda fase (hoje já verde)

## Arquitetura (aplicada desde a Fase A)

`content/` (dados tipados) · `components/` · `lib/` (serviços/utils) · `app/` (rotas)
— TypeScript estrito, Server Components por padrão, ISR onde há dados dinâmicos,
client components só onde há interação. Escala para as fases seguintes sem refatorar.
