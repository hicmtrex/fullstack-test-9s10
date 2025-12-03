import React from 'react';
import { FactureWithDetails } from '../types/facture.types';
import { formatCurrency } from '@/shared/utils/formatters';
import { formatDate } from '@/shared/utils/dateUtils';
import { Badge } from '@/shared/components/Badge';
import { Printer, Trash2, CheckCircle, XCircle } from 'lucide-react';

/**
 * FactureTable component props
 */
export interface FactureTableProps {
  factures: FactureWithDetails[];
  onPrint?: (id: number) => void;
  onDelete?: (id: number) => void;
  onMarkPaid?: (id: number) => void;
  onMarkCancelled?: (id: number) => void;
  isLoading?: boolean;
}

/**
 * StatusBadge component for facture status
 * Memoized to prevent unnecessary re-renders
 */
const StatusBadge: React.FC<{ status: string }> = React.memo(({ status }) => {
  const statusMap: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
    pending: 'warning',
    paid: 'success',
    cancelled: 'danger',
  };

  return (
    <Badge variant={statusMap[status] || 'default'} size="sm">
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
});

/**
 * FactureTable component
 * Displays factures in a beautiful, responsive table
 * Memoized to prevent unnecessary re-renders when props haven't changed
 */
export const FactureTable: React.FC<FactureTableProps> = React.memo(({
  factures,
  onPrint,
  onDelete,
  onMarkPaid,
  onMarkCancelled,
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

  if (factures.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <p className="text-gray-500 text-lg">No factures found</p>
        <p className="text-gray-400 text-sm mt-2">
          Factures will appear here when reservations are created
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-emerald-600 to-teal-600">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                Hotel
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                Check-in
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                Check-out
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-4 text-right text-xs font-bold text-white uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {factures.map((facture, index) => (
              <tr
                key={facture.id}
                className={`transition-all duration-200 ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                } hover:bg-emerald-50 hover:shadow-sm`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mr-3">
                      <span className="text-white font-bold text-sm">
                        {(facture.hotel?.name || 'H')[0].toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">
                        {facture.hotel?.name || 'Unknown Hotel'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {facture.hotel?.city}, {facture.hotel?.country}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {facture.reservation?.check_in
                      ? formatDate(facture.reservation.check_in)
                      : 'N/A'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {facture.reservation?.check_out
                      ? formatDate(facture.reservation.check_out)
                      : 'N/A'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-lg font-bold text-emerald-600">
                    {formatCurrency(facture.total_amount, 'EUR', 'en-US')}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={facture.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600">{formatDate(facture.created_at)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    {onPrint && (
                      <button
                        onClick={() => onPrint(facture.id)}
                        className="p-2 text-blue-600 hover:text-white hover:bg-blue-600 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                        title="Print facture"
                      >
                        <Printer className="h-4 w-4" />
                      </button>
                    )}
                    {onMarkPaid && facture.status === 'pending' && (
                      <button
                        onClick={() => onMarkPaid(facture.id)}
                        className="p-2 text-green-600 hover:text-white hover:bg-green-600 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                        title="Mark as paid"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </button>
                    )}
                    {onMarkCancelled && facture.status !== 'cancelled' && (
                      <button
                        onClick={() => onMarkCancelled(facture.id)}
                        className="p-2 text-orange-600 hover:text-white hover:bg-orange-600 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                        title="Mark as cancelled"
                      >
                        <XCircle className="h-4 w-4" />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(facture.id)}
                        className="p-2 text-red-600 hover:text-white hover:bg-red-600 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                        title="Delete facture"
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
