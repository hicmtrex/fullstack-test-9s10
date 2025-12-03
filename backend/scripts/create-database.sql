-- ============================================
-- Travel Agency Database Setup Script
-- ============================================
-- Run this script to create the database
-- 
-- Method 1: Using MySQL command line (from backend directory)
--   "C:\Program Files\MySQL\MySQL Server 9.4\bin\mysql.exe" -u root -p < scripts/create-database.sql
--
-- Method 2: Using PowerShell (from backend directory)
--   .\scripts\create-database.ps1
--
-- Method 3: Using Batch file (from backend directory)
--   .\scripts\create-database.bat
--
-- Method 4: Copy and paste into MySQL Workbench or phpMyAdmin

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS travel_agency 
  CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

-- Show success message
SELECT 'Database travel_agency created successfully!' AS message;

