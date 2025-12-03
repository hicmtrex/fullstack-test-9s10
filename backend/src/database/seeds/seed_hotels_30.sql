-- Seed 30 hotels with images
-- Updates existing hotels with images and inserts new ones
-- Uses INSERT ... ON DUPLICATE KEY UPDATE for idempotency

-- First, update existing hotels with images if they don't have them
UPDATE hotels SET image_url = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop' WHERE name = 'Grand Hotel Paris' AND (image_url IS NULL OR image_url = '');
UPDATE hotels SET image_url = 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop' WHERE name = 'Seaside Resort' AND (image_url IS NULL OR image_url = '');
UPDATE hotels SET image_url = 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop' WHERE name = 'Mountain View Lodge' AND (image_url IS NULL OR image_url = '');
UPDATE hotels SET image_url = 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop' WHERE name = 'City Center Hotel' AND (image_url IS NULL OR image_url = '');
UPDATE hotels SET image_url = 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop' WHERE name = 'Beachfront Paradise' AND (image_url IS NULL OR image_url = '');

-- Insert new hotels (25 additional hotels)
INSERT INTO hotels (name, country, city, address, price_per_night, image_url)
SELECT * FROM (
  SELECT 'Royal Palace Hotel' as name, 'United Kingdom' as country, 'London' as city, '15 Buckingham Palace Road' as address, 450.00 as price_per_night, 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop' as image_url
  UNION ALL
  SELECT 'Alpine Retreat', 'Switzerland', 'Interlaken', '22 Mountain View Road', 380.00, 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=800&h=600&fit=crop'
  UNION ALL
  SELECT 'Mediterranean Villa', 'Italy', 'Rome', 'Via del Corso 123', 420.00, 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop'
  UNION ALL
  SELECT 'Coastal Haven', 'Portugal', 'Lisbon', 'Avenida da Liberdade 456', 290.00, 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop'
  UNION ALL
  SELECT 'Historic Grand Hotel', 'Italy', 'Venice', 'Canal Grande 789', 480.00, 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop'
  UNION ALL
  SELECT 'Sunset Resort', 'Greece', 'Santorini', 'Oia Village 101', 520.00, 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop'
  UNION ALL
  SELECT 'Urban Boutique', 'Germany', 'Berlin', 'Unter den Linden 234', 220.00, 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop'
  UNION ALL
  SELECT 'Luxury Spa Hotel', 'Austria', 'Vienna', 'Ringstraße 567', 390.00, 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop'
  UNION ALL
  SELECT 'Riverside Inn', 'Czech Republic', 'Prague', 'Charles Bridge 890', 240.00, 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop'
  UNION ALL
  SELECT 'Castle View Hotel', 'Ireland', 'Dublin', 'Temple Bar 345', 270.00, 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop'
  UNION ALL
  SELECT 'Modern City Hotel', 'Netherlands', 'Amsterdam', 'Damrak 678', 310.00, 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop'
  UNION ALL
  SELECT 'Seaside Luxury', 'Croatia', 'Dubrovnik', 'Old Town 901', 410.00, 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop'
  UNION ALL
  SELECT 'Alpine Chalet', 'France', 'Chamonix', 'Mont Blanc Avenue 112', 360.00, 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=800&h=600&fit=crop'
  UNION ALL
  SELECT 'Garden Palace', 'Spain', 'Madrid', 'Gran Vía 223', 330.00, 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop'
  UNION ALL
  SELECT 'Historic Manor', 'Scotland', 'Edinburgh', 'Royal Mile 334', 290.00, 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop'
  UNION ALL
  SELECT 'Beach Resort', 'Turkey', 'Istanbul', 'Bosphorus Street 445', 280.00, 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop'
  UNION ALL
  SELECT 'Luxury Tower', 'United Arab Emirates', 'Dubai', 'Sheikh Zayed Road 556', 650.00, 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop'
  UNION ALL
  SELECT 'Mountain Lodge', 'Norway', 'Oslo', 'Fjord View 667', 340.00, 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=800&h=600&fit=crop'
  UNION ALL
  SELECT 'Coastal Retreat', 'Denmark', 'Copenhagen', 'Nyhavn 778', 300.00, 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop'
  UNION ALL
  SELECT 'Royal Suite Hotel', 'Belgium', 'Brussels', 'Grand Place 889', 260.00, 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop'
  UNION ALL
  SELECT 'Boutique Hotel', 'Sweden', 'Stockholm', 'Gamla Stan 990', 320.00, 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop'
  UNION ALL
  SELECT 'Lakeside Resort', 'Switzerland', 'Geneva', 'Lake Geneva 111', 400.00, 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop'
  UNION ALL
  SELECT 'City Lights Hotel', 'Poland', 'Warsaw', 'Old Town Square 222', 200.00, 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop'
  UNION ALL
  SELECT 'Garden View Inn', 'Hungary', 'Budapest', 'Danube River 333', 250.00, 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop'
  UNION ALL
  SELECT 'Historic Plaza Hotel', 'Spain', 'Seville', 'Plaza de España 444', 310.00, 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop'
  UNION ALL
  SELECT 'Sunset Bay Resort', 'Malta', 'Valletta', 'Grand Harbour 555', 350.00, 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop'
) AS new_hotels
WHERE NOT EXISTS (SELECT 1 FROM hotels WHERE hotels.name = new_hotels.name);
