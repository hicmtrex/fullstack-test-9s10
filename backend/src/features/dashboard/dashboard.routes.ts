import { Router } from 'express';
import { dashboardController } from './dashboard.controller';

/**
 * Dashboard routes
 * Defines all HTTP endpoints for dashboard operations
 */
const router = Router();

/**
 * @route   GET /api/dashboard/stats
 * @desc    Get dashboard statistics (hotels, reservations, factures, revenue)
 * @access  Public
 * @returns { hotels: number, reservations: number, factures: number, totalRevenue: number }
 */
router.get('/stats', dashboardController.getStats.bind(dashboardController));

export default router;
