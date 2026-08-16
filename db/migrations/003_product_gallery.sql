-- Adds a gallery of extra photos per product, shown on the product detail
-- page alongside the main image. The main image (image_url) is unchanged —
-- this is purely additional photos.
-- Run once in the Supabase SQL Editor. Safe to re-run.

alter table products add column if not exists gallery_urls text[] not null default '{}';
