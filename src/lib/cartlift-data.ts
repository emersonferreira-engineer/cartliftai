/**
 * Base de dados fictícia (mock) do CartLift.
 * Fonte única de verdade: todas as telas do dashboard leem daqui,
 * garantindo consistência de clientes, produtos, valores e datas.
 */

export const account = {
  storeName: "Belle Aura Cosméticos",
  storeUrl: "https://www.belleaura.com.br",
  plan: "CartLift Growth",
  admin: {
    name: "Emerson Ferreira",
    role: "Engenheiro de Inteligência Artificial / Analista de Marketing",
    email: "emerson@cartlift.com",
    initials: "EF",
  },
  securityCode: "BA-7F2K-9310",
};

export const kpis = {
  abandonmentRate: 68.4,
  abandonmentDelta: -4.2,
  recoveredRevenue: 84720.5,
  recoveredDelta: 18.6,
  activeCarts: 412,
  activeCartsDelta: 7.1,
  recoveryRate: 23.8,
  recoveryDelta: 3.4,
  potentialRevenue: 356900,
};

export const weeklyEvolution = [
  { semana: "Sem 1", abandonos: 742, recuperados: 148, receita: 15980 },
  { semana: "Sem 2", abandonos: 806, recuperados: 171, receita: 18240 },
  { semana: "Sem 3", abandonos: 689, recuperados: 182, receita: 19860 },
  { semana: "Sem 4", abandonos: 731, recuperados: 214, receita: 24640 },
  { semana: "Sem 5", abandonos: 658, recuperados: 236, receita: 26410 },
  { semana: "Sem 6", abandonos: 612, recuperados: 251, receita: 28950 },
];

export const channelPerformance = [
  { canal: "E-mail 1h", enviados: 1840, aberturas: 62, conversao: 9.4 },
  { canal: "WhatsApp 24h", enviados: 1210, aberturas: 88, conversao: 17.2 },
  { canal: "E-mail 48h", enviados: 960, aberturas: 47, conversao: 6.8 },
  { canal: "WhatsApp 5d", enviados: 540, aberturas: 74, conversao: 11.5 },
];

export type Ticket = "baixo" | "medio" | "alto";
export type CartStatus = "na-regua" | "recuperado" | "perdido";

export type Cart = {
  id: string;
  cliente: string;
  email: string;
  telefone: string;
  valor: number;
  itens: string[];
  categoria: string;
  diasParado: number;
  ticket: Ticket;
  motivo: string;
  status: CartStatus;
  etapa: string;
  ultimoContato: string;
  data: string;
};

export const carts: Cart[] = [
  {
    id: "CL-4821",
    cliente: "Juliana Marques",
    email: "juliana.marques@gmail.com",
    telefone: "+55 11 98842-3310",
    valor: 389.9,
    itens: ["Sérum Vitamina C 30ml", "Protetor Solar FPS 60"],
    categoria: "Skincare",
    diasParado: 1,
    ticket: "medio",
    motivo: "Frete alto",
    status: "na-regua",
    etapa: "Pagamento",
    ultimoContato: "E-mail 1h",
    data: "2026-08-20",
  },
  {
    id: "CL-4818",
    cliente: "Camila Bezerra",
    email: "camila.bezerra@outlook.com",
    telefone: "+55 21 99117-4402",
    valor: 148.5,
    itens: ["Batom Matte Rosé", "Lápis de Olho Preto"],
    categoria: "Maquiagem",
    diasParado: 1,
    ticket: "baixo",
    motivo: "Indecisão de cor",
    status: "na-regua",
    etapa: "Carrinho",
    ultimoContato: "E-mail 1h",
    data: "2026-08-20",
  },
  {
    id: "CL-4805",
    cliente: "Renata Alcântara",
    email: "renata.alcantara@gmail.com",
    telefone: "+55 31 98550-1287",
    valor: 1240.0,
    itens: ["Perfume Nuit Absolu 100ml", "Kit Hidratação Corporal"],
    categoria: "Perfumaria",
    diasParado: 2,
    ticket: "alto",
    motivo: "Preço / comparação",
    status: "na-regua",
    etapa: "Checkout",
    ultimoContato: "WhatsApp 24h",
    data: "2026-08-19",
  },
  {
    id: "CL-4799",
    cliente: "Thiago Nogueira",
    email: "thiago.nogueira@gmail.com",
    telefone: "+55 41 99604-7712",
    valor: 512.3,
    itens: ["Perfume Terra Woody 75ml", "Gel de Barbear Sensitive"],
    categoria: "Perfumaria",
    diasParado: 2,
    ticket: "medio",
    motivo: "Cadastro obrigatório",
    status: "na-regua",
    etapa: "Identificação",
    ultimoContato: "WhatsApp 24h",
    data: "2026-08-19",
  },
  {
    id: "CL-4780",
    cliente: "Patrícia Lemos",
    email: "patricia.lemos@hotmail.com",
    telefone: "+55 51 98233-6640",
    valor: 96.8,
    itens: ["Shampoo Infantil Sem Lágrimas", "Hidratante Kids Cacau"],
    categoria: "Infantil",
    diasParado: 5,
    ticket: "baixo",
    motivo: "Checkout longo",
    status: "na-regua",
    etapa: "Frete",
    ultimoContato: "WhatsApp 5d",
    data: "2026-08-16",
  },
  {
    id: "CL-4776",
    cliente: "Aline Cavalcanti",
    email: "aline.cavalcanti@gmail.com",
    telefone: "+55 85 98470-2219",
    valor: 1875.4,
    itens: ["Kit Anti-idade Retinol", "Perfume Nuit Absolu 100ml", "Máscara Facial Ouro"],
    categoria: "Skincare",
    diasParado: 6,
    ticket: "alto",
    motivo: "Frete alto",
    status: "na-regua",
    etapa: "Frete",
    ultimoContato: "WhatsApp 5d",
    data: "2026-08-15",
  },
  {
    id: "CL-4770",
    cliente: "Marcos Vinícius Prado",
    email: "mv.prado@gmail.com",
    telefone: "+55 62 99188-3355",
    valor: 268.0,
    itens: ["Kit Barba & Pele", "Sabonete Facial Carvão"],
    categoria: "Masculino",
    diasParado: 5,
    ticket: "medio",
    motivo: "Indecisão",
    status: "na-regua",
    etapa: "Carrinho",
    ultimoContato: "E-mail 48h",
    data: "2026-08-16",
  },
  {
    id: "CL-4762",
    cliente: "Fernanda Ribeiro",
    email: "fernanda.ribeiro@gmail.com",
    telefone: "+55 11 97722-1189",
    valor: 734.9,
    itens: ["Paleta de Sombras Nude 12 cores", "Base Fluida Longa Duração"],
    categoria: "Maquiagem",
    diasParado: 0,
    ticket: "medio",
    motivo: "Frete alto",
    status: "recuperado",
    etapa: "Compra concluída",
    ultimoContato: "WhatsApp 24h",
    data: "2026-08-18",
  },
  {
    id: "CL-4755",
    cliente: "Larissa Andrade",
    email: "larissa.andrade@yahoo.com",
    telefone: "+55 48 98811-5573",
    valor: 1120.0,
    itens: ["Perfume Vanille Rouge 100ml", "Creme Noturno Peptídeos"],
    categoria: "Perfumaria",
    diasParado: 0,
    ticket: "alto",
    motivo: "Preço",
    status: "recuperado",
    etapa: "Compra concluída",
    ultimoContato: "Cupom 10% segmentado",
    data: "2026-08-17",
  },
  {
    id: "CL-4741",
    cliente: "Beatriz Sampaio",
    email: "bia.sampaio@gmail.com",
    telefone: "+55 27 99340-8821",
    valor: 129.9,
    itens: ["Batom Líquido Cherry", "Gloss Volumizador"],
    categoria: "Maquiagem",
    diasParado: 9,
    ticket: "baixo",
    motivo: "Indecisão",
    status: "perdido",
    etapa: "Carrinho",
    ultimoContato: "E-mail 48h",
    data: "2026-08-12",
  },
  {
    id: "CL-4736",
    cliente: "Sofia Menezes",
    email: "sofia.menezes@gmail.com",
    telefone: "+55 71 98277-4408",
    valor: 458.2,
    itens: ["Kit Skincare Adolescente", "Água Micelar 400ml"],
    categoria: "Skincare",
    diasParado: 1,
    ticket: "medio",
    motivo: "Checkout longo",
    status: "na-regua",
    etapa: "Pagamento",
    ultimoContato: "E-mail 1h",
    data: "2026-08-20",
  },
  {
    id: "CL-4728",
    cliente: "Gustavo Rocha",
    email: "gustavo.rocha@gmail.com",
    telefone: "+55 11 98004-7719",
    valor: 2140.6,
    itens: ["Perfume Oud Royale 100ml", "Kit Presente Dia dos Namorados"],
    categoria: "Perfumaria",
    diasParado: 2,
    ticket: "alto",
    motivo: "Preço / comparação",
    status: "na-regua",
    etapa: "Checkout",
    ultimoContato: "WhatsApp 24h",
    data: "2026-08-19",
  },
  {
    id: "CL-4719",
    cliente: "Helena Duarte",
    email: "helena.duarte@gmail.com",
    telefone: "+55 19 99655-3312",
    valor: 187.4,
    itens: ["Condicionador Kids Coco", "Escova Infantil Suave"],
    categoria: "Infantil",
    diasParado: 5,
    ticket: "baixo",
    motivo: "Cadastro obrigatório",
    status: "na-regua",
    etapa: "Identificação",
    ultimoContato: "WhatsApp 5d",
    data: "2026-08-16",
  },
  {
    id: "CL-4712",
    cliente: "Vanessa Portela",
    email: "vanessa.portela@gmail.com",
    telefone: "+55 11 98123-9987",
    valor: 869.0,
    itens: ["Sérum Ácido Hialurônico", "Protetor Solar com Cor", "Esfoliante Enzimático"],
    categoria: "Skincare",
    diasParado: 0,
    ticket: "medio",
    motivo: "Frete alto",
    status: "recuperado",
    etapa: "Compra concluída",
    ultimoContato: "Frete grátis progressivo",
    data: "2026-08-14",
  },
];

export const ticketLabels: Record<Ticket, string> = {
  baixo: "Baixo ticket (até R$ 200)",
  medio: "Médio ticket (R$ 200 – 900)",
  alto: "Alto ticket (acima de R$ 900)",
};

export type Diagnosis = {
  categoria: string;
  motivo: string;
  confianca: number;
  abandonos: number;
  valorParado: number;
  etapaCritica: string;
  produtoCritico: string;
  acao: string;
  impacto: number;
};

export const diagnoses: Diagnosis[] = [
  {
    categoria: "Skincare",
    motivo: "Frete alto no CEP fora do Sudeste",
    confianca: 92,
    abandonos: 318,
    valorParado: 92840,
    etapaCritica: "Cálculo de frete",
    produtoCritico: "Sérum Vitamina C 30ml",
    acao: "Ativar frete grátis progressivo acima de R$ 249 para Norte/Nordeste",
    impacto: 21400,
  },
  {
    categoria: "Perfumaria",
    motivo: "Comparação de preço com marketplaces",
    confianca: 87,
    abandonos: 204,
    valorParado: 148900,
    etapaCritica: "Checkout",
    produtoCritico: "Perfume Nuit Absolu 100ml",
    acao: "Cupom de 8% exclusivo para carrinhos acima de R$ 900 no WhatsApp em 24h",
    impacto: 34700,
  },
  {
    categoria: "Maquiagem",
    motivo: "Indecisão de tom / falta de prova social",
    confianca: 81,
    abandonos: 276,
    valorParado: 41260,
    etapaCritica: "Carrinho",
    produtoCritico: "Batom Matte Rosé",
    acao: "Enviar comparativo de tons + avaliações reais na 2ª mensagem da régua",
    impacto: 12800,
  },
  {
    categoria: "Infantil",
    motivo: "Cadastro obrigatório antes do pagamento",
    confianca: 78,
    abandonos: 132,
    valorParado: 18740,
    etapaCritica: "Identificação",
    produtoCritico: "Shampoo Infantil Sem Lágrimas",
    acao: "Habilitar checkout como convidado e login em 1 clique",
    impacto: 8600,
  },
  {
    categoria: "Masculino",
    motivo: "Checkout longo (5 etapas)",
    confianca: 74,
    abandonos: 98,
    valorParado: 26310,
    etapaCritica: "Pagamento",
    produtoCritico: "Kit Barba & Pele",
    acao: "Reduzir para 2 etapas e habilitar Pix com QR imediato",
    impacto: 9400,
  },
];

export const funnelStages = [
  { etapa: "Visitas ao produto", pessoas: 48200 },
  { etapa: "Adição ao carrinho", pessoas: 12640 },
  { etapa: "Identificação", pessoas: 7180 },
  { etapa: "Frete", pessoas: 5240 },
  { etapa: "Pagamento", pessoas: 3410 },
  { etapa: "Compra concluída", pessoas: 3996 },
];

export const abandonReasons = [
  { motivo: "Frete alto", valor: 34 },
  { motivo: "Preço / comparação", valor: 24 },
  { motivo: "Checkout longo", valor: 16 },
  { motivo: "Indecisão", valor: 15 },
  { motivo: "Cadastro obrigatório", valor: 11 },
];

export type SiteFinding = {
  titulo: string;
  categoria: "Conversão" | "Usabilidade" | "SEO" | "Internacionalização";
  severidade: "alta" | "media" | "baixa";
  diagnostico: string;
  acao: string;
  impactoConversao: string;
  esforco: string;
};

export const siteFindings: SiteFinding[] = [
  {
    titulo: "Botão de compra com baixo contraste",
    categoria: "Conversão",
    severidade: "alta",
    diagnostico:
      "O CTA 'Comprar agora' usa bege sobre fundo claro (contraste 1.9:1) e fica abaixo da dobra em telas de celular.",
    acao: "Aplicar cor de alta saliência, fixar o botão no rodapé mobile e aumentar a área de toque para 48px.",
    impactoConversao: "+11% a +16% em add-to-cart",
    esforco: "Baixo",
  },
  {
    titulo: "Vitrine de produtos em destaque mal aproveitada",
    categoria: "Conversão",
    severidade: "alta",
    diagnostico:
      "A seção de destaques mostra 12 itens sem hierarquia; os best-sellers de recompra (skincare) aparecem na 9ª posição.",
    acao: "Reduzir para 4 produtos, priorizar recompra recorrente e adicionar selo 'mais recomprado'.",
    impactoConversao: "+8% em receita por sessão",
    esforco: "Baixo",
  },
  {
    titulo: "Ausência de seletor de idiomas",
    categoria: "Internacionalização",
    severidade: "media",
    diagnostico:
      "14% das sessões vêm de Portugal, EUA e Espanha, porém o site é apenas em português e sem moeda alternativa.",
    acao: "Adicionar seletor de idioma/moeda (PT, EN, ES) com hreflang e tradução das páginas de produto.",
    impactoConversao: "+9% de alcance internacional",
    esforco: "Médio",
  },
  {
    titulo: "Frete e prazo só aparecem no checkout",
    categoria: "Usabilidade",
    severidade: "alta",
    diagnostico:
      "A calculadora de frete não existe na página de produto — principal causa de abandono na etapa de frete.",
    acao: "Exibir simulador de frete por CEP no produto e barra de progresso 'faltam R$ X para frete grátis'.",
    impactoConversao: "+13% em conclusão de checkout",
    esforco: "Médio",
  },
  {
    titulo: "Títulos e descrições sem palavra-chave de intenção",
    categoria: "SEO",
    severidade: "media",
    diagnostico:
      "Páginas de categoria usam títulos genéricos ('Produtos') e não possuem dados estruturados de produto.",
    acao: "Reescrever títulos com intenção de compra e implementar schema Product + AggregateRating.",
    impactoConversao: "+22% de tráfego orgânico em 90 dias",
    esforco: "Médio",
  },
  {
    titulo: "Imagens pesadas atrasam o carregamento mobile",
    categoria: "Usabilidade",
    severidade: "media",
    diagnostico: "LCP mobile em 4,3s; imagens de banner com 1,8MB sem lazy loading.",
    acao: "Converter para WebP, aplicar lazy loading e pré-carregar apenas o banner principal.",
    impactoConversao: "+6% em sessões que chegam ao carrinho",
    esforco: "Baixo",
  },
  {
    titulo: "Sem prova social próxima ao CTA",
    categoria: "Conversão",
    severidade: "baixa",
    diagnostico: "Avaliações ficam no fim da página; nenhuma referência de segurança perto do botão de compra.",
    acao: "Levar nota média, selos de segurança e política de troca para ao lado do CTA.",
    impactoConversao: "+4% em confiança de checkout",
    esforco: "Baixo",
  },
];

export const languages = [
  { flag: "🇧🇷", label: "Português (BR)", status: "Ativo", share: 86 },
  { flag: "🇵🇹", label: "Português (PT)", status: "Sugerido", share: 6 },
  { flag: "🇺🇸", label: "Inglês (EUA)", status: "Sugerido", share: 5 },
  { flag: "🇪🇸", label: "Espanhol", status: "Sugerido", share: 3 },
];

export const securityEvents = [
  {
    data: "20/08/2026 14:32",
    tipo: "Código validado",
    detalhe: "Cliente Juliana Marques confirmou o código no WhatsApp",
    nivel: "ok",
  },
  {
    data: "19/08/2026 09:11",
    tipo: "Tentativa suspeita",
    detalhe: "Número não verificado tentou usar o nome Belle Aura",
    nivel: "alerta",
  },
  {
    data: "18/08/2026 17:48",
    tipo: "Código validado",
    detalhe: "Cliente Fernanda Ribeiro confirmou o código antes do pagamento",
    nivel: "ok",
  },
  {
    data: "17/08/2026 11:05",
    tipo: "Código rotacionado",
    detalhe: "Rotação mensal automática do código da loja",
    nivel: "info",
  },
];

export const customerCodes = [
  { cliente: "Juliana Marques", codigo: "JM-4821-BA", validade: "27/08/2026", status: "Validado" },
  { cliente: "Renata Alcântara", codigo: "RA-4805-BA", validade: "26/08/2026", status: "Pendente" },
  { cliente: "Gustavo Rocha", codigo: "GR-4728-BA", validade: "26/08/2026", status: "Pendente" },
  { cliente: "Patrícia Lemos", codigo: "PL-4780-BA", validade: "23/08/2026", status: "Expirado" },
  { cliente: "Fernanda Ribeiro", codigo: "FR-4762-BA", validade: "25/08/2026", status: "Validado" },
];

export const weeklyReport = {
  periodo: "14 a 20 de agosto de 2026",
  resumo:
    "Emerson, esta semana a Belle Aura deixou de faturar cerca de R$ 82,6 mil em carrinhos abandonados, mas a régua recuperou R$ 28.950 — o melhor resultado dos últimos dois meses. A taxa de abandono caiu de 72,6% para 68,4%, e quem mais respondeu foi o WhatsApp de 24 horas.",
  destaques: [
    "Perfumaria concentra 41% do valor parado: são carrinhos altos (média de R$ 1.180) que comparam preço com marketplaces.",
    "Skincare é a categoria que mais volta: 1 em cada 4 clientes retorna quando recebe frete grátis progressivo.",
    "Carrinhos de linha infantil abandonam na tela de cadastro — 132 pessoas desistiram antes de digitar o pagamento.",
    "O WhatsApp de 24h converteu 17,2%, quase o dobro do e-mail de 1 hora (9,4%).",
  ],
  acoes: [
    "Ligar frete grátis a partir de R$ 249 para Norte e Nordeste (impacto estimado: R$ 21,4 mil/mês).",
    "Enviar cupom de 8% somente para carrinhos acima de R$ 900 de perfumaria (impacto estimado: R$ 34,7 mil/mês).",
    "Liberar checkout sem cadastro obrigatório (impacto estimado: R$ 8,6 mil/mês).",
  ],
  previsao:
    "Se as três ações forem aplicadas nesta semana, a projeção é fechar setembro com R$ 129 mil recuperados e taxa de abandono próxima de 61%.",
};

export const ruleSteps = [
  {
    id: 1,
    canal: "E-mail",
    atraso: "1 hora após o abandono",
    mensagem: "Lembrete gentil com foto dos itens e link de retorno ao carrinho",
    incentivo: "Nenhum",
    ativo: true,
  },
  {
    id: 2,
    canal: "WhatsApp",
    atraso: "24 horas após o abandono",
    mensagem: "Mensagem pessoal com código de verificação da loja + prova social",
    incentivo: "Frete grátis progressivo",
    ativo: true,
  },
  {
    id: 3,
    canal: "E-mail",
    atraso: "48 horas após o abandono",
    mensagem: "Comparativo de tons/produtos e avaliações de clientes",
    incentivo: "Cupom 5% (ticket médio)",
    ativo: true,
  },
  {
    id: 4,
    canal: "WhatsApp",
    atraso: "5 dias após o abandono",
    mensagem: "Última chamada com escassez real de estoque",
    incentivo: "Cupom 8% (alto ticket)",
    ativo: false,
  },
];

export const valueRules = [
  { faixa: "Até R$ 200", incentivo: "Nenhum desconto — apenas lembrete", canais: "E-mail", ativo: true },
  { faixa: "R$ 200 a R$ 900", incentivo: "Frete grátis progressivo", canais: "E-mail + WhatsApp", ativo: true },
  { faixa: "Acima de R$ 900", incentivo: "Cupom 8% + atendimento humano", canais: "WhatsApp", ativo: true },
];

export const brl = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

export const brlExact = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

/* ---------------------------------------------------------------
 * Histórico de envios por cliente (e-mail e WhatsApp)
 * ------------------------------------------------------------- */

export type SendChannel = "E-mail" | "WhatsApp";
export type SendStatus = "enviado" | "entregue" | "clicado" | "respondido";

export type SendEvent = {
  id: string;
  cartId: string;
  cliente: string;
  contato: string;
  canal: SendChannel;
  etapa: string;
  assunto: string;
  enviadoEm: string;
  status: SendStatus;
  timeline: { status: SendStatus; em: string }[];
};

export const sendStatusLabels: Record<SendStatus, string> = {
  enviado: "Enviado",
  entregue: "Entregue",
  clicado: "Clicado",
  respondido: "Respondido",
};

export const sendHistory: SendEvent[] = [
  {
    id: "EV-9012",
    cartId: "CL-4821",
    cliente: "Juliana Marques",
    contato: "juliana.marques@gmail.com",
    canal: "E-mail",
    etapa: "E-mail 1h",
    assunto: "Seu Sérum Vitamina C ficou esperando 💛",
    enviadoEm: "20/08 09:12",
    status: "clicado",
    timeline: [
      { status: "enviado", em: "20/08 09:12" },
      { status: "entregue", em: "20/08 09:12" },
      { status: "clicado", em: "20/08 10:41" },
    ],
  },
  {
    id: "EV-9011",
    cartId: "CL-4821",
    cliente: "Juliana Marques",
    contato: "+55 11 98842-3310",
    canal: "WhatsApp",
    etapa: "WhatsApp 24h",
    assunto: "Frete grátis acima de R$ 249 para o seu CEP",
    enviadoEm: "21/08 10:05",
    status: "respondido",
    timeline: [
      { status: "enviado", em: "21/08 10:05" },
      { status: "entregue", em: "21/08 10:05" },
      { status: "clicado", em: "21/08 10:22" },
      { status: "respondido", em: "21/08 10:29" },
    ],
  },
  {
    id: "EV-9008",
    cartId: "CL-4818",
    cliente: "Camila Bezerra",
    contato: "camila.bezerra@outlook.com",
    canal: "E-mail",
    etapa: "E-mail 1h",
    assunto: "Ainda em dúvida no tom do Batom Matte Rosé?",
    enviadoEm: "20/08 14:38",
    status: "entregue",
    timeline: [
      { status: "enviado", em: "20/08 14:38" },
      { status: "entregue", em: "20/08 14:39" },
    ],
  },
  {
    id: "EV-9004",
    cartId: "CL-4805",
    cliente: "Renata Alcântara",
    contato: "+55 31 98550-1287",
    canal: "WhatsApp",
    etapa: "WhatsApp 24h",
    assunto: "Cupom exclusivo de 8% no Nuit Absolu",
    enviadoEm: "19/08 18:20",
    status: "clicado",
    timeline: [
      { status: "enviado", em: "19/08 18:20" },
      { status: "entregue", em: "19/08 18:21" },
      { status: "clicado", em: "19/08 21:03" },
    ],
  },
  {
    id: "EV-9001",
    cartId: "CL-4805",
    cliente: "Renata Alcântara",
    contato: "renata.alcantara@gmail.com",
    canal: "E-mail",
    etapa: "E-mail 1h",
    assunto: "Seu perfume favorito ainda está reservado",
    enviadoEm: "19/08 09:44",
    status: "entregue",
    timeline: [
      { status: "enviado", em: "19/08 09:44" },
      { status: "entregue", em: "19/08 09:45" },
    ],
  },
  {
    id: "EV-8996",
    cartId: "CL-4799",
    cliente: "Thiago Nogueira",
    contato: "+55 41 99604-7712",
    canal: "WhatsApp",
    etapa: "WhatsApp 24h",
    assunto: "Finalize sem cadastro: checkout em 1 clique",
    enviadoEm: "19/08 16:12",
    status: "enviado",
    timeline: [{ status: "enviado", em: "19/08 16:12" }],
  },
  {
    id: "EV-8990",
    cartId: "CL-4780",
    cliente: "Patrícia Lemos",
    contato: "+55 51 98233-6640",
    canal: "WhatsApp",
    etapa: "WhatsApp 5d",
    assunto: "Última chance no kit infantil (estoque baixo)",
    enviadoEm: "21/08 11:02",
    status: "entregue",
    timeline: [
      { status: "enviado", em: "21/08 11:02" },
      { status: "entregue", em: "21/08 11:03" },
    ],
  },
  {
    id: "EV-8987",
    cartId: "CL-4776",
    cliente: "Aline Cavalcanti",
    contato: "aline.cavalcanti@gmail.com",
    canal: "E-mail",
    etapa: "E-mail 48h",
    assunto: "Frete grátis liberado no seu Kit Anti-idade",
    enviadoEm: "17/08 08:30",
    status: "clicado",
    timeline: [
      { status: "enviado", em: "17/08 08:30" },
      { status: "entregue", em: "17/08 08:31" },
      { status: "clicado", em: "17/08 12:58" },
    ],
  },
  {
    id: "EV-8981",
    cartId: "CL-4776",
    cliente: "Aline Cavalcanti",
    contato: "+55 85 98470-2219",
    canal: "WhatsApp",
    etapa: "WhatsApp 5d",
    assunto: "Posso reservar seu kit por 24h?",
    enviadoEm: "21/08 09:15",
    status: "respondido",
    timeline: [
      { status: "enviado", em: "21/08 09:15" },
      { status: "entregue", em: "21/08 09:15" },
      { status: "clicado", em: "21/08 09:40" },
      { status: "respondido", em: "21/08 09:52" },
    ],
  },
  {
    id: "EV-8975",
    cartId: "CL-4770",
    cliente: "Marcos Vinícius Prado",
    contato: "mv.prado@gmail.com",
    canal: "E-mail",
    etapa: "E-mail 48h",
    assunto: "Kit Barba & Pele com avaliações 4,9★",
    enviadoEm: "18/08 07:50",
    status: "entregue",
    timeline: [
      { status: "enviado", em: "18/08 07:50" },
      { status: "entregue", em: "18/08 07:51" },
    ],
  },
  {
    id: "EV-8969",
    cartId: "CL-4762",
    cliente: "Fernanda Ribeiro",
    contato: "+55 11 97722-1189",
    canal: "WhatsApp",
    etapa: "WhatsApp 24h",
    assunto: "Sua paleta nude ainda está no carrinho",
    enviadoEm: "18/08 19:04",
    status: "respondido",
    timeline: [
      { status: "enviado", em: "18/08 19:04" },
      { status: "entregue", em: "18/08 19:04" },
      { status: "clicado", em: "18/08 19:22" },
      { status: "respondido", em: "18/08 19:31" },
    ],
  },
  {
    id: "EV-8962",
    cartId: "CL-4755",
    cliente: "Larissa Andrade",
    contato: "larissa.andrade@yahoo.com",
    canal: "E-mail",
    etapa: "Cupom 10% segmentado",
    assunto: "10% off no Vanille Rouge — só hoje",
    enviadoEm: "17/08 10:10",
    status: "respondido",
    timeline: [
      { status: "enviado", em: "17/08 10:10" },
      { status: "entregue", em: "17/08 10:10" },
      { status: "clicado", em: "17/08 10:35" },
      { status: "respondido", em: "17/08 10:58" },
    ],
  },
  {
    id: "EV-8955",
    cartId: "CL-4741",
    cliente: "Beatriz Sampaio",
    contato: "bia.sampaio@gmail.com",
    canal: "E-mail",
    etapa: "E-mail 48h",
    assunto: "Seu gloss favorito voltou ao estoque",
    enviadoEm: "13/08 09:00",
    status: "enviado",
    timeline: [{ status: "enviado", em: "13/08 09:00" }],
  },
  {
    id: "EV-8949",
    cartId: "CL-4736",
    cliente: "Sofia Menezes",
    contato: "sofia.menezes@gmail.com",
    canal: "E-mail",
    etapa: "E-mail 1h",
    assunto: "Faltou 1 passo para fechar seu kit skincare",
    enviadoEm: "20/08 15:26",
    status: "clicado",
    timeline: [
      { status: "enviado", em: "20/08 15:26" },
      { status: "entregue", em: "20/08 15:26" },
      { status: "clicado", em: "20/08 16:12" },
    ],
  },
  {
    id: "EV-8941",
    cartId: "CL-4728",
    cliente: "Gustavo Rocha",
    contato: "+55 11 98004-7719",
    canal: "WhatsApp",
    etapa: "WhatsApp 24h",
    assunto: "Oud Royale com brinde de kit presente",
    enviadoEm: "19/08 20:41",
    status: "clicado",
    timeline: [
      { status: "enviado", em: "19/08 20:41" },
      { status: "entregue", em: "19/08 20:41" },
      { status: "clicado", em: "19/08 22:14" },
    ],
  },
  {
    id: "EV-8933",
    cartId: "CL-4719",
    cliente: "Helena Duarte",
    contato: "+55 19 99655-3312",
    canal: "WhatsApp",
    etapa: "WhatsApp 5d",
    assunto: "Checkout como convidado liberado",
    enviadoEm: "21/08 08:12",
    status: "entregue",
    timeline: [
      { status: "enviado", em: "21/08 08:12" },
      { status: "entregue", em: "21/08 08:12" },
    ],
  },
  {
    id: "EV-8927",
    cartId: "CL-4712",
    cliente: "Vanessa Portela",
    contato: "vanessa.portela@gmail.com",
    canal: "E-mail",
    etapa: "Frete grátis progressivo",
    assunto: "Frete grátis aplicado no seu carrinho",
    enviadoEm: "14/08 11:47",
    status: "respondido",
    timeline: [
      { status: "enviado", em: "14/08 11:47" },
      { status: "entregue", em: "14/08 11:47" },
      { status: "clicado", em: "14/08 12:05" },
      { status: "respondido", em: "14/08 12:20" },
    ],
  },
];

/* ---------------------------------------------------------------- */
/* Templates de mensagem (e-mail e WhatsApp) com variáveis dinâmicas */
/* ---------------------------------------------------------------- */

export type TemplateVariableKey =
  | "nome_cliente"
  | "produto"
  | "frete_estimado"
  | "cupom";

export type TemplateVariable = {
  key: TemplateVariableKey;
  token: string;
  label: string;
  descricao: string;
  exemplo: string;
};

export const templateVariables: TemplateVariable[] = [
  {
    key: "nome_cliente",
    token: "{{nome_cliente}}",
    label: "Nome do cliente",
    descricao: "Primeiro nome de quem abandonou o carrinho.",
    exemplo: "Juliana",
  },
  {
    key: "produto",
    token: "{{produto}}",
    label: "Produto",
    descricao: "Item de maior valor no carrinho.",
    exemplo: "Sérum Vitamina C 30ml",
  },
  {
    key: "frete_estimado",
    token: "{{frete_estimado}}",
    label: "Frete estimado",
    descricao: "Frete calculado pelo CEP do cliente.",
    exemplo: "R$ 18,90",
  },
  {
    key: "cupom",
    token: "{{cupom}}",
    label: "Cupom",
    descricao: "Cupom liberado pela regra de valor do carrinho.",
    exemplo: "VOLTA10",
  },
];

export type MessageTemplate = {
  id: string;
  nome: string;
  canal: SendChannel;
  etapa: string;
  assunto: string;
  corpo: string;
  ativo: boolean;
  atualizadoEm: string;
};

export const messageTemplates: MessageTemplate[] = [
  {
    id: "tpl-email-1",
    nome: "Lembrete gentil (1ª hora)",
    canal: "E-mail",
    etapa: "Etapa 1 · 1h após o abandono",
    assunto: "{{nome_cliente}}, seu {{produto}} ainda está reservado",
    corpo:
      "Oi {{nome_cliente}}, tudo bem?\n\nSeparamos o seu {{produto}} e ele continua no carrinho esperando por você.\n\nO frete para o seu endereço fica em {{frete_estimado}} e a entrega acontece em poucos dias úteis.\n\nQuer finalizar agora? É só clicar no botão abaixo e o carrinho volta pronto, com tudo do jeito que você deixou.\n\nQualquer dúvida, responda este e-mail — a gente lê de verdade.\n\nEquipe Belle Aura",
    ativo: true,
    atualizadoEm: "22/08 09:12",
  },
  {
    id: "tpl-whats-1",
    nome: "WhatsApp com cupom (24h)",
    canal: "WhatsApp",
    etapa: "Etapa 2 · 24h após o abandono",
    assunto: "Recuperação com incentivo",
    corpo:
      "Oi {{nome_cliente}}! 💛\n\nVi que você deixou o {{produto}} no carrinho da Belle Aura.\n\nLiberei o cupom {{cupom}} para você fechar hoje, e o frete sai por {{frete_estimado}}.\n\nQuer que eu finalize o pedido por aqui?",
    ativo: true,
    atualizadoEm: "23/08 16:40",
  },
  {
    id: "tpl-email-2",
    nome: "Última chance (72h)",
    canal: "E-mail",
    etapa: "Etapa 3 · 72h após o abandono",
    assunto: "Última chance: {{cupom}} expira hoje, {{nome_cliente}}",
    corpo:
      "{{nome_cliente}}, este é o último aviso sobre o seu carrinho.\n\nO {{produto}} sai do estoque reservado hoje à noite e o cupom {{cupom}} expira junto.\n\nFrete estimado: {{frete_estimado}}.\n\nSe preferir trocar por outro item, responda aqui que ajudamos na escolha.\n\nEquipe Belle Aura",
    ativo: false,
    atualizadoEm: "20/08 11:05",
  },
];

/* ---------------------------------------------------------------- */
/* Testes A/B de envio                                              */
/* ---------------------------------------------------------------- */

export type AbVariantStats = {
  templateId: string;
  rotulo: "A" | "B";
  nome: string;
  enviados: number;
  entregues: number;
  cliques: number;
  respostas: number;
  compras: number;
  receita: number;
};

export type AbExperiment = {
  id: string;
  nome: string;
  canal: SendChannel;
  etapa: string;
  status: "rodando" | "pausado" | "encerrado";
  inicio: string;
  divisao: number; // % do tráfego enviado para a variante A
  variantes: [AbVariantStats, AbVariantStats];
};

export const abExperiments: AbExperiment[] = [
  {
    id: "ab-email-1h",
    nome: "Lembrete 1h — gentil x direto",
    canal: "E-mail",
    etapa: "Etapa 1 · 1h após o abandono",
    status: "rodando",
    inicio: "18/08",
    divisao: 50,
    variantes: [
      {
        templateId: "tpl-email-1",
        rotulo: "A",
        nome: "Lembrete gentil (1ª hora)",
        enviados: 412,
        entregues: 402,
        cliques: 118,
        respostas: 21,
        compras: 34,
        receita: 8420.5,
      },
      {
        templateId: "tpl-email-2",
        rotulo: "B",
        nome: "Última chance (72h)",
        enviados: 408,
        entregues: 396,
        cliques: 92,
        respostas: 14,
        compras: 25,
        receita: 6180.9,
      },
    ],
  },
  {
    id: "ab-whats-24h",
    nome: "WhatsApp 24h — cupom x frete grátis",
    canal: "WhatsApp",
    etapa: "Etapa 2 · 24h após o abandono",
    status: "rodando",
    inicio: "20/08",
    divisao: 60,
    variantes: [
      {
        templateId: "tpl-whats-1",
        rotulo: "A",
        nome: "WhatsApp com cupom (24h)",
        enviados: 246,
        entregues: 240,
        cliques: 96,
        respostas: 58,
        compras: 31,
        receita: 7310.2,
      },
      {
        templateId: "tpl-whats-2",
        rotulo: "B",
        nome: "WhatsApp foco em frete grátis",
        enviados: 164,
        entregues: 160,
        cliques: 71,
        respostas: 44,
        compras: 24,
        receita: 5940.4,
      },
    ],
  },
];
