import mysql from 'mysql2/promise';
import { createConnectionPool } from '../shared/config/database';
import { logger } from '../shared/config/logger';
import { env } from '../shared/config/env';

/**
 * Global database connection pool
 * Initialized on module load
 */
let pool: mysql.Pool | null = null;

/**
 * Gets the database connection pool
 * Creates a new pool if it doesn't exist
 * @returns MySQL connection pool
 */
export function getConnectionPool(): mysql.Pool {
  if (!pool) {
    pool = createConnectionPool();
    logger.info('Database connection pool created', {
      host: env.DB_HOST,
      database: env.DB_NAME,
    });
  }
  return pool;
}

/**
 * Closes the database connection pool
 * Should be called on application shutdown
 */
export async function closeConnectionPool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
    logger.info('Database connection pool closed');
  }
}

/**
 * Health check for database connection
 * @returns Promise<boolean> - true if connection is healthy
 */
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    const connection = getConnectionPool();
    await connection.query('SELECT 1');
    return true;
  } catch (error) {
    logger.error('Database health check failed', error);
    return false;
  }
}
