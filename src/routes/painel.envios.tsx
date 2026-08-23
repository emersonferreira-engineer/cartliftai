import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Check, CheckCheck, Mail, MessageCircle, MousePointerClick, Reply, Search } from "lucide-react";

import { PageHeader } from "@/components/cartlift/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  sendHistory,
  sendStatusLabels,
  type SendStatus,
  type SendEvent,
} from "@/lib/cartlift-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/painel/envios")({
  head: () => ({
    meta: [
      { title: "Histórico de envios — CartLift" },
      {
        name: "description",
        content:
          "Histórico completo de mensagens de e-mail e WhatsApp por cliente, com status de enviado, entregue, clicado e respondido.",
      },
      { property: "og:title", content: "Histórico de envios — CartLift" },
      {
        property: "og:description",
        content: "Acompanhe entrega, cliques e respostas de cada mensagem da régua por cliente.",
      },
    ],
  }),
  component: SendsPage,
});

const statusOrder: SendStatus[] = ["enviado", "entregue", "clicado", "respondido"];

const statusStyles: Record<SendStatus, string> = {
  enviado: "bg-muted text-muted-foreground",
  entregue: "bg-info-soft text-info",
  clicado: "bg-primary-soft text-primary",
  respondido: "bg-success-soft text-success",
};

const statusIcons: Record<SendStatus, typeof Check> = {
  enviado: Check,
  entregue: CheckCheck,
  clicado: MousePointerClick,
  respondido: Reply,
};

function StatusPill({ status }: { status: SendStatus }) {
  const Icon = statusIcons[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold",
        statusStyles[status],
      )}
    >
      <Icon className="h-3.5 w-3.5" /> {sendStatusLabels[status]}
    </span>
  );
}

function Timeline({ event }: { event: SendEvent }) {
  const reached = new Map(event.timeline.map((t) => [t.status, t.em]));
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
      {statusOrder.map((status) => {
        const at = reached.get(status);
        const Icon = statusIcons[status];
        return (
          <span
            key={status}
            className={cn(
              "inline-flex items-center gap-1 text-[11px] font-medium",
              at ? "text-foreground" : "text-muted-foreground/50",
            )}
          >
            <Icon className="h-3 w-3" />
            {sendStatusLabels[status]}
            {at ? <span className="text-muted-foreground">· {at}</span> : null}
          </span>
        );
      })}
    </div>
  );
}

function SendsPage() {
  const [channel, setChannel] = useState<string>("todos");
  const [status, setStatus] = useState<string>("todos");
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () =>
      sendHistory
        .filter((e) => (channel === "todos" ? true : e.canal === channel))
        .filter((e) => (status === "todos" ? true : e.status === status))
        .filter((e) => {
          const q = query.trim().toLowerCase();
          if (!q) return true;
          return (
            e.cliente.toLowerCase().includes(q) ||
            e.contato.toLowerCase().includes(q) ||
            e.cartId.toLowerCase().includes(q)
          );
        }),
    [channel, status, query],
  );

  const counts = useMemo(() => {
    const base: Record<SendStatus, number> = {
      enviado: 0,
      entregue: 0,
      clicado: 0,
      respondido: 0,
    };
    for (const e of sendHistory) base[e.status] += 1;
    return base;
  }, []);

  const total = sendHistory.length;

  return (
    <>
      <PageHeader
        eyebrow="Relacionamento"
        title="Histórico de envios"
        description="Toda mensagem enviada pela régua, por cliente e por canal, com o caminho completo: enviado, entregue, clicado e respondido."
      />

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statusOrder.map((s) => {
          const value = counts[s];
          const pct = total ? Math.round((value / total) * 100) : 0;
          return (
            <button
              key={s}
              onClick={() => setStatus(status === s ? "todos" : s)}
              className={cn(
                "card-surface hover-lift p-5 text-left",
                status === s && "ring-2 ring-primary",
              )}
            >
              <StatusPill status={s} />
              <p className="numeric mt-3 text-2xl font-extrabold">{value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{pct}% dos envios do período</p>
            </button>
          );
        })}
      </section>

      <section className="card-surface p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Tabs value={channel} onValueChange={setChannel}>
            <TabsList>
              <TabsTrigger value="todos">Todos os canais</TabsTrigger>
              <TabsTrigger value="E-mail">E-mail</TabsTrigger>
              <TabsTrigger value="WhatsApp">WhatsApp</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                maxLength={80}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar cliente, e-mail ou carrinho"
                className="h-9 w-full pl-9 sm:w-72"
                aria-label="Buscar envios"
              />
            </div>
            {status !== "todos" || channel !== "todos" || query ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setStatus("todos");
                  setChannel("todos");
                  setQuery("");
                }}
              >
                Limpar
              </Button>
            ) : null}
          </div>
        </div>

        <p className="mt-4 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{filtered.length} envios</span> neste filtro
        </p>

        <div className="mt-4 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Canal</TableHead>
                <TableHead>Etapa da régua</TableHead>
                <TableHead>Mensagem</TableHead>
                <TableHead>Enviado em</TableHead>
                <TableHead>Status atual</TableHead>
                <TableHead>Percurso</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((event) => (
                <TableRow key={event.id}>
                  <TableCell>
                    <p className="font-semibold">{event.cliente}</p>
                    <p className="text-xs text-muted-foreground">{event.contato}</p>
                    <p className="text-[11px] text-muted-foreground">Carrinho {event.cartId}</p>
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-semibold",
                        event.canal === "E-mail"
                          ? "bg-primary-soft text-primary"
                          : "bg-success-soft text-success",
                      )}
                    >
                      {event.canal === "E-mail" ? (
                        <Mail className="h-3.5 w-3.5" />
                      ) : (
                        <MessageCircle className="h-3.5 w-3.5" />
                      )}
                      {event.canal}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{event.etapa}</Badge>
                  </TableCell>
                  <TableCell className="max-w-[260px] text-sm text-muted-foreground">
                    {event.assunto}
                  </TableCell>
                  <TableCell className="numeric text-sm">{event.enviadoEm}</TableCell>
                  <TableCell>
                    <StatusPill status={event.status} />
                  </TableCell>
                  <TableCell className="min-w-[280px]">
                    <Timeline event={event} />
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-10 text-center text-sm text-muted-foreground">
                    Nenhum envio encontrado com esses filtros.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </div>
      </section>
    </>
  );
}
