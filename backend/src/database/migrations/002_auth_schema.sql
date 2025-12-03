-- Users table for authentication and authorization
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CHECK (role IN ('user', 'admin'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Optionally link reservations to users (nullable to keep existing data valid)
-- Add column if it doesn't exist
ALTER TABLE reservations
  ADD COLUMN IF NOT EXISTS user_id INT NULL;

-- Add index (migration runner will skip if already exists)
ALTER TABLE reservations
  ADD INDEX idx_user_id (user_id);

-- Add foreign key constraint (migration runner will skip if already exists)
ALTER TABLE reservations
  ADD CONSTRAINT fk_reservations_user
  FOREIGN KEY (user_id) REFERENCES users(id)
  ON DELETE SET NULL ON UPDATE CASCADE;


