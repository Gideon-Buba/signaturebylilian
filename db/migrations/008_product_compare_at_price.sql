-- Adds an optional "compare at" price to products, so a product (e.g. a
-- bundle like "SBL Full Collection") can show a struck-through original
-- price next to a discounted price, with the savings called out.
alter table public.products
  add column if not exists compare_at_price integer;
