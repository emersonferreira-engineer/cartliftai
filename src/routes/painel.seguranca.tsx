import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Copy, RefreshCw, ShieldAlert, ShieldCheck, TriangleAlert } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/cartlift/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { account, customerCodes, securityEvents } from "@/lib/cartlift-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/painel/seguranca")({
  head: () => ({
    meta: [
      { title: "Segurança e código de verificação — CartLift" },
      {
        name: "description",
        content:
          "Código de verificação único por cliente para proteger sua loja de golpes que usam o nome da marca em mensagens de recuperação.",
      },
      { property: "og:title", content: "Segurança — CartLift" },
      { property: "og:description", content: "Proteção antifraude com código de verificação por cliente." },
    ],
  }),
  component: SecurityPage,
});

const levelStyles: Record<string, string> = {
  ok: "bg-success-soft text-success",
  alerta: "bg-warning-soft text-warning-foreground",
  info: "bg-info-soft text-info",
};

const statusStyles: Record<string, string> = {
  Validado: "bg-success-soft text-success",
  Pendente: "bg-warning-soft text-warning-foreground",
  Expirado: "bg-muted text-muted-foreground",
};

function SecurityPage() {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard?.writeText(account.securityCode);
    setCopied(true);
    toast.success("Código copiado.");
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <>
      <PageHeader
        eyebrow="Segurança"
        title="Código de verificação antifraude"
        description="Toda mensagem enviada pela régua carrega um código único. Assim seu cliente sabe que a mensagem é realmente da sua loja — e não de um golpista usando o nome dela."
        actions={
          <Button variant="outline" onClick={() => toast.success("Novo código gerado para a loja.")}>
            <RefreshCw className="h-4 w-4" /> Rotacionar código da loja
          </Button>
        }
      />

      <section className="grid gap-5 lg:grid-cols-[1fr_1.2fr]">
        <div className="card-surface bg-gradient-brand p-6 text-primary-foreground">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-foreground/20">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <p className="mt-4 text-sm opacity-85">Código mestre da loja {account.storeName}</p>
          <p className="numeric mt-1 text-4xl font-extrabold tracking-wider">{account.securityCode}</p>
          <p className="mt-3 text-sm opacity-80">
            Divulgue este código nas suas redes e no site. Nenhuma mensagem legítima da sua loja é enviada
            sem ele.
          </p>
          <Button variant="secondary" className="mt-5" onClick={copy}>
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copiado" : "Copiar código"}
          </Button>
        </div>

        <div className="card-surface p-5">
          <h2 className="text-base font-semibold">Eventos recentes de segurança</h2>
          <p className="text-sm text-muted-foreground">Validações, rotações e tentativas suspeitas</p>
          <ul className="mt-4 space-y-3">
            {securityEvents.map((event) => (
              <li key={event.data} className="flex items-start gap-3 rounded-xl border border-border p-3">
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                    levelStyles[event.nivel],
                  )}
                >
                  {event.nivel === "alerta" ? (
                    <TriangleAlert className="h-4 w-4" />
                  ) : event.nivel === "ok" ? (
                    <ShieldCheck className="h-4 w-4" />
                  ) : (
                    <ShieldAlert className="h-4 w-4" />
                  )}
                </span>
                <div>
                  <p className="text-sm font-semibold">{event.tipo}</p>
                  <p className="text-sm text-muted-foreground">{event.detalhe}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{event.data}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="card-surface p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-semibold">Códigos gerados por cliente</h2>
            <p className="text-sm text-muted-foreground">
              Cada cliente em recuperação recebe um código exclusivo, válido por 7 dias
            </p>
          </div>
          <Badge variant="secondary">{customerCodes.length} códigos ativos</Badge>
        </div>
        <div className="mt-4 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Código</TableHead>
                <TableHead>Validade</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customerCodes.map((row) => (
                <TableRow key={row.codigo}>
                  <TableCell className="font-semibold">{row.cliente}</TableCell>
                  <TableCell className="numeric tracking-wider">{row.codigo}</TableCell>
                  <TableCell className="text-muted-foreground">{row.validade}</TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-semibold",
                        statusStyles[row.status],
                      )}
                    >
                      {row.status}
                    </span>
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
