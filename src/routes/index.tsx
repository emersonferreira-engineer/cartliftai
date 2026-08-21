import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, BarChart3, Loader2, Lock, Mail, ShieldCheck, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { demoCredentials, useAuth } from "@/lib/auth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Entrar no CartLift — Recuperação de carrinho abandonado" },
      {
        name: "description",
        content:
          "Acesse o painel CartLift: recuperação automática de carrinhos, diagnóstico de abandono por IA e otimização de site para ecommerce.",
      },
      { property: "og:title", content: "Entrar no CartLift" },
      {
        property: "og:description",
        content: "Recupere carrinhos abandonados e descubra por que seus clientes não finalizam a compra.",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { signIn, isAuthenticated, ready } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState(demoCredentials.email);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (ready && isAuthenticated) navigate({ to: "/painel", replace: true });
  }, [ready, isAuthenticated, navigate]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    const result = signIn(email, password);
    if (!result.ok) {
      setLoading(false);
      setError(result.error ?? "Não foi possível entrar.");
      return;
    }
    navigate({ to: "/painel" });
  }

  return (
    <main className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      <section className="flex items-center justify-center bg-gradient-surface px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-brand text-primary-foreground">
              <BarChart3 className="h-5 w-5" />
            </span>
            <span className="font-display text-lg font-bold tracking-tight">CartLift</span>
          </div>

          <h1 className="mt-9 text-3xl font-bold">Entrar na sua conta</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Acompanhe carrinhos abandonados, receita recuperada e as ações sugeridas pela IA.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4" noValidate>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail profissional</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  maxLength={255}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 pl-9"
                  placeholder="voce@sualoja.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  maxLength={72}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 pl-9"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error ? (
              <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
                {error}
              </p>
            ) : null}

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-muted-foreground">
                <Checkbox defaultChecked /> Manter conectado
              </label>
              <span className="font-medium text-primary">Esqueci minha senha</span>
            </div>

            <Button type="submit" size="lg" className="h-11 w-full text-base" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Entrar no painel"}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </Button>
          </form>

          <div className="mt-6 rounded-xl border border-dashed border-border bg-card p-4 text-sm">
            <p className="flex items-center gap-2 font-semibold">
              <Sparkles className="h-4 w-4 text-primary" /> Acesso de demonstração
            </p>
            <p className="mt-1 text-muted-foreground">
              E-mail <span className="font-medium text-foreground">{demoCredentials.email}</span> · Senha{" "}
              <span className="font-medium text-foreground">{demoCredentials.password}</span>
            </p>
          </div>

          <p className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-success" /> Conexão protegida e código de verificação
            antifraude por loja.
          </p>
        </div>
      </section>

      <section className="relative hidden overflow-hidden bg-gradient-brand px-12 py-16 lg:flex lg:flex-col lg:justify-center">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-primary-foreground/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-16 h-96 w-96 rounded-full bg-success/20 blur-3xl" />
        <div className="relative max-w-lg text-primary-foreground">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-80">
            Plataforma de recuperação de receita
          </p>
          <h2 className="mt-4 text-4xl font-bold leading-tight">
            7 de cada 10 carrinhos são abandonados. O CartLift traz esse dinheiro de volta.
          </h2>
          <p className="mt-4 text-base opacity-85">
            Régua automática por e-mail e WhatsApp, diagnóstico de abandono por IA e um assistente que
            revisa seu site apontando o que travar a conversão.
          </p>

          <dl className="mt-10 grid grid-cols-3 gap-6">
            {[
              { k: "R$ 84,7 mil", v: "recuperados no mês" },
              { k: "23,8%", v: "dos carrinhos voltam" },
              { k: "4 min", v: "para instalar" },
            ].map((item) => (
              <div key={item.k}>
                <dt className="numeric text-2xl font-extrabold">{item.k}</dt>
                <dd className="mt-1 text-xs uppercase tracking-wide opacity-75">{item.v}</dd>
              </div>
            ))}
          </dl>

          <ul className="mt-10 space-y-3 text-sm opacity-90">
            {[
              "Diagnóstico por produto, categoria e etapa do funil",
              "Sugestões de ação com projeção de receita",
              "Relatório semanal escrito em linguagem simples",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-foreground/15">
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
