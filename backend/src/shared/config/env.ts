import dotenv from 'dotenv';

dotenv.config();

/**
 * Validates and exports environment variables
 * Throws error if required environment variables are missing
 */
export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3001', 10),
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_USER: process.env.DB_USER || 'root',
  DB_PASSWORD: process.env.DB_PASSWORD || '',
  DB_NAME: process.env.DB_NAME || 'travel_agency',
  DB_PORT: parseInt(process.env.DB_PORT || '3306', 10),
} as const;

/**
 * Validates that all required environment variables are set
 */
export function validateEnv(): void {
  const required = ['DB_HOST', 'DB_USER', 'DB_NAME'];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

// Validate on import
validateEnv();

