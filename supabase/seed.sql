-- Seed data for testing

-- Get admin user ID
WITH admin_user AS (
  SELECT id FROM profiles WHERE role = 'admin' LIMIT 1
),
-- Create commerce
new_commerce AS (
  INSERT INTO commerces (owner_id, name, description, address, latitude, longitude)
  SELECT 
    id,
    'Bar La Fiesta',
    'El mejor bar para eventos',
    'Calle Mayor 123, Palma',
    39.5696,
    2.6502
  FROM admin_user
  RETURNING id
),
-- Create products
new_products AS (
  INSERT INTO products (commerce_id, name, description, price, category, is_available)
  SELECT 
    nc.id,
    p.name,
    p.description,
    p.price,
    p.category,
    true
  FROM new_commerce nc
  CROSS JOIN (VALUES 
    ('Cerveza', 'Cerveza fría 33cl', 3.50, 'bebidas'),
    ('Mojito', 'Mojito cubano', 7.00, 'cocteles'),
    ('Agua', 'Agua mineral 50cl', 2.00, 'refrescos')
  ) AS p(name, description, price, category)
  RETURNING id, commerce_id
),
-- Create event
new_event AS (
  INSERT INTO events (commerce_id, title, description, address, latitude, longitude, start_date, end_date, is_active)
  SELECT 
    id,
    'Fiesta de Verano 2026',
    'La mejor fiesta del verano con música en vivo',
    'Calle Mayor 123, Palma',
    39.5696,
    2.6502,
    NOW(),
    NOW() + INTERVAL '7 days',
    true
  FROM new_commerce
  RETURNING id, commerce_id
)
-- Associate products to event
INSERT INTO event_products (event_id, product_id)
SELECT ne.id, np.id 
FROM new_event ne
JOIN new_products np ON np.commerce_id = ne.commerce_id;
