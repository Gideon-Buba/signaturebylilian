-- Adds a bookings table so the Oasis "Request Appointment" form actually
-- saves data instead of just showing a success toast. Anyone can submit a
-- booking request; only the admin can read/manage the list.
-- Run once in the Supabase SQL Editor. Safe to re-run.

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  phone text not null,
  email text,
  treatment_id uuid references treatments(id) on delete set null,
  treatment_name text not null,
  preferred_date date,
  preferred_time text,
  notes text not null default '',
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists bookings_set_updated_at on bookings;
create trigger bookings_set_updated_at
  before update on bookings
  for each row execute function set_updated_at();

alter table bookings enable row level security;

drop policy if exists "Anyone can request a booking" on bookings;
create policy "Anyone can request a booking" on bookings
  for insert with check (true);

drop policy if exists "Admins can read all bookings" on bookings;
create policy "Admins can read all bookings" on bookings
  for select using (auth.role() = 'authenticated');

drop policy if exists "Admins can update bookings" on bookings;
create policy "Admins can update bookings" on bookings
  for update using (auth.role() = 'authenticated');

drop policy if exists "Admins can delete bookings" on bookings;
create policy "Admins can delete bookings" on bookings
  for delete using (auth.role() = 'authenticated');
