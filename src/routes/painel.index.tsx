import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowUpRight, Brain, Clock, DollarSign, Percent, ShoppingCart } from "lucide-react";

import { PageHeader } from "@/components/cartlift/page-header";
import { StatCard } from "@/components/cartlift/stat-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  abandonReasons,
  account,
  brl,
  brlExact,
  carts,
  channelPerformance,
  diagnoses,
  kpis,
  weeklyEvolution,
} from "@/lib/cartlift-data";

export const Route = createFileRoute("/painel/")({
  head: () => ({
    meta: [
      { title: "Visão geral — CartLift" },
      {
        name: "description",
        content:
          "Taxa de abandono, receita recuperada no mês, carrinhos ativos na régua e evolução semanal da recuperação.",
      },
      { property: "og:title", content: "Visão geral — CartLift" },
      { property: "og:description", content: "Painel de recuperação de carrinho abandonado do CartLift." },
    ],
  }),
  component: Overview,
});

const pieColors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

function Overview() {
  const naRegua = carts.filter((c) => c.status === "na-regua").slice(0, 5);
  const topAction = [...diagnoses].sort((a, b) => b.impacto - a.impacto)[0]!;

  return (
    <>
      <PageHeader
        eyebrow="Visão geral"
        title={`Bom te ver, ${account.admin.name.split(" ")[0]}`}
        description={`Resumo da ${account.storeName} nos últimos 30 dias. Existem ${brl(kpis.potentialRevenue)} em carrinhos abandonados aguardando recuperação.`}
        actions={
          <>
            <Button variant="outline" asChild>
              <Link to="/painel/relatorio">Ver relatório semanal</Link>
            </Button>
            <Button asChild>
              <Link to="/painel/diagnostico">
                Ações sugeridas pela IA <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Taxa de abandono"
          value={`${kpis.abandonmentRate.toLocaleString("pt-BR")}%`}
          delta={kpis.abandonmentDelta}
          deltaGood
          hint="vs. mês anterior"
          icon={Percent}
          tone="warning"
        />
        <StatCard
          label="Receita recuperada no mês"
          value={brl(kpis.recoveredRevenue)}
          delta={kpis.recoveredDelta}
          hint="382 pedidos"
          icon={DollarSign}
          tone="success"
        />
        <StatCard
          label="Carrinhos ativos na régua"
          value={kpis.activeCarts.toLocaleString("pt-BR")}
          delta={kpis.activeCartsDelta}
          hint="em contato agora"
          icon={ShoppingCart}
          tone="primary"
        />
        <StatCard
          label="Taxa de recuperação"
          value={`${kpis.recoveryRate.toLocaleString("pt-BR")}%`}
          delta={kpis.recoveryDelta}
          hint="média do setor: 12%"
          icon={Clock}
          tone="info"
        />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
        <div className="card-surface p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-semibold">Evolução semanal</h2>
              <p className="text-sm text-muted-foreground">
                Carrinhos abandonados x recuperados e receita trazida de volta
              </p>
            </div>
            <Badge variant="secondary">Últimas 6 semanas</Badge>
          </div>
          <div className="mt-5 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyEvolution} margin={{ left: -14, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="gAband" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-3)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="var(--chart-3)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gRec" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-2)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="var(--chart-2)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="semana" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid var(--border)",
                    background: "var(--card)",
                    fontSize: 12,
                  }}
                  formatter={(value: number, name) =>
                    name === "receita" ? [brlExact(value), "Receita recuperada"] : [value, name === "abandonos" ? "Abandonos" : "Recuperados"]
                  }
                />
                <Area
                  type="monotone"
                  dataKey="abandonos"
                  stroke="var(--chart-3)"
                  strokeWidth={2}
                  fill="url(#gAband)"
                />
                <Area
                  type="monotone"
                  dataKey="recuperados"
                  stroke="var(--chart-2)"
                  strokeWidth={2.5}
                  fill="url(#gRec)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-surface p-5">
          <h2 className="text-base font-semibold">Motivos de abandono</h2>
          <p className="text-sm text-muted-foreground">Distribuição estimada pela IA</p>
          <div className="mt-3 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={abandonReasons}
                  dataKey="valor"
                  nameKey="motivo"
                  innerRadius={52}
                  outerRadius={80}
                  paddingAngle={3}
                >
                  {abandonReasons.map((entry, i) => (
                    <Cell key={entry.motivo} fill={pieColors[i % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid var(--border)",
                    background: "var(--card)",
                    fontSize: 12,
                  }}
                  formatter={(value: number, name) => [`${value}%`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-2 space-y-2 text-sm">
            {abandonReasons.map((item, i) => (
              <li key={item.motivo} className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: pieColors[i % pieColors.length] }}
                  />
                  {item.motivo}
                </span>
                <span className="numeric font-semibold">{item.valor}%</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1fr_1.1fr]">
        <div className="card-surface p-5">
          <h2 className="text-base font-semibold">Desempenho por etapa da régua</h2>
          <p className="text-sm text-muted-foreground">Taxa de conversão por canal e horário de disparo</p>
          <div className="mt-5 h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={channelPerformance} margin={{ left: -18, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="canal" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: "var(--muted)" }}
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid var(--border)",
                    background: "var(--card)",
                    fontSize: 12,
                  }}
                  formatter={(value: number) => [`${value}%`, "Conversão"]}
                />
                <Bar dataKey="conversao" fill="var(--chart-1)" radius={[6, 6, 0, 0]} maxBarSize={44} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-surface p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold">Carrinhos em recuperação agora</h2>
              <p className="text-sm text-muted-foreground">Ordenados por valor parado</p>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/painel/carrinhos">Ver todos</Link>
            </Button>
          </div>
          <ul className="mt-4 divide-y divide-border">
            {naRegua.map((cart) => (
              <li key={cart.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{cart.cliente}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {cart.itens[0]} · {cart.categoria} · {cart.diasParado}d parado
                  </p>
                </div>
                <div className="text-right">
                  <p className="numeric text-sm font-bold">{brlExact(cart.valor)}</p>
                  <p className="text-xs text-muted-foreground">{cart.ultimoContato}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="card-surface bg-gradient-surface p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <Brain className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-base font-semibold">Próxima melhor ação sugerida pela IA</h2>
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                {topAction.acao} — projeção de {brl(topAction.impacto)} por mês em receita adicional
                para {topAction.categoria}.
              </p>
            </div>
          </div>
          <Button asChild>
            <Link to="/painel/diagnostico">Aplicar sugestão</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
