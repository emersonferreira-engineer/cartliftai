import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  BarChart3,
  Bell,
  Brain,
  FileText,
  Globe2,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Send,

  Settings2,
  ShieldCheck,
  ShoppingCart,
  Store,
  X,

} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { account } from "@/lib/cartlift-data";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/painel")({
  component: PainelLayout,
});

const nav = [
  { to: "/painel", label: "Visão geral", icon: LayoutDashboard, exact: true },
  { to: "/painel/carrinhos", label: "Carrinhos abandonados", icon: ShoppingCart },
  { to: "/painel/envios", label: "Histórico de envios", icon: Send },

  { to: "/painel/diagnostico", label: "Diagnóstico por IA", icon: Brain },
  { to: "/painel/otimizacao", label: "Otimização de site", icon: Globe2 },
  { to: "/painel/relatorio", label: "Relatório semanal", icon: FileText },
  { to: "/painel/regua", label: "Régua de comunicação", icon: Settings2 },
  { to: "/painel/shopify", label: "Integração Shopify", icon: Store },
  { to: "/painel/seguranca", label: "Segurança", icon: ShieldCheck },

] as const;

function PainelLayout() {
  const { isAuthenticated, ready, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (ready && !isAuthenticated) navigate({ to: "/", replace: true });
  }, [ready, isAuthenticated, navigate]);

  if (!ready || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Carregando seu painel…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[268px_1fr]">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-[268px] flex-col bg-sidebar px-4 py-5 text-sidebar-foreground transition-transform lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between">
          <Link to="/painel" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-brand text-primary-foreground">
              <BarChart3 className="h-5 w-5" />
            </span>
            <span className="font-display text-lg font-bold">CartLift</span>
          </Link>
          <button className="lg:hidden" onClick={() => setOpen(false)} aria-label="Fechar menu">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 rounded-xl bg-sidebar-accent px-3 py-3">
          <p className="text-[11px] uppercase tracking-wider text-sidebar-foreground/60">Loja conectada</p>
          <p className="mt-1 text-sm font-semibold">{account.storeName}</p>
          <p className="text-xs text-sidebar-foreground/60">{account.plan}</p>
        </div>

        <nav className="mt-6 flex flex-1 flex-col gap-1">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: "exact" in item ? item.exact : false }}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/75 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
              activeProps={{ className: "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground" }}
            >
              <item.icon className="h-4.5 w-4.5" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-6 border-t border-sidebar-border pt-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-revenue text-sm font-bold text-primary-foreground">
              {account.admin.initials}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{account.admin.name}</p>
              <p className="truncate text-[11px] text-sidebar-foreground/60">{account.admin.role}</p>
            </div>
          </div>
          <button
            onClick={() => {
              signOut();
              navigate({ to: "/", replace: true });
            }}
            className="mt-3 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
          >
            <LogOut className="h-4 w-4" /> Sair da conta
          </button>
        </div>
      </aside>

      {open ? (
        <div
          className="fixed inset-0 z-30 bg-foreground/40 lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      ) : null}

      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-card/80 px-4 py-3 backdrop-blur md:px-8">
          <button className="lg:hidden" onClick={() => setOpen(true)} aria-label="Abrir menu">
            <Menu className="h-5 w-5" />
          </button>
          <div className="relative hidden max-w-sm flex-1 md:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Buscar cliente, produto ou carrinho" className="h-9 pl-9" />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="hidden items-center gap-2 rounded-full bg-success-soft px-3 py-1 text-xs font-semibold text-success sm:inline-flex">
              <span className="h-2 w-2 rounded-full bg-success" /> Régua ativa
            </span>
            <Button variant="ghost" size="icon" aria-label="Notificações">
              <Bell className="h-4.5 w-4.5" />
            </Button>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-brand text-sm font-bold text-primary-foreground">
              {account.admin.initials}
            </span>
          </div>
        </header>

        <main className="flex-1 space-y-7 px-4 py-7 md:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
