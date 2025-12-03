import mysql from 'mysql2/promise';
import { getConnectionPool } from '../../database/connection';
import { User } from './auth.types';

/**
 * Auth Repository
 * Handles database operations related to users
 */
export class AuthRepository {
  private pool: mysql.Pool;

  constructor() {
    this.pool = getConnectionPool();
  }

  /**
   * Find a user by email
   * @param email - User email
   * @returns User or null if not found
   */
  async findByEmail(email: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE email = ? LIMIT 1';
    const [rows] = await this.pool.query<mysql.RowDataPacket[]>(query, [email]);

    if (Array.isArray(rows) && rows.length > 0) {
      return rows[0] as User;
    }

    return null;
  }

  /**
   * Find a user by id
   * @param id - User id
   * @returns User or null if not found
   */
  async findById(id: number): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE id = ? LIMIT 1';
    const [rows] = await this.pool.query<mysql.RowDataPacket[]>(query, [id]);

    if (Array.isArray(rows) && rows.length > 0) {
      return rows[0] as User;
    }

    return null;
  }

  /**
   * Create a new user
   * @param email - User email
   * @param passwordHash - Hashed password
   * @param role - User role
   * @returns Created user
   */
  async create(email: string, passwordHash: string, role: 'user' | 'admin'): Promise<User> {
    const query = 'INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)';
    const params = [email, passwordHash, role];

    const [result] = await this.pool.query<mysql.ResultSetHeader>(query, params);

    const user: User = {
      id: result.insertId,
      email,
      password_hash: passwordHash,
      role,
      created_at: new Date(),
      updated_at: undefined,
    };

    return user;
  }
}
