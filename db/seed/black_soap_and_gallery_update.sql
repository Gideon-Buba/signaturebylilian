-- 1. Adds a second gallery photo to Body Butter (50g) — a candlelit "THE
--    BALM" shot, distinct from the main product photo. Idempotent (dedupes
--    the URL, so re-running won't add it twice).
update products
set gallery_urls = array(
  select distinct unnest(gallery_urls || array['/products/body-butter-50g-2.jpeg'])
)
where name = 'Body Butter' and size = '50g';

-- 2. Creates the NOIR African Black Soap product (500ml and 250ml), with
-- 3 photos each (1 main + 2 gallery angles). No price yet — Dr Lilian
-- hasn't confirmed cost, so these are created ARCHIVED (hidden from the
-- public storefront) with a placeholder price of 0. Once she gives you the
-- real price: go to Admin -> Products -> Archived tab, edit each one to set
-- the correct price, then click Restore to make it live.
-- Safe to re-run — clears any previous NOIR Black Soap rows first.
delete from products where name = 'NOIR African Black Soap';

insert into products (name, size, description, price, tag, image_url, gallery_urls, in_stock, is_archived, sort_order) values
  (
    'NOIR African Black Soap', '500ml',
    'A purifying African black soap with sandalwood, cinnamon and rice powder.',
    0, 'New',
    '/products/black-soap-1.jpeg',
    array['/products/black-soap-2.jpeg', '/products/black-soap-3.jpeg'],
    true, true, 7
  ),
  (
    'NOIR African Black Soap', '250ml',
    'A purifying African black soap with sandalwood, cinnamon and rice powder, sized for travel.',
    0, 'New',
    '/products/black-soap-1.jpeg',
    array['/products/black-soap-2.jpeg', '/products/black-soap-3.jpeg'],
    true, true, 8
  );
