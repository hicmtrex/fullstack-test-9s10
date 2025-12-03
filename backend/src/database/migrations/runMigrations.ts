import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { getConnectionPool } from '../connection';
import { logger } from '../../shared/config/logger';

/**
 * Runs database migrations
 * Reads SQL files from migrations folder and executes them
 */
export async function runMigrations(): Promise<void> {
  const pool = getConnectionPool();
  try {
    logger.info('Running database migrations...');

    // Run all *.sql migration files in this directory in alphabetical order
    const migrationDir = __dirname;
    const files = readdirSync(migrationDir)
      .filter(file => file.endsWith('.sql'))
      .sort();

    for (const file of files) {
      const migrationPath = join(migrationDir, file);
      const migrationSQL = readFileSync(migrationPath, 'utf-8');

      const statements = migrationSQL
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0);

      for (const statement of statements) {
        if (statement) {
          try {
            // eslint-disable-next-line no-await-in-loop
            await pool.query(statement);
          } catch (error: unknown) {
            // Ignore duplicate key/index errors (idempotent migrations)
            const mysqlError = error as { code?: string; errno?: number; sqlMessage?: string };
            if (
              mysqlError.code === 'ER_DUP_KEYNAME' ||
              mysqlError.code === 'ER_DUP_ENTRY' ||
              mysqlError.errno === 1061 || // Duplicate key name
              mysqlError.errno === 1062 || // Duplicate entry
              (mysqlError.sqlMessage && mysqlError.sqlMessage.includes('Duplicate'))
            ) {
              logger.warn(
                `Skipping duplicate key/index in ${file}: ${mysqlError.sqlMessage || mysqlError.code}`
              );
              continue;
            }
            throw error;
          }
        }
      }

      logger.info(`Migration ${file} executed successfully`);
    }

    logger.info('All database migrations completed successfully');
  } catch (error) {
    logger.error('Database migration failed', error);
    throw error;
  }
}

/**
 * Seeds the database with initial data
 * Executes all SQL files in the seeds directory
 */
export async function seedDatabase(): Promise<void> {
  const pool = getConnectionPool();
  const seedsDir = join(__dirname, '../seeds');

  try {
    logger.info('Seeding database...');
    const files = readdirSync(seedsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();

    for (const file of files) {
      const seedPath = join(seedsDir, file);
      const seedSQL = readFileSync(seedPath, 'utf-8');

      const statements = seedSQL
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0);

      for (const statement of statements) {
        if (statement) {
          // eslint-disable-next-line no-await-in-loop
          await pool.query(statement);
        }
      }

      logger.info(`Seed ${file} executed successfully`);
    }

    logger.info('Database seeding completed successfully');
  } catch (error) {
    logger.error('Database seeding failed', error);
    throw error;
  }
}
