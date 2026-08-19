-- The orders table is missing its public INSERT policy (checkout has been
-- failing with "new row violates row-level security policy for table
-- orders" since 002_orders.sql was first run). This just re-adds it.
-- Run once in the Supabase SQL Editor. Safe to re-run.

drop policy if exists "Anyone can place an order" on orders;
create policy "Anyone can place an order" on orders
  for insert with check (true);
