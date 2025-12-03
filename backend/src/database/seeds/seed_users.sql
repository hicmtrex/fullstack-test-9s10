-- Seed admin user for authentication
-- Only inserts if admin email does not already exist

INSERT INTO users (email, password_hash, role)
SELECT *
FROM (
  SELECT 'admin@example.com' AS email,
    '$2a$10$L71bNblJ9uy9HnEMxqPpKefi9/QThL2d3C0R1LVNjTxVo5Xkcip8e' AS password_hash, -- password: Admin123!
    'admin' AS role
) AS new_user
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@example.com');


