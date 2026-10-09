-- Single-row table of site-wide toggles, starting with which payment methods
-- show up at checkout. Anyone can read it (the public checkout page needs
-- to), only admins can change it.
-- Run once in the Supabase SQL Editor. Safe to re-run.

create table if not exists site_settings (
  id boolean primary key default true,
  pay_online_enabled boolean not null default true,
  bank_transfer_enabled boolean not null default true,
  updated_at timestamptz not null default now(),
  constraint site_settings_singleton check (id)
);

insert into site_settings (id) values (true) on conflict (id) do nothing;

drop trigger if exists site_settings_set_updated_at on site_settings;
create trigger site_settings_set_updated_at
  before update on site_settings
  for each row execute function set_updated_at();

alter table site_settings enable row level security;

drop policy if exists "Anyone can read site settings" on site_settings;
create policy "Anyone can read site settings" on site_settings
  for select using (true);

drop policy if exists "Admins can update site settings" on site_settings;
create policy "Admins can update site settings" on site_settings
  for update using (auth.role() = 'authenticated');
