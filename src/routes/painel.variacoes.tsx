import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Check, Copy, Mail, MessageCircle, Sparkles, Wand2 } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/cartlift/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  gerarVariacoesTemplate,
  type TemplateVariacao,
} from "@/lib/ai-templates.functions";
import { carts, messageTemplates, templateVariables } from "@/lib/cartlift-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/painel/variacoes")({
  head: () => ({
    meta: [
      { title: "Variações com IA — CartLift" },
      {
        name: "description",
        content:
          "Gere variações do mesmo template de e-mail ou WhatsApp com IA e compare as versões lado a lado antes de enviar.",
      },
      { property: "og:title", content: "Variações com IA — CartLift" },
      {
        property: "og:description",
        content:
          "Reescreva templates de recuperação com IA, compare ângulos diferentes e escolha a versão antes do disparo.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: VariacoesPage,
});

function firstName(full: string) {
  return full.split(" ")[0] ?? full;
}

function VariacoesPage() {
  const gerar = useServerFn(gerarVariacoesTemplate);
  const [templateId, setTemplateId] = useState(messageTemplates[0]!.id);
  const [instrucao, setInstrucao] = useState(
    "Tom mais direto, foco em frete grátis e urgência leve.",
  );
  const [quantidade, setQuantidade] = useState("3");
  const [loading, setLoading] = useState(false);
  const [variacoes, setVariacoes] = useState<TemplateVariacao[]>([]);
  const [escolhida, setEscolhida] = useState<string | null>(null);
  const [preview, setPreview] = useState(true);

  const template = messageTemplates.find((t) => t.id === templateId)!;
  const cart = carts[0]!;

  const values = useMemo<Record<string, string>>(
    () => ({
      nome_cliente: firstName(cart.cliente),
      produto: cart.itens[0] ?? "seu produto",
      frete_estimado: "R$ 18,90",
      cupom: "VOLTA10",
    }),
    [cart],
  );

  const render = (text: string) =>
    preview
      ? text.replace(/\{\{\s*(\w+)\s*\}\}/g, (m, k: string) => values[k] ?? m)
      : text;

  const handleGerar = async () => {
    setLoading(true);
    setEscolhida(null);
    try {
      const result = await gerar({
        data: {
          canal: template.canal,
          nome: template.nome,
          assunto: template.assunto,
          corpo: template.corpo,
          instrucao,
          quantidade: Number(quantidade),
        },
      });
      if (result.error || result.variacoes.length === 0) {
        setVariacoes([]);
        toast.error(result.error ?? "Nenhuma variação gerada.");
        return;
      }
      setVariacoes(result.variacoes);
      toast.success(`${result.variacoes.length} variações geradas para comparação.`);
    } catch {
      toast.error("Não foi possível gerar as variações agora.");
    } finally {
      setLoading(false);
    }
  };

  const copiar = async (v: TemplateVariacao) => {
    const texto =
      template.canal === "E-mail" ? `Assunto: ${v.assunto}\n\n${v.corpo}` : v.corpo;
    try {
      await navigator.clipboard.writeText(texto);
      toast.success("Variação copiada. Cole no editor de templates.");
    } catch {
      toast.error("Não foi possível copiar automaticamente.");
    }
  };

  const variaveisFaltando = (texto: string) =>
    templateVariables.filter(
      (v) => template.corpo.includes(v.token) && !texto.includes(v.token),
    );

  const CanalIcone = template.canal === "E-mail" ? Mail : MessageCircle;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Variações com IA"
        description="Peça à IA novas versões do mesmo template, compare os ângulos lado a lado e leve a melhor para o teste A/B."
        badge="Copy assistida"
      />

      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_180px]">
          <div className="space-y-2">
            <Label>Template base</Label>
            <Select value={templateId} onValueChange={setTemplateId}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {messageTemplates.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.nome} · {t.canal}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Variações</Label>
            <Select value={quantidade} onValueChange={setQuantidade}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["2", "3", "4"].map((n) => (
                  <SelectItem key={n} value={n}>
                    {n} versões
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <Label htmlFor="instrucao">Direção criativa</Label>
          <Input
            id="instrucao"
            value={instrucao}
            onChange={(e) => setInstrucao(e.target.value)}
            placeholder="Ex.: tom mais direto, foco em frete grátis, urgência leve"
          />
          <p className="text-xs text-muted-foreground">
            As variáveis do template original são preservadas em todas as versões.
          </p>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button onClick={handleGerar} disabled={loading}>
            <Wand2 className="mr-2 h-4 w-4" />
            {loading ? "Gerando variações…" : "Gerar variações com IA"}
          </Button>
          <Button variant="outline" onClick={() => setPreview((p) => !p)}>
            {preview ? "Ver com variáveis" : "Ver com dados reais"}
          </Button>
          <Badge variant="secondary" className="gap-1">
            <CanalIcone className="h-3.5 w-3.5" />
            {template.canal}
          </Badge>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Versão atual</h2>
            <Badge variant="outline">Original</Badge>
          </div>
          {template.canal === "E-mail" && (
            <p className="mt-3 text-sm font-medium">{render(template.assunto)}</p>
          )}
          <Textarea
            readOnly
            value={render(template.corpo)}
            className="mt-3 min-h-56 resize-none bg-muted/40 text-sm"
          />
        </article>

        {variacoes.length === 0 ? (
          <article className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-card/60 p-8 text-center">
            <Sparkles className="h-6 w-6 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Nenhuma variação gerada ainda. Defina a direção criativa e clique em
              “Gerar variações com IA”.
            </p>
          </article>
        ) : (
          <div className="space-y-4">
            {variacoes.map((v) => {
              const faltando = variaveisFaltando(`${v.assunto} ${v.corpo}`);
              const ativa = escolhida === v.rotulo;
              return (
                <article
                  key={v.rotulo}
                  className={cn(
                    "rounded-2xl border bg-card p-5 shadow-sm transition",
                    ativa ? "border-primary ring-1 ring-primary/30" : "border-border",
                  )}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold">{v.rotulo}</h3>
                    {v.angulo && <Badge variant="secondary">{v.angulo}</Badge>}
                  </div>
                  {template.canal === "E-mail" && (
                    <p className="mt-3 text-sm font-medium">{render(v.assunto)}</p>
                  )}
                  <p className="mt-3 whitespace-pre-wrap text-sm text-muted-foreground">
                    {render(v.corpo)}
                  </p>
                  {faltando.length > 0 && (
                    <p className="mt-3 text-xs text-destructive">
                      Variáveis ausentes: {faltando.map((f) => f.token).join(", ")}
                    </p>
                  )}
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant={ativa ? "default" : "outline"}
                      onClick={() => {
                        setEscolhida(v.rotulo);
                        toast.success(`${v.rotulo} marcada como versão preferida.`);
                      }}
                    >
                      <Check className="mr-2 h-4 w-4" />
                      {ativa ? "Versão escolhida" : "Escolher versão"}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => copiar(v)}>
                      <Copy className="mr-2 h-4 w-4" />
                      Copiar
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
