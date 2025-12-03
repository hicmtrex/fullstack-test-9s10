import mysql from 'mysql2/promise';
import { env } from './env';

/**
 * Database configuration object
 * Valid PoolOptions for mysql2
 *
 * Note: For MySQL 8.0+ with caching_sha2_password authentication issues,
 * configure MySQL to use mysql_native_password instead:
 * ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
 */
export const dbConfig: mysql.PoolOptions = {
  host: env.DB_HOST,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  port: env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  // Connection timeout (valid PoolOption)
  connectTimeout: 10000, // 10 seconds
  // SSL is not enabled by default (omit the property)
  // To enable SSL, uncomment and configure:
  // ssl: {
  //   rejectUnauthorized: false // For development only
  // },
};

/**
 * Creates and returns a MySQL connection pool
 * @returns MySQL connection pool
 */
export function createConnectionPool(): mysql.Pool {
  return mysql.createPool(dbConfig);
}
