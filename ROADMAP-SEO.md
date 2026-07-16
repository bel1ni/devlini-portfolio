# Roadmap SEO — aparecer no Google buscando "Mariane Belini"

Objetivo: quando alguém pesquisar **Mariane Belini**, **Mariane Ramalho Belini** ou
**DEVLINI**, o devlini.com aparecer no topo — idealmente com o painel de resultado
enriquecido (foto, descrição, links de perfis).

Como funciona: o Google associa um **nome** a um **site** por três sinais —
(1) dados estruturados dizendo "este site é desta pessoa", (2) links dos perfis
oficiais apontando para o site, e (3) o site estar indexado e saudável.
O roadmap ataca os três.

---

## ✅ Fase 0 — Base técnica (já feito)

- [x] Title com o nome: "DEVLINI | Mariane Belini" (pt e en)
- [x] Description com nome completo "Mariane Ramalho Belini (DEVLINI)"
- [x] JSON-LD `Person` enriquecido: nome completo, `alternateName` (Mariane Belini,
      DEVLINI, bel1ni), `sameAs` → GitHub, LinkedIn, 2 Instagrams, X,
      foto, cargo, `worksFor` Chateau Labs
- [x] `sitemap.xml` e `robots.txt` (com /admin e páginas internas fora do índice)
- [x] Canonical + hreflang pt/en
- [x] OG image com nome e marca (preview bonito = mais cliques = mais sinal)
- [x] Site estático e rápido (Core Web Vitals ajudam ranking)
- [x] `noindex` em /admin, /anuncie/arte e /anuncie/obrigado

## 🔑 Fase 1 — Google Search Console (SÓ VOCÊ PODE — ~15 min, o passo mais importante)

O Search Console é o canal oficial com o Google: sem ele, a indexação
acontece "quando o Google quiser" (semanas); com ele, você pede e acompanha.

1. Acesse https://search.google.com/search-console com sua conta Google
2. **Adicionar propriedade** → tipo **Domínio** → `devlini.com`
3. O Google vai pedir um **registro TXT no DNS** — copie o valor
   (`google-site-verification=...`)
4. **Me mande o valor TXT** — eu adiciono no DNS pela CLI da Vercel em 1 minuto
   (alternativa manual: painel Vercel → Domains → devlini.com → DNS Records →
   Add → tipo TXT, name `@`, value colado)
5. De volta ao Search Console: **Verificar**
6. Menu **Sitemaps** → adicionar `https://devlini.com/sitemap.xml`
7. Menu **Inspeção de URL** → cole `https://devlini.com` → **Solicitar indexação**
   (repita para `/en` e `/anuncie`)

Resultado esperado: indexado em poucos dias em vez de semanas.

## 🔗 Fase 2 — Links dos perfis para o site (SÓ VOCÊ PODE — ~20 min)

Cada perfil oficial apontando para devlini.com é um "voto" ligando seu nome ao site:

- [ ] **GitHub** (github.com/bel1ni): Settings → Profile → Website = `https://devlini.com`
- [ ] **LinkedIn**: Perfil → Informações de contato → Site → `https://devlini.com`
      (tipo "Portfólio"); considere também no headline/sobre
- [ ] **Instagram** (@devlini_ e @belini_mariane): link da bio = `https://devlini.com`
- [ ] **X** (@marianedevlini): campo Website do perfil
- [ ] **controledegado.app**: um link no rodapé tipo "feito por Mariane Belini"
      apontando para devlini.com (backlink de um domínio seu que já está no ar)
- [ ] **Currículo**: já aponta para devlini.com ✓

## 📈 Fase 3 — Reforço contínuo (hábito)

- [ ] Compartilhar o link em posts (cada menção pública = sinal novo)
- [ ] Manter o site atualizado — Google favorece sites vivos (novos projetos,
      status atualizado)
- [ ] Monitorar no Search Console 1x/mês: consultas "mariane belini" e "devlini",
      posição média, cliques
- [ ] Quando quiser acelerar mais: blog/artigos técnicos no site (Fase 3 do PRD) —
      conteúdo indexável multiplica as portas de entrada

## ⏱️ Expectativa realista

| Marco | Prazo típico |
|---|---|
| Site indexado (aparece com `site:devlini.com`) | dias, após a Fase 1 |
| 1ª página buscando "devlini" | 1–2 semanas (nome único, sem concorrência) |
| 1ª página buscando "mariane belini" | 2–8 semanas (depende dos sinais da Fase 2) |
| Painel enriquecido (foto + perfis) | 1–3 meses de sinais consistentes |

O nome "DEVLINI" é praticamente único na internet — vai rankear rápido.
"Mariane Belini" compete com perfis sociais (LinkedIn/Instagram tendem a aparecer
primeiro no começo — o que também é bom: todos apontarão para o devlini.com).
