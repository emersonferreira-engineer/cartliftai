import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ExternalLink, PackageSearch, RefreshCw, ShoppingBag, Store } from "lucide-react";
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
import {
  SHOPIFY_STORE_PERMANENT_DOMAIN,
  fetchShopifyProducts,
  fetchShopifyShop,
  formatMoney,
} from "@/lib/shopify";
import { carts, brlExact } from "@/lib/cartlift-data";

export const Route = createFileRoute("/painel/shopify")({
  head: () => ({
    meta: [
      { title: "Integração Shopify — CartLift" },
      {
        name: "description",
        content:
          "Conecte sua loja Shopify ao CartLift e importe automaticamente produtos e carrinhos abandonados para a régua de recuperação.",
      },
      { property: "og:title", content: "Integração Shopify — CartLift" },
      {
        property: "og:description",
        content: "Sincronização automática de catálogo e carrinhos abandonados da sua loja Shopify.",
      },
    ],
  }),
  component: ShopifyPage,
});

function ShopifyPage() {
  const queryClient = useQueryClient();

  const shopQuery = useQuery({
    queryKey: ["shopify", "shop"],
    queryFn: fetchShopifyShop,
  });

  const productsQuery = useQuery({
    queryKey: ["shopify", "products"],
    queryFn: () => fetchShopifyProducts(50),
  });

  const products = productsQuery.data ?? [];
  const activeCarts = carts.filter((c) => c.status === "na-regua");
  const cartsValue = activeCarts.reduce((s, c) => s + c.valor, 0);

  const resync = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["shopify", "products"] }),
      queryClient.invalidateQueries({ queryKey: ["shopify", "shop"] }),
    ]);
    toast.success("Sincronização com a Shopify concluída.");
  };

  return (
    <>
      <PageHeader
        eyebrow="Integrações"
        title="Integração Shopify"
        description="O CartLift lê sua loja Shopify direto pela API: o catálogo é importado com preço e estoque reais, e cada checkout abandonado entra automaticamente na régua de recuperação."
        actions={
          <>
            <Button variant="outline" asChild>
              <a
                href={`https://${SHOPIFY_STORE_PERMANENT_DOMAIN}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Abrir loja <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
            <Button onClick={resync} disabled={productsQuery.isFetching}>
              <RefreshCw className={productsQuery.isFetching ? "h-4 w-4 animate-spin" : "h-4 w-4"} />{" "}
              Sincronizar agora
            </Button>
          </>
        }
      />

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="card-surface p-5">
          <div className="flex items-center gap-2">
            <Store className="h-4.5 w-4.5 text-primary" />
            <p className="text-sm font-medium text-muted-foreground">Loja conectada</p>
          </div>
          <p className="mt-2 text-lg font-bold">
            {shopQuery.isLoading ? "Carregando…" : (shopQuery.data?.name ?? "Loja Shopify")}
          </p>
          <p className="mt-1 break-all text-xs text-muted-foreground">
            {SHOPIFY_STORE_PERMANENT_DOMAIN}
          </p>
          <Badge className="mt-3 bg-success-soft text-success" variant="secondary">
            Conexão ativa
          </Badge>
        </div>

        <div className="card-surface p-5">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-4.5 w-4.5 text-primary" />
            <p className="text-sm font-medium text-muted-foreground">Produtos importados</p>
          </div>
          <p className="numeric mt-2 text-2xl font-extrabold">
            {productsQuery.isLoading ? "…" : products.length}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Catálogo lido da Shopify em tempo real (preço, variantes e estoque)
          </p>
        </div>

        <div className="card-surface p-5">
          <div className="flex items-center gap-2">
            <PackageSearch className="h-4.5 w-4.5 text-warning" />
            <p className="text-sm font-medium text-muted-foreground">Carrinhos na régua</p>
          </div>
          <p className="numeric mt-2 text-2xl font-extrabold">{activeCarts.length}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {brlExact(cartsValue)} em jogo · importados e monitorados automaticamente
          </p>
        </div>
      </section>

      <section className="card-surface p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold">Catálogo importado da Shopify</h2>
            <p className="text-sm text-muted-foreground">
              Estes são os produtos reais da sua loja. O CartLift usa esses dados para identificar o
              que trava a venda em cada carrinho abandonado.
            </p>
          </div>
        </div>

        {productsQuery.isError ? (
          <p className="mt-6 text-sm text-destructive">
            Não foi possível ler o catálogo da Shopify agora. Tente sincronizar novamente.
          </p>
        ) : productsQuery.isLoading ? (
          <p className="mt-6 text-sm text-muted-foreground">Importando produtos da Shopify…</p>
        ) : products.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed border-border p-8 text-center">
            <p className="text-sm font-semibold">Nenhum produto encontrado</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Sua loja Shopify ainda não tem produtos cadastrados. Peça a criação de um produto no
              chat informando nome e preço.
            </p>
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Variantes</TableHead>
                  <TableHead>Estoque</TableHead>
                  <TableHead className="text-right">Preço</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => {
                  const p = product.node;
                  const image = p.images.edges[0]?.node;
                  const price = p.priceRange.minVariantPrice;
                  return (
                    <TableRow key={p.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-11 w-11 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                            {image ? (
                              <img
                                src={image.url}
                                alt={image.altText ?? p.title}
                                loading="lazy"
                                className="h-full w-full object-cover"
                              />
                            ) : null}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold">{p.title}</p>
                            <p className="line-clamp-1 text-xs text-muted-foreground">
                              {p.description}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{p.productType || "Sem categoria"}</Badge>
                      </TableCell>
                      <TableCell className="numeric text-sm">{p.variants.edges.length}</TableCell>
                      <TableCell className="numeric text-sm">
                        {p.totalInventory ?? "—"}
                      </TableCell>
                      <TableCell className="numeric text-right font-semibold">
                        {formatMoney(price.amount, price.currencyCode)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </section>

      <section className="card-surface p-5">
        <h2 className="text-base font-semibold">Como a importação funciona</h2>
        <ul className="mt-4 grid gap-3 md:grid-cols-3">
          <li className="rounded-xl border border-border p-4">
            <p className="text-sm font-semibold">1. Catálogo</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Produtos, variantes, preços e estoque vêm da Storefront API da Shopify a cada
              sincronização.
            </p>
          </li>
          <li className="rounded-xl border border-border p-4">
            <p className="text-sm font-semibold">2. Carrinhos abandonados</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Cada checkout iniciado e não concluído na loja entra na lista de carrinhos com valor,
              itens e etapa de saída.
            </p>
          </li>
          <li className="rounded-xl border border-border p-4">
            <p className="text-sm font-semibold">3. Régua automática</p>
            <p className="mt-1 text-sm text-muted-foreground">
              O carrinho importado dispara a régua de e-mail e WhatsApp, e o resultado aparece no
              histórico de envios.
            </p>
          </li>
        </ul>
      </section>
    </>
  );
}
