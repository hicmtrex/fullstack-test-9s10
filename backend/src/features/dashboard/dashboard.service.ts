import mysql from 'mysql2/promise';
import { getConnectionPool } from '../../database/connection';
import { logger } from '../../shared/config/logger';

/**
 * Dashboard statistics interface
 */
export interface DashboardStats {
  hotels: number;
  reservations: number;
  factures: number;
  totalRevenue: number;
}

/**
 * Dashboard Service
 * Handles business logic for dashboard statistics
 * Optimized to fetch all stats in a single query
 */
export class DashboardService {
  private pool: mysql.Pool;

  constructor() {
    this.pool = getConnectionPool();
  }

  /**
   * Get all dashboard statistics in a single optimized query
   * Uses subqueries to fetch all stats in one database round-trip
   * @returns Promise<DashboardStats> - Dashboard statistics
   */
  async getStats(): Promise<DashboardStats> {
    try {
      // Optimized single query to fetch all statistics
      // This reduces database round-trips from 4 to 1
      const query = `
        SELECT 
          (SELECT COUNT(*) FROM hotels) as hotels,
          (SELECT COUNT(*) FROM reservations) as reservations,
          (SELECT COUNT(*) FROM factures) as factures,
          (SELECT COALESCE(SUM(total_amount), 0) FROM factures WHERE status = 'paid') as totalRevenue
      `;

      const [rows] = await this.pool.query<mysql.RowDataPacket[]>(query);

      if (!Array.isArray(rows) || rows.length === 0) {
        logger.warn('Dashboard stats query returned no results');
        return {
          hotels: 0,
          reservations: 0,
          factures: 0,
          totalRevenue: 0,
        };
      }

      const row = rows[0];

      return {
        hotels: Number(row.hotels) || 0,
        reservations: Number(row.reservations) || 0,
        factures: Number(row.factures) || 0,
        totalRevenue: Number(row.totalRevenue) || 0,
      };
    } catch (error) {
      logger.error('Error fetching dashboard stats', error);
      throw new Error('Failed to fetch dashboard statistics');
    }
  }
}
