/**
 * Integração Shopify (Storefront API) usada pelo CartLift
 * para importar catálogo de produtos da loja conectada.
 */
import { toast } from "sonner";

export const SHOPIFY_API_VERSION = "2025-07";
export const SHOPIFY_STORE_PERMANENT_DOMAIN =
  "cartlift-ai-boost-3hyh5-cm7aarr1.myshopify.com";
export const SHOPIFY_STOREFRONT_URL = `https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;
export const SHOPIFY_STOREFRONT_TOKEN = "bb0c98e04e217ea4422f2bec8252478a";

export interface ShopifyProduct {
  node: {
    id: string;
    title: string;
    description: string;
    handle: string;
    productType: string;
    vendor: string;
    totalInventory: number | null;
    priceRange: {
      minVariantPrice: { amount: string; currencyCode: string };
    };
    images: {
      edges: Array<{ node: { url: string; altText: string | null } }>;
    };
    variants: {
      edges: Array<{
        node: {
          id: string;
          title: string;
          price: { amount: string; currencyCode: string };
          availableForSale: boolean;
          selectedOptions: Array<{ name: string; value: string }>;
        };
      }>;
    };
    options: Array<{ name: string; values: string[] }>;
  };
}

export const STOREFRONT_PRODUCTS_QUERY = `
  query GetProducts($first: Int!, $query: String) {
    products(first: $first, query: $query) {
      edges {
        node {
          id
          title
          description
          handle
          productType
          vendor
          totalInventory
          priceRange { minVariantPrice { amount currencyCode } }
          images(first: 5) { edges { node { url altText } } }
          variants(first: 10) {
            edges {
              node {
                id
                title
                price { amount currencyCode }
                availableForSale
                selectedOptions { name value }
              }
            }
          }
          options { name values }
        }
      }
    }
  }
`;

export const SHOP_QUERY = `
  query Shop {
    shop {
      name
      primaryDomain { url }
      paymentSettings { currencyCode }
    }
  }
`;

export async function storefrontApiRequest(
  query: string,
  variables: Record<string, unknown> = {},
) {
  const response = await fetch(SHOPIFY_STOREFRONT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (response.status === 402) {
    toast.error("Shopify: pagamento necessário", {
      description:
        "O acesso à API da Shopify exige um plano ativo. Acesse admin.shopify.com para atualizar sua loja.",
    });
    return;
  }

  if (!response.ok) {
    throw new Error(`Erro HTTP na Shopify: ${response.status}`);
  }

  const data = await response.json();

  if (data.errors) {
    throw new Error(
      `Erro na Shopify: ${data.errors.map((e: { message: string }) => e.message).join(", ")}`,
    );
  }

  return data;
}

export async function fetchShopifyProducts(first = 50): Promise<ShopifyProduct[]> {
  const data = await storefrontApiRequest(STOREFRONT_PRODUCTS_QUERY, { first });
  return (data?.data?.products?.edges ?? []) as ShopifyProduct[];
}

export async function fetchShopifyShop(): Promise<{
  name: string;
  url: string;
  currencyCode: string;
} | null> {
  const data = await storefrontApiRequest(SHOP_QUERY);
  const shop = data?.data?.shop;
  if (!shop) return null;
  return {
    name: shop.name,
    url: shop.primaryDomain?.url ?? `https://${SHOPIFY_STORE_PERMANENT_DOMAIN}`,
    currencyCode: shop.paymentSettings?.currencyCode ?? "BRL",
  };
}

export function formatMoney(amount: string | number, currencyCode: string) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: currencyCode || "BRL",
  }).format(typeof amount === "string" ? Number(amount) : amount);
}
