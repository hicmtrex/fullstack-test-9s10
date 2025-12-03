-- Add image_url column to hotels table for displaying hotel images
ALTER TABLE hotels
  ADD COLUMN IF NOT EXISTS image_url VARCHAR(500) NULL;

