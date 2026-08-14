-- Signature by Lilian — database schema
-- Run this once in the Supabase SQL Editor (Project -> SQL Editor -> New query).
-- Safe to re-run: every statement is idempotent (create-if-not-exists / drop-then-create).

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- updated_at trigger helper (shared by all three tables)
-- ---------------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ---------------------------------------------------------------------------
-- products
-- ---------------------------------------------------------------------------
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  size text,
  description text not null default '',
  price integer not null check (price >= 0),
  tag text not null default 'New' check (tag in ('Best Seller', 'New', 'Signature')),
  image_url text,
  benefits text[] not null default '{}',
  in_stock boolean not null default true,
  is_archived boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists products_set_updated_at on products;
create trigger products_set_updated_at
  before update on products
  for each row execute function set_updated_at();

alter table products enable row level security;

drop policy if exists "Public can read active products" on products;
create policy "Public can read active products" on products
  for select using (is_archived = false);

drop policy if exists "Admins can read all products" on products;
create policy "Admins can read all products" on products
  for select using (auth.role() = 'authenticated');

drop policy if exists "Admins can insert products" on products;
create policy "Admins can insert products" on products
  for insert with check (auth.role() = 'authenticated');

drop policy if exists "Admins can update products" on products;
create policy "Admins can update products" on products
  for update using (auth.role() = 'authenticated');

drop policy if exists "Admins can delete products" on products;
create policy "Admins can delete products" on products
  for delete using (auth.role() = 'authenticated');

-- ---------------------------------------------------------------------------
-- treatments (spa menu)
-- ---------------------------------------------------------------------------
create table if not exists treatments (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  duration text not null,
  price integer not null check (price >= 0),
  benefits text[] not null default '{}',
  image_url text,
  is_active boolean not null default true,
  is_archived boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists treatments_set_updated_at on treatments;
create trigger treatments_set_updated_at
  before update on treatments
  for each row execute function set_updated_at();

alter table treatments enable row level security;

drop policy if exists "Public can read active treatments" on treatments;
create policy "Public can read active treatments" on treatments
  for select using (is_archived = false and is_active = true);

drop policy if exists "Admins can read all treatments" on treatments;
create policy "Admins can read all treatments" on treatments
  for select using (auth.role() = 'authenticated');

drop policy if exists "Admins can insert treatments" on treatments;
create policy "Admins can insert treatments" on treatments
  for insert with check (auth.role() = 'authenticated');

drop policy if exists "Admins can update treatments" on treatments;
create policy "Admins can update treatments" on treatments
  for update using (auth.role() = 'authenticated');

drop policy if exists "Admins can delete treatments" on treatments;
create policy "Admins can delete treatments" on treatments
  for delete using (auth.role() = 'authenticated');

-- ---------------------------------------------------------------------------
-- journal_posts
-- ---------------------------------------------------------------------------
create table if not exists journal_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  category text not null check (category in ('Skincare', 'Wellness')),
  excerpt text not null default '',
  body text not null default '',
  cover_image_url text,
  read_time text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists journal_posts_set_updated_at on journal_posts;
create trigger journal_posts_set_updated_at
  before update on journal_posts
  for each row execute function set_updated_at();

alter table journal_posts enable row level security;

drop policy if exists "Public can read published posts" on journal_posts;
create policy "Public can read published posts" on journal_posts
  for select using (status = 'published');

drop policy if exists "Admins can read all posts" on journal_posts;
create policy "Admins can read all posts" on journal_posts
  for select using (auth.role() = 'authenticated');

drop policy if exists "Admins can insert posts" on journal_posts;
create policy "Admins can insert posts" on journal_posts
  for insert with check (auth.role() = 'authenticated');

drop policy if exists "Admins can update posts" on journal_posts;
create policy "Admins can update posts" on journal_posts
  for update using (auth.role() = 'authenticated');

drop policy if exists "Admins can delete posts" on journal_posts;
create policy "Admins can delete posts" on journal_posts
  for delete using (auth.role() = 'authenticated');

-- ---------------------------------------------------------------------------
-- Storage bucket for product / treatment / journal images
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "Public can read media" on storage.objects;
create policy "Public can read media" on storage.objects
  for select using (bucket_id = 'media');

drop policy if exists "Admins can upload media" on storage.objects;
create policy "Admins can upload media" on storage.objects
  for insert with check (bucket_id = 'media' and auth.role() = 'authenticated');

drop policy if exists "Admins can update media" on storage.objects;
create policy "Admins can update media" on storage.objects
  for update using (bucket_id = 'media' and auth.role() = 'authenticated');

drop policy if exists "Admins can delete media" on storage.objects;
create policy "Admins can delete media" on storage.objects
  for delete using (bucket_id = 'media' and auth.role() = 'authenticated');
