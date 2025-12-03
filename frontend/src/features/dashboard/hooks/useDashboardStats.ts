import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../services/dashboardApi';
import type { DashboardStats } from '../services/dashboardApi';

/**
 * Query keys for dashboard queries
 */
export const dashboardKeys = {
  all: ['dashboard'] as const,
  stats: () => [...dashboardKeys.all, 'stats'] as const,
};

/**
 * Custom hook to fetch dashboard statistics
 * @returns React Query hook result
 */
export const useDashboardStats = (): ReturnType<typeof useQuery<DashboardStats, Error>> => {
  return useQuery<DashboardStats, Error>({
    queryKey: dashboardKeys.stats(),
    queryFn: () => dashboardApi.getStats(),
    staleTime: 2 * 60 * 1000, // 2 minutes (stats change frequently)
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
};
