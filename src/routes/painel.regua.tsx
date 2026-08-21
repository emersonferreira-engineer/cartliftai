import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Clock, Mail, MessageCircle, Save, Wallet } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/cartlift/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ruleSteps, valueRules } from "@/lib/cartlift-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/painel/regua")({
  head: () => ({
    meta: [
      { title: "Régua de comunicação — CartLift" },
      {
        name: "description",
        content:
          "Configure a régua de recuperação: canais de e-mail e WhatsApp, dias de disparo e regras de incentivo por valor de carrinho.",
      },
      { property: "og:title", content: "Régua de comunicação — CartLift" },
      { property: "og:description", content: "Canais, horários e incentivos da recuperação automática." },
    ],
  }),
  component: RulesPage,
});

function RulesPage() {
  const [steps, setSteps] = useState(ruleSteps);
  const [values, setValues] = useState(valueRules);
  const [sender, setSender] = useState("atendimento@belleaura.com.br");
  const [whats, setWhats] = useState("+55 11 4002-8922");

  return (
    <>
      <PageHeader
        eyebrow="Configuração"
        title="Régua de comunicação"
        description="Defina quando falar, por qual canal e com qual incentivo. Cada etapa pode ser ligada ou desligada sem mexer em código."
        actions={
          <Button onClick={() => toast.success("Configuração da régua salva.")}>
            <Save className="h-4 w-4" /> Salvar alterações
          </Button>
        }
      />

      <section className="grid gap-5 lg:grid-cols-2">
        <div className="card-surface p-5">
          <div className="flex items-center gap-2">
            <Mail className="h-4.5 w-4.5 text-primary" />
            <h2 className="text-base font-semibold">Remetente de e-mail</h2>
          </div>
          <div className="mt-4 space-y-2">
            <Label htmlFor="sender">E-mail que aparece para o cliente</Label>
            <Input
              id="sender"
              value={sender}
              maxLength={255}
              onChange={(e) => setSender(e.target.value)}
              className="h-11"
            />
            <p className="text-xs text-muted-foreground">Domínio verificado · SPF e DKIM ativos</p>
          </div>
        </div>

        <div className="card-surface p-5">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-4.5 w-4.5 text-success" />
            <h2 className="text-base font-semibold">Número de WhatsApp Business</h2>
          </div>
          <div className="mt-4 space-y-2">
            <Label htmlFor="whats">Número usado nos disparos</Label>
            <Input
              id="whats"
              value={whats}
              maxLength={24}
              onChange={(e) => setWhats(e.target.value)}
              className="h-11"
            />
            <p className="text-xs text-muted-foreground">
              Conta oficial verificada · templates aprovados pela Meta
            </p>
          </div>
        </div>
      </section>

      <section className="card-surface p-5">
        <div className="flex items-center gap-2">
          <Clock className="h-4.5 w-4.5 text-primary" />
          <h2 className="text-base font-semibold">Etapas e dias de disparo</h2>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          A sequência começa a contar no momento em que o cliente sai do checkout.
        </p>
        <ul className="mt-5 space-y-3">
          {steps.map((step) => (
            <li
              key={step.id}
              className={cn(
                "flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border p-4",
                !step.ativo && "opacity-60",
              )}
            >
              <div className="flex items-start gap-3">
                <span
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg",
                    step.canal === "E-mail" ? "bg-primary-soft text-primary" : "bg-success-soft text-success",
                  )}
                >
                  {step.canal === "E-mail" ? (
                    <Mail className="h-4 w-4" />
                  ) : (
                    <MessageCircle className="h-4 w-4" />
                  )}
                </span>
                <div>
                  <p className="text-sm font-semibold">
                    Etapa {step.id} · {step.canal} — {step.atraso}
                  </p>
                  <p className="text-sm text-muted-foreground">{step.mensagem}</p>
                  <Badge variant="secondary" className="mt-2">
                    Incentivo: {step.incentivo}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">{step.ativo ? "Ativa" : "Pausada"}</span>
                <Switch
                  checked={step.ativo}
                  onCheckedChange={(checked) => {
                    setSteps((prev) =>
                      prev.map((s) => (s.id === step.id ? { ...s, ativo: checked } : s)),
                    );
                    toast.success(`Etapa ${step.id} ${checked ? "ativada" : "pausada"}.`);
                  }}
                  aria-label={`Ativar etapa ${step.id}`}
                />
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="card-surface p-5">
        <div className="flex items-center gap-2">
          <Wallet className="h-4.5 w-4.5 text-success" />
          <h2 className="text-base font-semibold">Regras por valor de carrinho</h2>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Desconto só onde ele se paga: carrinhos pequenos recebem lembrete, carrinhos grandes recebem
          atenção humana.
        </p>
        <ul className="mt-5 grid gap-3 md:grid-cols-3">
          {values.map((rule) => (
            <li key={rule.faixa} className="rounded-xl border border-border p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">{rule.faixa}</p>
                <Switch
                  checked={rule.ativo}
                  onCheckedChange={(checked) => {
                    setValues((prev) =>
                      prev.map((r) => (r.faixa === rule.faixa ? { ...r, ativo: checked } : r)),
                    );
                    toast.success(`Regra "${rule.faixa}" ${checked ? "ativada" : "pausada"}.`);
                  }}
                  aria-label={`Ativar regra ${rule.faixa}`}
                />
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{rule.incentivo}</p>
              <Badge variant="secondary" className="mt-3">
                {rule.canais}
              </Badge>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
