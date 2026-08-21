import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { MessageCircle, Mail, Filter, Package } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/cartlift/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { brl, brlExact, carts, ticketLabels, type Ticket } from "@/lib/cartlift-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/painel/carrinhos")({
  head: () => ({
    meta: [
      { title: "Carrinhos abandonados — CartLift" },
      {
        name: "description",
        content:
          "Carrinhos abandonados segmentados por tempo parado (1, 2 e 5+ dias) e por valor de ticket, com o motivo provável de cada abandono.",
      },
      { property: "og:title", content: "Carrinhos abandonados — CartLift" },
      { property: "og:description", content: "Segmentação por tempo parado e valor de carrinho." },
    ],
  }),
  component: CartsPage,
});

const timeFilters = [
  { id: "todos", label: "Todos" },
  { id: "1", label: "1 dia parado" },
  { id: "2", label: "2 dias parado" },
  { id: "5", label: "5+ dias parado" },
] as const;

const ticketFilters = [
  { id: "todos", label: "Todos os tickets" },
  { id: "baixo", label: "Baixo ticket" },
  { id: "medio", label: "Médio ticket" },
  { id: "alto", label: "Alto ticket" },
] as const;

const statusStyles: Record<string, string> = {
  "na-regua": "bg-warning-soft text-warning-foreground",
  recuperado: "bg-success-soft text-success",
  perdido: "bg-muted text-muted-foreground",
};

const statusLabels: Record<string, string> = {
  "na-regua": "Na régua",
  recuperado: "Recuperado",
  perdido: "Perdido",
};

function CartsPage() {
  const [time, setTime] = useState<string>("todos");
  const [ticket, setTicket] = useState<string>("todos");

  const filtered = useMemo(
    () =>
      carts
        .filter((c) => {
          if (time === "1") return c.diasParado === 1;
          if (time === "2") return c.diasParado === 2;
          if (time === "5") return c.diasParado >= 5;
          return true;
        })
        .filter((c) => (ticket === "todos" ? true : c.ticket === ticket))
        .sort((a, b) => b.valor - a.valor),
    [time, ticket],
  );

  const total = filtered.reduce((sum, c) => sum + c.valor, 0);

  return (
    <>
      <PageHeader
        eyebrow="Recuperação"
        title="Carrinhos abandonados"
        description="Cada linha é uma venda que ainda pode acontecer. Filtre por tempo parado e por valor para priorizar quem tem mais chance de voltar."
        actions={
          <>
            <Button variant="outline" onClick={() => toast.success("Exportação enviada para seu e-mail.")}>
              Exportar lista
            </Button>
            <Button onClick={() => toast.success(`Disparo manual enviado para ${filtered.length} carrinhos.`)}>
              <MessageCircle className="h-4 w-4" /> Disparar régua agora
            </Button>
          </>
        }
      />

      <section className="grid gap-4 sm:grid-cols-3">
        {(Object.keys(ticketLabels) as Ticket[]).map((key) => {
          const group = carts.filter((c) => c.ticket === key);
          const value = group.reduce((s, c) => s + c.valor, 0);
          return (
            <button
              key={key}
              onClick={() => setTicket(ticket === key ? "todos" : key)}
              className={cn(
                "card-surface hover-lift p-5 text-left",
                ticket === key && "ring-2 ring-primary",
              )}
            >
              <p className="text-sm font-medium text-muted-foreground">{ticketLabels[key]}</p>
              <p className="numeric mt-2 text-2xl font-extrabold">{brl(value)}</p>
              <p className="mt-1 text-xs text-muted-foreground">{group.length} carrinhos parados</p>
            </button>
          );
        })}
      </section>

      <section className="card-surface p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Tabs value={time} onValueChange={setTime}>
            <TabsList>
              {timeFilters.map((f) => (
                <TabsTrigger key={f.id} value={f.id}>
                  {f.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <Filter className="h-4 w-4 text-muted-foreground" />
            {ticketFilters.map((f) => (
              <button
                key={f.id}
                onClick={() => setTicket(f.id)}
                className={cn(
                  "rounded-full border border-border px-3 py-1 text-xs font-medium transition-colors",
                  ticket === f.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-4 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{filtered.length} carrinhos</span> ·{" "}
          <span className="font-semibold text-foreground">{brlExact(total)}</span> em jogo neste filtro
        </p>

        <div className="mt-4 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Itens</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead>Parado</TableHead>
                <TableHead>Etapa</TableHead>
                <TableHead>Motivo provável</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((cart) => (
                <TableRow key={cart.id}>
                  <TableCell>
                    <p className="font-semibold">{cart.cliente}</p>
                    <p className="text-xs text-muted-foreground">{cart.email}</p>
                  </TableCell>
                  <TableCell className="max-w-[220px]">
                    <p className="flex items-center gap-1.5 text-sm">
                      <Package className="h-3.5 w-3.5 text-muted-foreground" />
                      {cart.itens[0]}
                    </p>
                    {cart.itens.length > 1 ? (
                      <p className="text-xs text-muted-foreground">+{cart.itens.length - 1} item(ns)</p>
                    ) : null}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{cart.categoria}</Badge>
                  </TableCell>
                  <TableCell className="numeric text-right font-semibold">{brlExact(cart.valor)}</TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-semibold",
                        cart.diasParado >= 5
                          ? "bg-warning-soft text-warning-foreground"
                          : "bg-info-soft text-info",
                      )}
                    >
                      {cart.diasParado === 0 ? "convertido" : `${cart.diasParado}d`}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{cart.etapa}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{cart.motivo}</TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-semibold",
                        statusStyles[cart.status],
                      )}
                    >
                      {statusLabels[cart.status]}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Enviar e-mail"
                        onClick={() => toast.success(`E-mail enviado para ${cart.cliente}.`)}
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Enviar WhatsApp"
                        onClick={() => toast.success(`WhatsApp enviado para ${cart.cliente}.`)}
                      >
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
    </>
  );
}
