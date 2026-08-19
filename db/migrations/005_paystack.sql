-- Adds payment tracking to orders for the Paystack integration.
-- Run once in the Supabase SQL Editor. Safe to re-run.

alter table orders add column if not exists payment_status text not null default 'unpaid'
  check (payment_status in ('unpaid', 'paid', 'failed'));
alter table orders add column if not exists payment_reference text unique;
