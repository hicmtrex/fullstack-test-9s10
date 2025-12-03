import { useEffect } from 'react';
import { useDashboardStats } from '@/features/dashboard/hooks/useDashboardStats';
import { StatsCard, StatsCardSkeleton } from '@/features/dashboard/components';
import { Building2, Calendar, FileText, Euro } from 'lucide-react';
import { useNotification } from '@/shared/providers/NotificationProvider';

/**
 * Dashboard page component
 * Displays key statistics and metrics for the travel agency
 */
function Dashboard() {
  const { data: stats, isLoading, error } = useDashboardStats();
  const { showError } = useNotification();

  useEffect(() => {
    if (error) {
      showError('Failed to load dashboard statistics. Please try again later.');
    }
  }, [error, showError]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Overview of your travel agency operations
          </p>
        </div>

        {/* Stats Grid - Responsive */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <StatsCardSkeleton key={index} />
            ))}
          </div>
        ) : stats ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            <StatsCard
              title="Total Hotels"
              value={stats.hotels}
              description="Available properties"
              icon={Building2}
              className="hover:shadow-lg transition-shadow duration-200"
            />
            <StatsCard
              title="Reservations"
              value={stats.reservations}
              description="Total bookings"
              icon={Calendar}
              className="hover:shadow-lg transition-shadow duration-200"
            />
            <StatsCard
              title="Invoices"
              value={stats.factures}
              description="Total factures"
              icon={FileText}
              className="hover:shadow-lg transition-shadow duration-200"
            />
            <StatsCard
              title="Total Revenue"
              value={stats.totalRevenue || 0}
              description="All-time earnings"
              icon={Euro}
              className="hover:shadow-lg transition-shadow duration-200 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200"
            />
          </div>
        ) : null}

        {/* Error State */}
        {error && !isLoading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-800 font-medium">
              Unable to load dashboard data. Please refresh the page.
            </p>
          </div>
        )}

        {/* Additional Content Placeholder */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <p className="text-gray-600 text-sm">
              Recent reservations and updates will appear here.
            </p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <p className="text-gray-600 text-sm">Quick access to common tasks will appear here.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
