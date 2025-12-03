import { Request, Response, NextFunction } from 'express';
import { DashboardService } from './dashboard.service';
import { logger } from '../../shared/config/logger';

/**
 * Dashboard Controller
 * Handles HTTP requests and responses for dashboard endpoints
 * Delegates business logic to DashboardService
 */

// Initialize service
const dashboardService = new DashboardService();

export class DashboardController {
  /**
   * Get dashboard statistics
   * GET /api/dashboard/stats
   * Returns optimized statistics in a single response
   */
  async getStats(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await dashboardService.getStats();
      res.json(stats);
    } catch (error) {
      logger.error('Error fetching dashboard stats', error);
      next(error);
    }
  }
}

// Export an instance of the controller
export const dashboardController = new DashboardController();
