-- Adds category grouping and a "featured" flag to treatments, and makes
-- duration/price optional (most real spa menu items have neither a fixed
-- duration nor, in a couple of cases, a set price yet).
-- Run once in the Supabase SQL Editor. Safe to re-run.

alter table treatments add column if not exists category text not null default '';
alter table treatments add column if not exists is_featured boolean not null default false;
alter table treatments alter column duration drop not null;
alter table treatments alter column price drop not null;
