# CARTLIFT 

Você é um profissional multidisciplinar com mais de 30 anos de experiência em 
desenvolvimento de software, automação digital, design de produto (UI/UX) e 
estratégia de negócios voltada para ecommerce, vendas e marketing. Você já 
trabalhou no desenvolvimento de plataformas SaaS de sucesso reconhecidas 
mundialmente e domina profundamente psicologia das cores, hierarquia visual, 
usabilidade e conversão de interfaces para venda.

Quero que você construa um SaaS profissional chamado CartLift.com — uma 
plataforma de recuperação de carrinho abandonado, diagnóstico de vendas e 
otimização de site para ecommerce, com foco em quatro pilares centrais:

1. RECUPERAÇÃO — identificar clientes que abandonaram o carrinho e 
   reengajá-los automaticamente via régua de comunicação (email e WhatsApp).
2. DIAGNÓSTICO — analisar e apresentar os motivos prováveis do abandono 
   (frete, preço, checkout longo, indecisão, cadastro obrigatório), com 
   dados cruzados por produto, categoria e etapa do funil.
3. GERAÇÃO DE RECEITA — apresentar sugestões de ação práticas geradas por 
   IA (ex: ativar frete grátis progressivo, oferecer cupom segmentado por 
   valor do carrinho) e projetar o impacto financeiro de cada ação.
4. OTIMIZAÇÃO DE SITE — um assistente que analisa o site do cliente a 
   partir de uma URL informada e aponta pontos de melhoria de conversão 
   (ex: botão de compra pouco visível, ausência de destaque em elementos 
   estratégicos, falta de tradução para outros idiomas) com sugestões 
   práticas de SEO, usabilidade e internacionalização do site.

TELA DE ENTRADA (estilo login do HubSpot):
- Tela inicial com campo de email e senha antes de acessar o painel
- Email de exemplo: emerson@cartlift.com
- Senha de exemplo: 08061980
- Após login, o usuário acessa o dashboard completo

ESTRUTURA DO APLICATIVO:
- Dashboard principal com: taxa de abandono, receita recuperada no mês, 
  carrinhos ativos na régua, gráfico de evolução semanal
- Painel de "Carrinhos Abandonados" segmentado por tempo parado (1 dia, 
  2 dias, 5+ dias) e por valor (baixo, médio, alto ticket)
- Painel de "Diagnóstico por IA" mostrando motivo provável de abandono 
  por categoria de produto, com sugestão de ação
- Painel de "Segurança" mostrando o código de verificação único gerado 
  por cliente, como proteção contra golpes usando o nome da loja
- Painel de "Otimização de Site" — campo para inserir a URL do site do 
  cliente, retornando uma lista de pontos de melhoria (ex: botão de CTA 
  pouco visível, seção de produto em destaque mal aproveitada, ausência 
  de seletor de idiomas) com ícone de bandeiras para tradução multi-idioma 
  e estimativa de impacto em conversão e alcance internacional
- Relatório semanal automático gerado por IA, em linguagem simples, 
  como se fosse escrito por um analista para o dono da loja
- Área de configuração da régua (email, WhatsApp, dias de disparo, 
  regras por valor de carrinho)

DADOS: Preencha toda a plataforma com dados fictícios realistas de um 
ecommerce de cosméticos — skincare, batom, maquiagem e perfumes, produtos 
de recompra recorrente, com público de mulheres, homens e crianças. Use 
nomes de clientes, produtos, valores e datas fictícios, condizentes com 
esse segmento. O administrador da conta deve se chamar Emerson Ferreira, 
com cargo de Engenheiro de Inteligência Artificial / Analista de Marketing.

DESIGN: Use psicologia das cores de forma intencional — tons que 
transmitam confiança, tecnologia e urgência controlada (ex: azul para 
confiança/dados, verde para conversão/receita positiva, laranja ou 
âmbar para alertas de carrinho parado, nunca vermelho agressivo). 
Layout limpo, moderno, com boa hierarquia visual, tipografia legível, 
espaçamento generoso e microinterações que tornem a navegação intuitiva 
mesmo para um usuário leigo (dono de loja sem conhecimento técnico).

REFERÊNCIA DE QUALIDADE: Espelhe-se nos melhores SaaS de mercado 
(Klaviyo, HubSpot, Stripe Dashboard, Linear) em termos de padrão visual 
e experiência de uso, e busque superar esse padrão em clareza e 
capacidade de gerar interesse imediato de compra em quem visualizar 
a plataforma pela primeira vez.

Construa isso como um produto profissional, pronto para ser apresentado 
a potenciais clientes e investidores.

Garanta que os dados fictícios (clientes, produtos, valores) sejam 

consistentes entre todas as telas do dashboard, como se viessem de 

um banco de dados real.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://cartliftai.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/20543d22-9450-41da-8bf8-7a4b45017337).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
