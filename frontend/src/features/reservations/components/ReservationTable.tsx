import React from 'react';
import { ReservationWithDetails } from '../types/reservation.types';
import { formatCurrency } from '@/shared/utils/formatters';
import { formatDate } from '@/shared/utils/dateUtils';
import { Badge } from '@/shared/components/Badge';
import { Edit, Trash2, Eye } from 'lucide-react';

/**
 * ReservationTable component props
 */
export interface ReservationTableProps {
  reservations: ReservationWithDetails[];
  onEdit?: (reservation: ReservationWithDetails) => void;
  onDelete?: (id: number) => void;
  onView?: (id: number) => void;
  isLoading?: boolean;
}

/**
 * StatusBadge component for reservation status
 * Memoized to prevent unnecessary re-renders
 */
const StatusBadge: React.FC<{ status: string }> = React.memo(({ status }) => {
  const statusMap: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
    pending: 'warning',
    confirmed: 'success',
    cancelled: 'danger',
    completed: 'info',
  };

  return (
    <Badge variant={statusMap[status] || 'default'} size="sm">
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
});

/**
 * ReservationTable component
 * Displays reservations in a beautiful, responsive table
 * Memoized to prevent unnecessary re-renders when props haven't changed
 */
export const ReservationTable: React.FC<ReservationTableProps> = React.memo(({
  reservations,
  onEdit,
  onDelete,
  onView,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (reservations.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <p className="text-gray-500 text-lg">No reservations found</p>
        <p className="text-gray-400 text-sm mt-2">Create your first reservation to get started</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-blue-600 to-indigo-600">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                Hotel
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                Check-in
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                Check-out
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                Nights
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                Total Price
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-right text-xs font-bold text-white uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {reservations.map((reservation, index) => (
              <tr
                key={reservation.id}
                className={`transition-all duration-200 ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                } hover:bg-blue-50 hover:shadow-sm`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center mr-3">
                      <span className="text-white font-bold text-sm">
                        {(reservation.hotel_name || 'H')[0].toUpperCase()}
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-gray-900">
                      {reservation.hotel_name || 'Unknown Hotel'}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-600">
                    <svg
                      className="h-4 w-4 mr-1 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {reservation.hotel_city}, {reservation.hotel_country}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {formatDate(reservation.check_in)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {formatDate(reservation.check_out)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-indigo-100 text-indigo-800">
                    {reservation.number_of_nights}{' '}
                    {reservation.number_of_nights === 1 ? 'night' : 'nights'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-bold text-green-600">
                    {formatCurrency(reservation.total_price, 'EUR', 'en-US')}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={reservation.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    {onView && (
                      <button
                        onClick={() => onView(reservation.id)}
                        className="p-2 text-blue-600 hover:text-white hover:bg-blue-600 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                        title="View details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    )}
                    {onEdit && (
                      <button
                        onClick={() => onEdit(reservation)}
                        className="p-2 text-indigo-600 hover:text-white hover:bg-indigo-600 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                        title="Edit reservation"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(reservation.id)}
                        className="p-2 text-red-600 hover:text-white hover:bg-red-600 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                        title="Delete reservation"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});
