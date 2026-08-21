import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, Download, FileText, Send, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/cartlift/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { account, brl, kpis, weeklyReport } from "@/lib/cartlift-data";

export const Route = createFileRoute("/painel/relatorio")({
  head: () => ({
    meta: [
      { title: "Relatório semanal por IA — CartLift" },
      {
        name: "description",
        content:
          "Relatório semanal automático em linguagem simples: o que aconteceu, por que aconteceu e quais ações tomar nesta semana.",
      },
      { property: "og:title", content: "Relatório semanal — CartLift" },
      { property: "og:description", content: "Um analista de dados explicando seus números em português claro." },
    ],
  }),
  component: ReportPage,
});

function ReportPage() {
  return (
    <>
      <PageHeader
        eyebrow="Relatório semanal"
        title="Seu resumo da semana, sem termos técnicos"
        description={`Gerado automaticamente pela IA do CartLift para ${account.storeName} — escrito como se um analista tivesse revisado seus números para você.`}
        actions={
          <>
            <Button variant="outline" onClick={() => toast.success("PDF gerado e baixado.")}>
              <Download className="h-4 w-4" /> Baixar PDF
            </Button>
            <Button onClick={() => toast.success(`Relatório enviado para ${account.admin.email}.`)}>
              <Send className="h-4 w-4" /> Enviar por e-mail
            </Button>
          </>
        }
      />

      <article className="card-surface overflow-hidden">
        <div className="bg-gradient-brand p-6 text-primary-foreground">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-foreground/20">
                <FileText className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] opacity-80">Relatório CartLift</p>
                <h2 className="text-xl font-bold">{weeklyReport.periodo}</h2>
              </div>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/15 px-3 py-1 text-xs font-semibold">
              <CalendarDays className="h-3.5 w-3.5" /> Enviado toda segunda, 8h
            </span>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              { label: "Receita recuperada", value: brl(28950) },
              { label: "Taxa de abandono", value: `${kpis.abandonmentRate}%` },
              { label: "Carrinhos na régua", value: kpis.activeCarts.toLocaleString("pt-BR") },
            ].map((item) => (
              <div key={item.label} className="rounded-xl bg-primary-foreground/10 p-4">
                <p className="text-xs opacity-80">{item.label}</p>
                <p className="numeric mt-1 text-2xl font-extrabold">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8 p-6 md:p-8">
          <section>
            <h3 className="text-base font-semibold">Resumo em uma respirada</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{weeklyReport.resumo}</p>
          </section>

          <section>
            <h3 className="text-base font-semibold">O que mais chamou atenção</h3>
            <ul className="mt-3 space-y-3">
              {weeklyReport.destaques.map((item) => (
                <li key={item} className="flex gap-3 rounded-xl border border-border p-4">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  <p className="text-sm leading-relaxed text-muted-foreground">{item}</p>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="text-base font-semibold">O que eu faria nesta semana</h3>
            <ol className="mt-3 space-y-3">
              {weeklyReport.acoes.map((item, index) => (
                <li key={item} className="flex gap-3 rounded-xl bg-success-soft p-4">
                  <span className="numeric flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-success text-xs font-bold text-success-foreground">
                    {index + 1}
                  </span>
                  <p className="text-sm leading-relaxed text-success">{item}</p>
                </li>
              ))}
            </ol>
          </section>

          <section className="rounded-xl border border-dashed border-border p-5">
            <div className="flex items-start gap-3">
              <Sparkles className="mt-0.5 h-4.5 w-4.5 shrink-0 text-primary" />
              <div>
                <h3 className="text-base font-semibold">Projeção do CartLift</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {weeklyReport.previsao}
                </p>
              </div>
            </div>
          </section>

          <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5 text-sm text-muted-foreground">
            <span>
              Preparado por CartLift IA · revisado por {account.admin.name}
            </span>
            <Badge variant="secondary">{account.admin.role}</Badge>
          </footer>
        </div>
      </article>
    </>
  );
}
