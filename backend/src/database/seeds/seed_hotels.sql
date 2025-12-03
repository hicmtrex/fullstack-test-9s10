-- Seed data for hotels table
-- Only inserts if table is empty

INSERT INTO hotels (name, country, city, address, price_per_night)
SELECT * FROM (
  SELECT 'Grand Hotel Paris' as name, 'France' as country, 'Paris' as city, '123 Champs-Élysées' as address, 150.00 as price_per_night
  UNION ALL
  SELECT 'Seaside Resort', 'France', 'Nice', '45 Promenade des Anglais', 200.00
  UNION ALL
  SELECT 'Mountain View Lodge', 'Switzerland', 'Zurich', '78 Alpine Street', 180.00
  UNION ALL
  SELECT 'City Center Hotel', 'France', 'Lyon', '12 Rue de la République', 120.00
  UNION ALL
  SELECT 'Beachfront Paradise', 'Spain', 'Barcelona', '89 Beach Avenue', 220.00
) AS new_hotels
WHERE NOT EXISTS (SELECT 1 FROM hotels);

