import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Globe2, Languages, Loader2, Search, Sparkles, Wand2 } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/cartlift/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { account, languages, siteFindings } from "@/lib/cartlift-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/painel/otimizacao")({
  head: () => ({
    meta: [
      { title: "Otimização de site — CartLift" },
      {
        name: "description",
        content:
          "Informe a URL da sua loja e receba pontos de melhoria de conversão, usabilidade, SEO e internacionalização com impacto estimado.",
      },
      { property: "og:title", content: "Otimização de site — CartLift" },
      { property: "og:description", content: "Assistente de conversão, SEO e multi-idioma para sua loja." },
    ],
  }),
  component: OptimizationPage,
});

const urlSchema = z
  .string()
  .trim()
  .min(4, "Informe a URL da sua loja.")
  .max(255, "URL muito longa.")
  .refine((value) => /^(https?:\/\/)?([\w-]+\.)+[a-z]{2,}(\/.*)?$/i.test(value), "URL inválida. Ex: sualoja.com.br");

const severityStyles: Record<string, string> = {
  alta: "bg-warning-soft text-warning-foreground",
  media: "bg-info-soft text-info",
  baixa: "bg-muted text-muted-foreground",
};

const severityLabels: Record<string, string> = {
  alta: "Prioridade alta",
  media: "Prioridade média",
  baixa: "Ganho rápido",
};

const categoryStyles: Record<string, string> = {
  Conversão: "bg-success-soft text-success",
  Usabilidade: "bg-primary-soft text-primary",
  SEO: "bg-info-soft text-info",
  Internacionalização: "bg-warning-soft text-warning-foreground",
};

function OptimizationPage() {
  const [url, setUrl] = useState(account.storeUrl);
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [analyzed, setAnalyzed] = useState(account.storeUrl);
  const [hasResult, setHasResult] = useState(true);

  function analyze(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = urlSchema.safeParse(url);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "URL inválida.");
      return;
    }
    setError(null);
    setScanning(true);
    setHasResult(false);
    window.setTimeout(() => {
      setAnalyzed(parsed.data);
      setScanning(false);
      setHasResult(true);
      toast.success("Análise concluída: 7 oportunidades encontradas.");
    }, 1400);
  }

  return (
    <>
      <PageHeader
        eyebrow="Otimização de site"
        title="Assistente de conversão do seu site"
        description="Cole a URL da sua loja. O assistente varre a página como um cliente faria e lista o que está atrapalhando a compra — com o ganho estimado de cada correção."
      />

      <section className="card-surface bg-gradient-surface p-5">
        <form onSubmit={analyze} className="flex flex-col gap-3 sm:flex-row" noValidate>
          <div className="relative flex-1">
            <Globe2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={url}
              maxLength={255}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.sualoja.com.br"
              className="h-11 pl-9"
              aria-label="URL do site"
            />
          </div>
          <Button type="submit" size="lg" className="h-11" disabled={scanning}>
            {scanning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            {scanning ? "Analisando site…" : "Analisar site"}
          </Button>
        </form>
        {error ? (
          <p className="mt-2 text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : (
          <p className="mt-2 text-xs text-muted-foreground">
            Última análise: {analyzed} · atualizada em 20/08/2026 às 09:12
          </p>
        )}
      </section>

      {scanning || !hasResult ? (
        <section className="card-surface p-8 text-center">
          <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
          <p className="mt-3 text-sm font-medium">Lendo páginas, CTAs, velocidade e idiomas…</p>
          <p className="text-sm text-muted-foreground">Isso costuma levar poucos segundos.</p>
        </section>
      ) : (
        <>
          <section className="grid gap-4 sm:grid-cols-3">
            <div className="card-surface p-5">
              <p className="text-sm text-muted-foreground">Nota de conversão do site</p>
              <p className="numeric mt-2 text-3xl font-extrabold">62/100</p>
              <Progress value={62} className="mt-3 h-2" />
              <p className="mt-2 text-xs text-muted-foreground">Lojas líderes do setor: 84/100</p>
            </div>
            <div className="card-surface p-5">
              <p className="text-sm text-muted-foreground">Ganho potencial em conversão</p>
              <p className="numeric mt-2 text-3xl font-extrabold text-success">+27%</p>
              <p className="mt-2 text-xs text-muted-foreground">
                somando as 4 correções de prioridade alta
              </p>
            </div>
            <div className="card-surface p-5">
              <p className="text-sm text-muted-foreground">Alcance internacional bloqueado</p>
              <p className="numeric mt-2 text-3xl font-extrabold text-warning-foreground">14%</p>
              <p className="mt-2 text-xs text-muted-foreground">
                das visitas chegam de PT, EUA e Espanha sem tradução
              </p>
            </div>
          </section>

          <section className="card-surface p-5">
            <div className="flex items-center gap-2">
              <Languages className="h-4.5 w-4.5 text-primary" />
              <h2 className="text-base font-semibold">Idiomas e mercados</h2>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Ative a tradução para atender quem já visita seu site em outro idioma.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {languages.map((lang) => (
                <div key={lang.label} className="rounded-xl border border-border p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl" aria-hidden>
                      {lang.flag}
                    </span>
                    <Badge variant={lang.status === "Ativo" ? "default" : "secondary"}>{lang.status}</Badge>
                  </div>
                  <p className="mt-3 text-sm font-semibold">{lang.label}</p>
                  <p className="text-xs text-muted-foreground">{lang.share}% das sessões</p>
                  {lang.status !== "Ativo" ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3 w-full"
                      onClick={() => toast.success(`Tradução para ${lang.label} adicionada à fila.`)}
                    >
                      <Wand2 className="h-3.5 w-3.5" /> Ativar tradução
                    </Button>
                  ) : null}
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Pontos de melhoria encontrados</h2>
            {siteFindings.map((finding) => (
              <article key={finding.titulo} className="card-surface hover-lift p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                          categoryStyles[finding.categoria],
                        )}
                      >
                        {finding.categoria}
                      </span>
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                          severityStyles[finding.severidade],
                        )}
                      >
                        {severityLabels[finding.severidade]}
                      </span>
                      <span className="text-xs text-muted-foreground">Esforço: {finding.esforco}</span>
                    </div>
                    <h3 className="mt-3 text-base font-semibold">{finding.titulo}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{finding.diagnostico}</p>
                    <div className="mt-3 flex items-start gap-3 rounded-xl bg-primary-soft p-4">
                      <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <p className="text-sm text-muted-foreground">
                        <span className="font-semibold text-accent-foreground">Como resolver: </span>
                        {finding.acao}
                      </p>
                    </div>
                  </div>
                  <div className="w-full max-w-52 space-y-3">
                    <div className="rounded-xl bg-success-soft p-3">
                      <p className="text-xs text-success">Impacto estimado</p>
                      <p className="text-sm font-bold text-success">{finding.impactoConversao}</p>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => toast.success("Tarefa enviada para o time de implantação.")}
                    >
                      Enviar para implantação
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </section>
        </>
      )}
    </>
  );
}
