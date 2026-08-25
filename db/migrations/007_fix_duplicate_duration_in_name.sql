-- Some treatment names have the duration baked in twice, e.g. name
-- "Counselling (60 Mins)" with duration "60 Mins" — the site already shows
-- duration separately, so this renders as "Counselling (60 Mins) (60 Mins)".
-- Strips a trailing "(<duration>)" from the name wherever it duplicates the
-- duration column. Safe to re-run.

update treatments
set name = trim(regexp_replace(name, '\s*\(' || duration || '\)\s*$', ''))
where duration is not null
  and name ~ ('\(' || duration || '\)\s*$');
