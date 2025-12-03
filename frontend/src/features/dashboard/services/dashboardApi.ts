import { apiClient } from '@/shared/services/apiClient';
import { API_ENDPOINTS } from '@/shared/constants/api';

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
 * Dashboard API service
 */
export const dashboardApi = {
  /**
   * Get dashboard statistics
   * @returns Promise<DashboardStats>
   */
  getStats: async (): Promise<DashboardStats> => {
    return apiClient.get<DashboardStats>(API_ENDPOINTS.DASHBOARD_STATS);
  },
};
