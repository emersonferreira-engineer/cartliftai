import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Eye,
  Mail,
  MessageCircle,
  Plus,
  Save,
  Send,
  Smartphone,
  Variable,
} from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/cartlift/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  carts,
  messageTemplates,
  templateVariables,
  account,
  brlExact,
  type MessageTemplate,
} from "@/lib/cartlift-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/painel/templates")({
  head: () => ({
    meta: [
      { title: "Editor de templates — CartLift" },
      {
        name: "description",
        content:
          "Edite templates de e-mail e WhatsApp com variáveis de nome do cliente, produto, frete estimado e cupom, com pré-visualização antes do envio.",
      },
      { property: "og:title", content: "Editor de templates — CartLift" },
      {
        property: "og:description",
        content:
          "Escreva, personalize com variáveis e pré-visualize cada mensagem da régua antes de enviar.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TemplatesPage,
});

const cupomPorTicket: Record<string, string> = {
  baixo: "FRETEGRATIS",
  medio: "VOLTA10",
  alto: "BELLE15",
};

function freteEstimado(valor: number) {
  return valor >= 300 ? "Frete grátis" : brlExact(valor >= 150 ? 18.9 : 26.4);
}

function firstName(full: string) {
  return full.split(" ")[0] ?? full;
}

function TemplatesPage() {
  const [list, setList] = useState<MessageTemplate[]>(messageTemplates);
  const [selectedId, setSelectedId] = useState(messageTemplates[0]!.id);
  const [cartId, setCartId] = useState(carts[0]!.id);
  const [cupomManual, setCupomManual] = useState("");

  const template = list.find((t) => t.id === selectedId)!;
  const cart = carts.find((c) => c.id === cartId)!;

  const values = useMemo(() => {
    const cupom = cupomManual.trim() || cupomPorTicket[cart.ticket] || "VOLTA10";
    return {
      nome_cliente: firstName(cart.cliente),
      produto: cart.itens[0] ?? "seu produto",
      frete_estimado: freteEstimado(cart.valor),
      cupom,
    } as Record<string, string>;
  }, [cart, cupomManual]);

  const render = (text: string) =>
    text.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, key: string) => values[key] ?? match);

  const missing = templateVariables.filter(
    (v) => !`${template.assunto} ${template.corpo}`.includes(v.token),
  );

  const update = (patch: Partial<MessageTemplate>) =>
    setList((prev) => prev.map((t) => (t.id === template.id ? { ...t, ...patch } : t)));

  const insertVariable = (token: string) => {
    update({ corpo: `${template.corpo}${template.corpo.endsWith(" ") ? "" : " "}${token}` });
    toast.success(`Variável ${token} inserida no corpo da mensagem.`);
  };

  const createTemplate = () => {
    const novo: MessageTemplate = {
      id: `tpl-${Date.now()}`,
      nome: "Novo template",
      canal: "E-mail",
      etapa: "Etapa personalizada",
      assunto: "{{nome_cliente}}, seu carrinho está esperando",
      corpo:
        "Oi {{nome_cliente}}, o {{produto}} ainda está reservado.\n\nFrete estimado: {{frete_estimado}}.\nCupom: {{cupom}}.",
      ativo: false,
      atualizadoEm: "agora",
    };
    setList((prev) => [...prev, novo]);
    setSelectedId(novo.id);
  };

  return (
    <>
      <PageHeader
        eyebrow="Mensagens"
        title="Editor de templates"
        description="Escreva uma vez, personalize com variáveis e veja exatamente como o cliente vai receber — no e-mail e no WhatsApp — antes de enviar."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={createTemplate}>
              <Plus className="h-4 w-4" /> Novo template
            </Button>
            <Button
              onClick={() => {
                update({ atualizadoEm: "agora" });
                toast.success(`Template "${template.nome}" salvo.`);
              }}
            >
              <Save className="h-4 w-4" /> Salvar template
            </Button>
          </div>
        }
      />

      <section className="grid gap-5 xl:grid-cols-[300px_1fr]">
        <div className="card-surface p-4">
          <h2 className="text-sm font-semibold">Templates da régua</h2>
          <ul className="mt-3 space-y-2">
            {list.map((t) => (
              <li key={t.id}>
                <button
                  onClick={() => setSelectedId(t.id)}
                  className={cn(
                    "w-full rounded-xl border border-border p-3 text-left transition-colors hover:bg-muted",
                    t.id === selectedId && "border-primary bg-primary-soft/50",
                  )}
                >
                  <div className="flex items-center gap-2">
                    {t.canal === "E-mail" ? (
                      <Mail className="h-4 w-4 text-primary" />
                    ) : (
                      <MessageCircle className="h-4 w-4 text-success" />
                    )}
                    <span className="text-sm font-semibold">{t.nome}</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{t.etapa}</p>
                  <Badge variant={t.ativo ? "default" : "secondary"} className="mt-2">
                    {t.ativo ? "Ativo" : "Pausado"}
                  </Badge>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-5">
          <div className="card-surface p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-base font-semibold">Conteúdo da mensagem</h2>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">
                  {template.ativo ? "Ativo na régua" : "Pausado"}
                </span>
                <Switch
                  checked={template.ativo}
                  onCheckedChange={(checked) => update({ ativo: checked })}
                  aria-label="Ativar template"
                />
              </div>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="tpl-nome">Nome interno</Label>
                <Input
                  id="tpl-nome"
                  value={template.nome}
                  maxLength={80}
                  onChange={(e) => update({ nome: e.target.value })}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tpl-canal">Canal</Label>
                <Select
                  value={template.canal}
                  onValueChange={(v) => update({ canal: v as MessageTemplate["canal"] })}
                >
                  <SelectTrigger id="tpl-canal" className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="E-mail">E-mail</SelectItem>
                    <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <Label htmlFor="tpl-assunto">
                {template.canal === "E-mail" ? "Assunto do e-mail" : "Descrição interna"}
              </Label>
              <Input
                id="tpl-assunto"
                value={template.assunto}
                maxLength={160}
                onChange={(e) => update({ assunto: e.target.value })}
                className="h-11"
              />
            </div>

            <div className="mt-4 space-y-2">
              <Label htmlFor="tpl-corpo">Corpo da mensagem</Label>
              <Textarea
                id="tpl-corpo"
                value={template.corpo}
                maxLength={1500}
                rows={10}
                onChange={(e) => update({ corpo: e.target.value })}
                className="font-mono text-sm leading-relaxed"
              />
              <p className="text-xs text-muted-foreground">
                {template.corpo.length}/1500 caracteres · última alteração {template.atualizadoEm}
              </p>
            </div>

            <div className="mt-5 rounded-xl border border-border p-4">
              <div className="flex items-center gap-2">
                <Variable className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold">Variáveis disponíveis</h3>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Clique para inserir no fim do corpo. Cada variável é substituída pelos dados reais do
                carrinho no momento do envio.
              </p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {templateVariables.map((v) => (
                  <button
                    key={v.key}
                    onClick={() => insertVariable(v.token)}
                    className="rounded-lg border border-border p-3 text-left transition-colors hover:bg-muted"
                  >
                    <p className="numeric text-xs font-semibold text-primary">{v.token}</p>
                    <p className="mt-1 text-sm font-medium">{v.label}</p>
                    <p className="text-xs text-muted-foreground">{v.descricao}</p>
                  </button>
                ))}
              </div>
              {missing.length ? (
                <p className="mt-3 text-xs text-warning">
                  Não usadas neste template: {missing.map((m) => m.token).join(", ")}
                </p>
              ) : (
                <p className="mt-3 text-xs text-success">
                  Todas as variáveis estão sendo usadas neste template.
                </p>
              )}
            </div>
          </div>

          <div className="card-surface p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Eye className="h-4.5 w-4.5 text-primary" />
                <h2 className="text-base font-semibold">Pré-visualização antes de enviar</h2>
              </div>
              <div className="flex flex-wrap items-end gap-3">
                <div className="space-y-1">
                  <Label htmlFor="prev-cart" className="text-xs">
                    Testar com o carrinho
                  </Label>
                  <Select value={cartId} onValueChange={setCartId}>
                    <SelectTrigger id="prev-cart" className="h-9 w-56">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {carts.slice(0, 8).map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.cliente} · {c.id}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="prev-cupom" className="text-xs">
                    Cupom do teste
                  </Label>
                  <Input
                    id="prev-cupom"
                    value={cupomManual}
                    maxLength={24}
                    placeholder={cupomPorTicket[cart.ticket]}
                    onChange={(e) => setCupomManual(e.target.value.toUpperCase())}
                    className="h-9 w-40"
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 grid gap-2 rounded-xl bg-muted/60 p-3 text-xs sm:grid-cols-4">
              {templateVariables.map((v) => (
                <div key={v.key}>
                  <p className="numeric text-primary">{v.token}</p>
                  <p className="font-semibold">{values[v.key]}</p>
                </div>
              ))}
            </div>

            <div className="mt-5">
              {template.canal === "E-mail" ? (
                <div className="overflow-hidden rounded-xl border border-border">
                  <div className="border-b border-border bg-card px-4 py-3">
                    <p className="text-xs text-muted-foreground">
                      De: {account.storeName} &lt;atendimento@belleaura.com.br&gt;
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Para: {cart.cliente} &lt;{cart.email}&gt;
                    </p>
                    <p className="mt-1 text-sm font-semibold">{render(template.assunto)}</p>
                  </div>
                  <div className="whitespace-pre-wrap bg-background px-5 py-4 text-sm leading-relaxed">
                    {render(template.corpo)}
                  </div>
                  <div className="border-t border-border px-5 py-3">
                    <span className="inline-flex items-center rounded-lg bg-gradient-brand px-4 py-2 text-sm font-semibold text-primary-foreground">
                      Retomar meu carrinho
                    </span>
                  </div>
                </div>
              ) : (
                <div className="mx-auto max-w-sm rounded-2xl border border-border bg-muted/50 p-4">
                  <div className="flex items-center gap-2 pb-3">
                    <Smartphone className="h-4 w-4 text-success" />
                    <p className="text-xs font-semibold">{cart.telefone}</p>
                  </div>
                  <div className="ml-auto w-[92%] rounded-2xl rounded-br-sm bg-success-soft px-4 py-3">
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                      {render(template.corpo)}
                    </p>
                    <p className="mt-2 text-right text-[10px] text-muted-foreground">
                      15:50 · via WhatsApp Business
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-muted-foreground">
                O envio de teste vai só para o e-mail do administrador ({account.admin.email}), sem
                tocar no cliente.
              </p>
              <Button
                variant="outline"
                onClick={() =>
                  toast.success(
                    `Pré-visualização enviada como teste para ${account.admin.email}.`,
                  )
                }
              >
                <Send className="h-4 w-4" /> Enviar teste para mim
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
