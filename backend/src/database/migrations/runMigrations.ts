import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { getConnectionPool } from '../connection';
import { logger } from '../../shared/config/logger';

/**
 * Runs database migrations
 * Reads SQL files from migrations folder and executes them
 */
export async function runMigrations(): Promise<void> {
  const pool = getConnectionPool();
  const migrationPath = join(__dirname, '001_initial_schema.sql');

  try {
    logger.info('Running database migrations...');
    const migrationSQL = readFileSync(migrationPath, 'utf-8');

    // Split by semicolon and execute each statement
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);

    for (const statement of statements) {
      if (statement) {
        await pool.query(statement);
      }
    }

    logger.info('Database migrations completed successfully');
  } catch (error) {
    logger.error('Database migration failed', error);
    throw error;
  }
}

/**
 * Seeds the database with initial data
 */
export async function seedDatabase(): Promise<void> {
  const pool = getConnectionPool();
  const seedPath = join(__dirname, '../seeds/seed_hotels.sql');

  try {
    logger.info('Seeding database...');
    const seedSQL = readFileSync(seedPath, 'utf-8');

    // Split by semicolon and execute each statement
    const statements = seedSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);

    for (const statement of statements) {
      if (statement) {
        await pool.query(statement);
      }
    }

    logger.info('Database seeding completed successfully');
  } catch (error) {
    logger.error('Database seeding failed', error);
    throw error;
  }
}
