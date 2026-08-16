-- Seeds the 7 skincare products that were previously hardcoded in the app.
-- Run once in the Supabase SQL Editor. Safe to re-run: it clears these exact
-- products by name+size first, so re-running after a fix won't duplicate rows.
--
-- Image uploads are left for the admin dashboard (Products -> Edit -> upload
-- image) since the photos live locally, not at a public URL yet.

delete from products where (name, size) in (
  ('Body Butter', '300g'),
  ('Body Butter', '100g'),
  ('Body Butter', '50g'),
  ('Body Oil', '200ml'),
  ('Body Scrub', '400g'),
  ('Face Soap', '200g'),
  ('Glow Serum', '50ml')
);

insert into products (name, size, description, price, tag, benefits, in_stock, sort_order) values
  (
    'Body Butter', '300g',
    'A rich, whipped body butter with mango, sweet almond and carrot seed oil.',
    19500, 'Best Seller',
    array['Deep hydration', 'Softens skin', 'Rich, whipped texture'],
    true, 0
  ),
  (
    'Body Butter', '100g',
    'Our whipped mango and sweet almond body butter in an everyday size.',
    12000, 'Signature',
    array['Deep hydration', 'Softens skin', 'Rich, whipped texture'],
    true, 1
  ),
  (
    'Body Butter', '50g',
    'The whipped mango and sweet almond body butter, sized for travel.',
    6500, 'New',
    array['Deep hydration', 'Softens skin', 'Travel friendly'],
    true, 2
  ),
  (
    'Body Oil', '200ml',
    'A luminous body oil blended with argan, rosehip and carrot.',
    18500, 'Best Seller',
    array['Nourishes skin', 'Adds radiant glow', 'Fast-absorbing'],
    true, 3
  ),
  (
    'Body Scrub', '400g',
    'An exfoliating body scrub with citrus, turmeric and papaya.',
    15500, 'New',
    array['Gently exfoliates', 'Brightens skin', 'Smooths texture'],
    true, 4
  ),
  (
    'Face Soap', '200g',
    'A nourishing face soap with carrot, fenugreek and goat milk.',
    9500, 'Signature',
    array['Cleanses gently', 'Evens tone', 'Nourishing lather'],
    true, 5
  ),
  (
    'Glow Serum', '50ml',
    'A brightening face serum with vitamin C and niacinamide.',
    7000, 'Best Seller',
    array['Brightens complexion', 'Evens tone', 'Boosts radiance'],
    true, 6
  );
