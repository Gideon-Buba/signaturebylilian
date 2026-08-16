-- Adds guest checkout support: an orders table + line items, with no user
-- accounts involved. Anyone can create an order (checkout submits one), but
-- only the admin (Dr Lilian, logged in) can read the order list — this keeps
-- customer contact details private instead of publicly queryable.
-- Run once in the Supabase SQL Editor. Safe to re-run.

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  phone text not null,
  email text,
  address text not null,
  notes text not null default '',
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'fulfilled', 'cancelled')),
  subtotal integer not null check (subtotal >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists orders_set_updated_at on orders;
create trigger orders_set_updated_at
  before update on orders
  for each row execute function set_updated_at();

alter table orders enable row level security;

drop policy if exists "Anyone can place an order" on orders;
create policy "Anyone can place an order" on orders
  for insert with check (true);

drop policy if exists "Admins can read all orders" on orders;
create policy "Admins can read all orders" on orders
  for select using (auth.role() = 'authenticated');

drop policy if exists "Admins can update orders" on orders;
create policy "Admins can update orders" on orders
  for update using (auth.role() = 'authenticated');

drop policy if exists "Admins can delete orders" on orders;
create policy "Admins can delete orders" on orders
  for delete using (auth.role() = 'authenticated');

-- ---------------------------------------------------------------------------
-- order_items — line items, snapshotting name/price at time of purchase so
-- later edits to a product don't rewrite past orders.
-- ---------------------------------------------------------------------------
create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  product_name text not null,
  size text,
  unit_price integer not null check (unit_price >= 0),
  quantity integer not null check (quantity > 0),
  created_at timestamptz not null default now()
);

alter table order_items enable row level security;

drop policy if exists "Anyone can add order items" on order_items;
create policy "Anyone can add order items" on order_items
  for insert with check (true);

drop policy if exists "Admins can read all order items" on order_items;
create policy "Admins can read all order items" on order_items
  for select using (auth.role() = 'authenticated');

drop policy if exists "Admins can delete order items" on order_items;
create policy "Admins can delete order items" on order_items
  for delete using (auth.role() = 'authenticated');
