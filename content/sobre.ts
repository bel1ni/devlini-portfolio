// Conteúdo da página /sobre — em português (decisão: conteúdo novo é pt-only).
// Edite os textos livremente aqui; a página em app/(hub)/[locale]/sobre/page.tsx
// só monta o layout. Os pontos marcados com "AJUSTE:" são chutes bem-informados
// que a Mariane deve confirmar/corrigir.

export const sobre = {
  // Frase de posicionamento — a primeira coisa que o recrutador lê.
  positioning:
    "Desenvolvedora full-stack que tira ideias do zero e coloca no ar — do banco de dados à loja de apps.",

  intro:
    "Eu construo produtos de verdade, sozinha e de ponta a ponta. Criei o controledegado.app — um app de gestão de rebanho que foi do primeiro esquema de banco até a Google Play — e o BELAGRO, um portal de notícias do agronegócio com curadoria e resumos por inteligência artificial. Aprendo entregando: cada projeto meu está no ar, sendo usado.",

  // Faixa de disponibilidade — CTA principal da página.
  availability: {
    open: true,
    headline: "Aberta a novas oportunidades",
    // AJUSTE: confirme as vagas que você quer atrair.
    roles: ["Desenvolvedora Full-Stack", "Front-end", "Mobile / React Native"],
    // AJUSTE: modalidade e disponibilidade.
    note: "Remoto ou híbrido · disponível para começar",
  },

  // Sua história — 2 a 3 parágrafos. AJUSTE ao seu tom; adicionei o que já sei.
  story: [
    "Comecei programando pela vontade de resolver problemas reais do campo, e não parei mais. O controledegado.app nasceu dessa raiz: transformar o caderno de anotações do pecuarista em um app simples de gestão de rebanho. Eu cuidei de tudo — modelagem de dados, back-end, interface, o app mobile e a publicação na loja.",
    "Gosto de dominar a stack inteira porque isso me deixa autônoma: consigo pegar uma ideia vaga e levá-la até um produto funcionando, decidindo arquitetura, design e trade-offs no caminho. Tenho paixão especial por aplicar inteligência artificial de um jeito útil — no BELAGRO, uso IA para resumir e curar notícias do agro para o produtor não perder tempo.",
    "Construo em público e estou sempre aprendendo algo novo — este site é parte disso.",
  ],

  // No que sou boa — agrupado com contexto, não só uma nuvem de tecnologias.
  skills: [
    {
      group: "Front-end",
      items: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
      note: "Interfaces rápidas, acessíveis e caprichadas nos detalhes.",
    },
    {
      group: "Mobile",
      items: ["React Native", "PWA"],
      note: "Do protótipo à publicação na Google Play.",
    },
    {
      group: "Back-end & dados",
      items: ["Node.js", "Python", "PostgreSQL", "Supabase"],
      note: "APIs, modelagem de dados e autenticação de ponta a ponta.",
    },
    {
      group: "IA aplicada",
      items: ["Integração de LLMs", "Automação de conteúdo"],
      note: "Uso de modelos de linguagem para resolver problemas reais, com custo sob controle.",
    },
  ],

  // Destaques — projetos que provam o discurso. As páginas de detalhe (cases)
  // virão depois; por ora cada card leva ao projeto ao vivo.
  highlights: [
    {
      name: "controledegado.app",
      blurb:
        "SaaS de gestão de rebanho para produtores rurais, construído do zero e publicado na Google Play. Animais, pesagens e manejo no celular.",
      tag: "Fundadora & dev única",
      url: "https://controledegado.app",
    },
    {
      name: "BELAGRO",
      blurb:
        "Portal de notícias do agronegócio que agrega dezenas de fontes e usa IA para resumir e priorizar o que importa para o produtor.",
      tag: "Produto próprio",
      url: "/agro",
    },
  ],

  // O que estou aprendendo agora — o "aprendendo em público".
  learning: {
    title: "O que estou aprendendo agora",
    items: [
      {
        name: "studio.dev — desenvolvimento de jogos no Roblox Studio",
        note: "Curso de criação de jogos com Roblox Studio (linguagem Lua). Explorando lógica de jogo, física e experiência do jogador.",
      },
    ],
  },
};
