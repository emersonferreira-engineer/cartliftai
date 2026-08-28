CREATE TABLE public.shopify_webhook_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  topic TEXT NOT NULL,
  shop_domain TEXT,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  received_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.live_carts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  external_id TEXT NOT NULL UNIQUE,
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  total NUMERIC(12,2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'BRL',
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  abandoned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'novo',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.product_changes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id TEXT,
  product_title TEXT NOT NULL,
  variant_title TEXT,
  change_type TEXT NOT NULL,
  old_value TEXT,
  new_value TEXT,
  occurred_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.regua_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cart_external_id TEXT,
  customer_name TEXT,
  customer_email TEXT,
  channel TEXT NOT NULL,
  template_id TEXT,
  variant TEXT,
  status TEXT NOT NULL,
  revenue NUMERIC(12,2) NOT NULL DEFAULT 0,
  occurred_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_shopify_webhook_events_received_at ON public.shopify_webhook_events (received_at DESC);
CREATE INDEX idx_live_carts_abandoned_at ON public.live_carts (abandoned_at DESC);
CREATE INDEX idx_product_changes_occurred_at ON public.product_changes (occurred_at DESC);
CREATE INDEX idx_regua_events_occurred_at ON public.regua_events (occurred_at DESC);

GRANT ALL ON public.shopify_webhook_events TO service_role;
GRANT ALL ON public.live_carts TO service_role;
GRANT ALL ON public.product_changes TO service_role;
GRANT ALL ON public.regua_events TO service_role;

ALTER TABLE public.shopify_webhook_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_changes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.regua_events ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_live_carts_updated_at
BEFORE UPDATE ON public.live_carts
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();