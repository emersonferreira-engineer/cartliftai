import { createServerFn } from "@tanstack/react-start";

export type TemplateVariacao = {
  rotulo: string;
  angulo: string;
  assunto: string;
  corpo: string;
};

type Input = {
  canal: "E-mail" | "WhatsApp";
  nome: string;
  assunto: string;
  corpo: string;
  instrucao: string;
  quantidade: number;
};

export const gerarVariacoesTemplate = createServerFn({ method: "POST" })
  .inputValidator((data: Input) => {
    if (!data || typeof data.corpo !== "string" || data.corpo.trim().length < 20) {
      throw new Error("Escreva o corpo da mensagem antes de gerar variações.");
    }
    return {
      canal: data.canal === "WhatsApp" ? ("WhatsApp" as const) : ("E-mail" as const),
      nome: String(data.nome ?? "").slice(0, 120),
      assunto: String(data.assunto ?? "").slice(0, 300),
      corpo: data.corpo.slice(0, 4000),
      instrucao: String(data.instrucao ?? "").slice(0, 500),
      quantidade: Math.min(Math.max(Number(data.quantidade) || 3, 2), 4),
    };
  })
  .handler(async ({ data }) => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) {
      return { variacoes: [] as TemplateVariacao[], error: "IA indisponível no momento." };
    }

    const prompt = `Você é copywriter de retenção da Belle Aura, marca brasileira de cosméticos veganos.
Reescreva o template abaixo em ${data.quantidade} variações diferentes para teste A/B no canal ${data.canal}.

Regras obrigatórias:
- Escreva em português do Brasil, tom acolhedor e humano, sem exagero comercial.
- Mantenha exatamente as variáveis presentes no original: {{nome_cliente}}, {{produto}}, {{frete_estimado}}, {{cupom}} (use as mesmas que aparecem no original).
- Nunca invente promessas, prazos, descontos ou depoimentos.
- ${data.canal === "WhatsApp" ? "Máximo 500 caracteres, linguagem de conversa, no máximo 1 emoji." : "Assunto com até 60 caracteres e corpo em parágrafos curtos."}
- Cada variação deve explorar um ângulo distinto (ex.: urgência leve, foco em frete, prova de reserva do item, benefício do produto).
${data.instrucao ? `- Instrução extra do usuário: ${data.instrucao}` : ""}

Template original ("${data.nome}"):
Assunto: ${data.assunto}
Corpo:
${data.corpo}

Responda SOMENTE com JSON válido no formato:
{"variacoes":[{"rotulo":"Variação 1","angulo":"...","assunto":"...","corpo":"..."}]}`;

    try {
      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (response.status === 429) {
        return { variacoes: [], error: "Limite de uso da IA atingido. Tente novamente em instantes." };
      }
      if (response.status === 402) {
        return { variacoes: [], error: "Créditos de IA esgotados no workspace." };
      }
      if (!response.ok) {
        console.error("AI gateway error", response.status, await response.text());
        return { variacoes: [], error: "Não foi possível gerar as variações agora." };
      }

      const json = (await response.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
      };
      const raw = json.choices?.[0]?.message?.content ?? "";
      const match = raw.match(/\{[\s\S]*\}/);
      if (!match) return { variacoes: [], error: "A IA respondeu em formato inesperado." };

      const parsed = JSON.parse(match[0]) as { variacoes?: unknown };
      const list = Array.isArray(parsed.variacoes) ? parsed.variacoes : [];
      const variacoes: TemplateVariacao[] = list
        .map((item, index) => {
          const v = item as Record<string, unknown>;
          return {
            rotulo: String(v["rotulo"] ?? `Variação ${index + 1}`),
            angulo: String(v["angulo"] ?? ""),
            assunto: String(v["assunto"] ?? data.assunto),
            corpo: String(v["corpo"] ?? ""),
          };
        })
        .filter((v) => v.corpo.trim().length > 0)
        .slice(0, 4);

      if (variacoes.length === 0) {
        return { variacoes: [], error: "A IA não retornou variações utilizáveis." };
      }
      return { variacoes, error: null as string | null };
    } catch (error) {
      console.error("gerarVariacoesTemplate falhou", error);
      return { variacoes: [], error: "Falha ao contatar a IA. Tente novamente." };
    }
  });
