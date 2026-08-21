import { createFileRoute } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Brain, Lightbulb, Target, TrendingUp } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/cartlift/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { brl, diagnoses, funnelStages } from "@/lib/cartlift-data";

export const Route = createFileRoute("/painel/diagnostico")({
  head: () => ({
    meta: [
      { title: "Diagnóstico por IA — CartLift" },
      {
        name: "description",
        content:
          "Motivo provável de abandono por categoria de produto e etapa do funil, com ação sugerida e projeção de receita.",
      },
      { property: "og:title", content: "Diagnóstico por IA — CartLift" },
      { property: "og:description", content: "Por que seus clientes não finalizam a compra." },
    ],
  }),
  component: DiagnosisPage,
});

function DiagnosisPage() {
  const impactoTotal = diagnoses.reduce((sum, d) => sum + d.impacto, 0);
  const paradoTotal = diagnoses.reduce((sum, d) => sum + d.valorParado, 0);

  return (
    <>
      <PageHeader
        eyebrow="Diagnóstico"
        title="Por que seus clientes desistem"
        description="A IA cruza produto, categoria e etapa do funil para explicar o abandono em linguagem simples — e sugere a ação com maior retorno."
        actions={
          <Button onClick={() => toast.success("Diagnóstico reprocessado com os dados de hoje.")}>
            <Brain className="h-4 w-4" /> Reprocessar diagnóstico
          </Button>
        }
      />

      <section className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
        <div className="card-surface p-5">
          <h2 className="text-base font-semibold">Funil de vendas — onde o dinheiro escapa</h2>
          <p className="text-sm text-muted-foreground">Pessoas por etapa nos últimos 30 dias</p>
          <div className="mt-5 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelStages} layout="vertical" margin={{ left: 40, right: 16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                <XAxis type="number" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} />
                <YAxis
                  type="category"
                  dataKey="etapa"
                  stroke="var(--muted-foreground)"
                  fontSize={11}
                  width={120}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  cursor={{ fill: "var(--muted)" }}
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid var(--border)",
                    background: "var(--card)",
                    fontSize: 12,
                  }}
                  formatter={(value: number) => [value.toLocaleString("pt-BR"), "Pessoas"]}
                />
                <Bar dataKey="pessoas" fill="var(--chart-1)" radius={[0, 6, 6, 0]} maxBarSize={26} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-4">
          <div className="card-surface p-5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-warning-soft text-warning-foreground">
              <Target className="h-4.5 w-4.5" />
            </span>
            <p className="mt-3 text-sm text-muted-foreground">Valor parado mapeado</p>
            <p className="numeric text-3xl font-extrabold">{brl(paradoTotal)}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              distribuído em {diagnoses.reduce((s, d) => s + d.abandonos, 0)} carrinhos
            </p>
          </div>
          <div className="card-surface bg-gradient-revenue p-5 text-primary-foreground">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-foreground/20">
              <TrendingUp className="h-4.5 w-4.5" />
            </span>
            <p className="mt-3 text-sm opacity-85">Receita adicional projetada</p>
            <p className="numeric text-3xl font-extrabold">{brl(impactoTotal)}/mês</p>
            <p className="mt-1 text-xs opacity-80">se as 5 ações abaixo forem aplicadas</p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Diagnóstico por categoria de produto</h2>
        {diagnoses.map((d) => (
          <article key={d.categoria} className="card-surface hover-lift p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge>{d.categoria}</Badge>
                  <Badge variant="secondary">Etapa crítica: {d.etapaCritica}</Badge>
                  <span className="text-xs text-muted-foreground">
                    produto mais afetado: {d.produtoCritico}
                  </span>
                </div>
                <h3 className="mt-3 text-base font-semibold">{d.motivo}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {d.abandonos} carrinhos abandonados · {brl(d.valorParado)} parados nesta categoria.
                </p>
                <div className="mt-4 flex items-start gap-3 rounded-xl bg-primary-soft p-4">
                  <Lightbulb className="mt-0.5 h-4.5 w-4.5 shrink-0 text-primary" />
                  <div>
                    <p className="text-sm font-semibold text-accent-foreground">Ação sugerida</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">{d.acao}</p>
                  </div>
                </div>
              </div>

              <div className="w-full max-w-56 space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground">Confiança da IA</p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <Progress value={d.confianca} className="h-2" />
                    <span className="numeric text-sm font-semibold">{d.confianca}%</span>
                  </div>
                </div>
                <div className="rounded-xl bg-success-soft p-3">
                  <p className="text-xs text-success">Impacto financeiro estimado</p>
                  <p className="numeric text-xl font-extrabold text-success">{brl(d.impacto)}/mês</p>
                </div>
                <Button
                  className="w-full"
                  onClick={() => toast.success(`Ação ativada para ${d.categoria}.`)}
                >
                  Ativar ação
                </Button>
              </div>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
