-- Seed admin user for authentication
-- Only inserts if admin email does not already exist
-- Email: admin@agency.com
-- Password: admin123

INSERT INTO users (email, password_hash, role)
SELECT *
FROM (
  SELECT 'admin@agency.com' AS email,
    '$2a$10$PQ54W..w9Z39jlFt.o5gneRvzo7MqbSo4uiW7ZQhOLE2siEIKzjYS' AS password_hash, -- password: admin123
    'admin' AS role
) AS new_user
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@agency.com');


