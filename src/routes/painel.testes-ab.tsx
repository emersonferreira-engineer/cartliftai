import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Mail, MessageCircle, Pause, Play, Trophy } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/cartlift/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  abExperiments,
  brlExact,
  messageTemplates,
  type AbExperiment,
  type AbVariantStats,
} from "@/lib/cartlift-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/painel/testes-ab")({
  head: () => ({
    meta: [
      { title: "Testes A/B de envio — CartLift" },
      {
        name: "description",
        content:
          "Alterne dois templates no mesmo disparo e compare taxa de clique, resposta e receita por canal de e-mail e WhatsApp.",
      },
      { property: "og:title", content: "Testes A/B de envio — CartLift" },
      {
        property: "og:description",
        content:
          "Divida o tráfego entre duas versões da mensagem e acompanhe clique, resposta e conversão por canal.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TestesAbPage,
});

const pct = (part: number, total: number) =>
  total === 0 ? 0 : Number(((part / total) * 100).toFixed(1));

function VariantCard({
  variante,
  experimento,
  vencedora,
}: {
  variante: AbVariantStats;
  experimento: AbExperiment;
  vencedora: boolean;
}) {
  const clique = pct(variante.cliques, variante.entregues);
  const resposta = pct(variante.respostas, variante.entregues);
  const conversao = pct(variante.compras, variante.entregues);

  return (
    <article
      className={cn(
        "rounded-2xl border bg-card p-5 shadow-sm",
        vencedora ? "border-success ring-1 ring-success/30" : "border-border",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-sm font-semibold text-primary">
              {variante.rotulo}
            </span>
            <h3 className="text-sm font-semibold">{variante.nome}</h3>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {variante.rotulo === "A" ? experimento.divisao : 100 - experimento.divisao}% do
            tráfego · {variante.enviados} envios
          </p>
        </div>
        {vencedora && (
          <Badge className="gap-1 bg-success text-success-foreground">
            <Trophy className="h-3.5 w-3.5" />
            Liderando
          </Badge>
        )}
      </div>

      <dl className="mt-4 grid grid-cols-3 gap-3 text-center">
        <div className="rounded-xl bg-muted/50 p-3">
          <dt className="text-xs text-muted-foreground">Clique</dt>
          <dd className="text-lg font-semibold">{clique}%</dd>
        </div>
        <div className="rounded-xl bg-muted/50 p-3">
          <dt className="text-xs text-muted-foreground">Resposta</dt>
          <dd className="text-lg font-semibold">{resposta}%</dd>
        </div>
        <div className="rounded-xl bg-muted/50 p-3">
          <dt className="text-xs text-muted-foreground">Compra</dt>
          <dd className="text-lg font-semibold">{conversao}%</dd>
        </div>
      </dl>

      <div className="mt-4 space-y-2 text-xs text-muted-foreground">
        <div className="flex items-center justify-between">
          <span>Entregues</span>
          <span className="font-medium text-foreground">{variante.entregues}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Cliques / respostas</span>
          <span className="font-medium text-foreground">
            {variante.cliques} / {variante.respostas}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>Receita atribuída</span>
          <span className="font-medium text-foreground">{brlExact(variante.receita)}</span>
        </div>
      </div>
    </article>
  );
}

function TestesAbPage() {
  const [experimentos, setExperimentos] = useState<AbExperiment[]>(abExperiments);
  const [selecionado, setSelecionado] = useState(abExperiments[0]!.id);

  const experimento = experimentos.find((e) => e.id === selecionado)!;
  const [a, b] = experimento.variantes;

  const metrica = (v: AbVariantStats) => pct(v.cliques, v.entregues) + pct(v.respostas, v.entregues);
  const lider = metrica(a) === metrica(b) ? null : metrica(a) > metrica(b) ? "A" : "B";

  const porCanal = useMemo(() => {
    const canais: Array<"E-mail" | "WhatsApp"> = ["E-mail", "WhatsApp"];
    return canais.map((canal) => {
      const vars = experimentos
        .filter((e) => e.canal === canal)
        .flatMap((e) => e.variantes);
      const entregues = vars.reduce((s, v) => s + v.entregues, 0);
      const cliques = vars.reduce((s, v) => s + v.cliques, 0);
      const respostas = vars.reduce((s, v) => s + v.respostas, 0);
      const receita = vars.reduce((s, v) => s + v.receita, 0);
      return { canal, entregues, cliques, respostas, receita };
    });
  }, [experimentos]);

  const alternarStatus = () => {
    setExperimentos((prev) =>
      prev.map((e) =>
        e.id === experimento.id
          ? { ...e, status: e.status === "rodando" ? "pausado" : "rodando" }
          : e,
      ),
    );
    toast.success(
      experimento.status === "rodando"
        ? "Teste pausado — os próximos envios usam apenas a variante A."
        : "Teste retomado — a divisão de tráfego voltou a valer.",
    );
  };

  const trocarDivisao = (valor: string) => {
    setExperimentos((prev) =>
      prev.map((e) => (e.id === experimento.id ? { ...e, divisao: Number(valor) } : e)),
    );
    toast.success(`Divisão ajustada para ${valor}% na variante A.`);
  };

  const trocarTemplate = (rotulo: "A" | "B", templateId: string) => {
    const tpl = messageTemplates.find((t) => t.id === templateId);
    if (!tpl) return;
    setExperimentos((prev) =>
      prev.map((e) =>
        e.id === experimento.id
          ? {
              ...e,
              variantes: e.variantes.map((v) =>
                v.rotulo === rotulo ? { ...v, templateId: tpl.id, nome: tpl.nome } : v,
              ) as [AbVariantStats, AbVariantStats],
            }
          : e,
      ),
    );
    toast.success(`Variante ${rotulo} agora usa “${tpl.nome}”.`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Testes A/B de envio"
        description="Alterne dois templates no mesmo ponto da régua e acompanhe clique, resposta e receita por canal."
        badge="Experimentos"
      />

      <section className="grid gap-4 sm:grid-cols-2">
        {porCanal.map((c) => (
          <article
            key={c.canal}
            className="rounded-2xl border border-border bg-card p-5 shadow-sm"
          >
            <div className="flex items-center gap-2">
              {c.canal === "E-mail" ? (
                <Mail className="h-4 w-4 text-primary" />
              ) : (
                <MessageCircle className="h-4 w-4 text-primary" />
              )}
              <h2 className="text-sm font-semibold">{c.canal}</h2>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-xs text-muted-foreground">Clique</p>
                <p className="text-lg font-semibold">{pct(c.cliques, c.entregues)}%</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Resposta</p>
                <p className="text-lg font-semibold">{pct(c.respostas, c.entregues)}%</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Receita</p>
                <p className="text-lg font-semibold">{brlExact(c.receita)}</p>
              </div>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              {c.entregues} mensagens entregues nos testes ativos deste canal.
            </p>
          </article>
        ))}
      </section>

      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_160px_auto] md:items-end">
          <div className="space-y-2">
            <Label>Experimento</Label>
            <Select value={selecionado} onValueChange={setSelecionado}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {experimentos.map((e) => (
                  <SelectItem key={e.id} value={e.id}>
                    {e.nome} · {e.canal}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Divisão A/B</Label>
            <Select value={String(experimento.divisao)} onValueChange={trocarDivisao}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[30, 40, 50, 60, 70].map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n}% A / {100 - n}% B
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" onClick={alternarStatus}>
            {experimento.status === "rodando" ? (
              <>
                <Pause className="mr-2 h-4 w-4" />
                Pausar teste
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Retomar teste
              </>
            )}
          </Button>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <Badge variant={experimento.status === "rodando" ? "default" : "secondary"}>
            {experimento.status === "rodando" ? "Rodando" : "Pausado"}
          </Badge>
          <span>{experimento.etapa}</span>
          <span>· início {experimento.inicio}</span>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {(["A", "B"] as const).map((rotulo) => {
            const variante = experimento.variantes.find((v) => v.rotulo === rotulo)!;
            return (
              <div key={rotulo} className="space-y-2">
                <Label>Template da variante {rotulo}</Label>
                <Select
                  value={variante.templateId}
                  onValueChange={(value) => trocarTemplate(rotulo, value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {messageTemplates
                      .filter((t) => t.canal === experimento.canal)
                      .map((t) => (
                        <SelectItem key={t.id} value={t.id}>
                          {t.nome}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            );
          })}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {experimento.variantes.map((v) => (
          <VariantCard
            key={v.rotulo}
            variante={v}
            experimento={experimento}
            vencedora={lider === v.rotulo}
          />
        ))}
      </section>

      <p className="text-xs text-muted-foreground">
        A variante liderando é calculada pela soma das taxas de clique e resposta sobre
        mensagens entregues. Mantenha o teste rodando até acumular volume suficiente em
        cada canal antes de escolher o vencedor.
      </p>
    </div>
  );
}
