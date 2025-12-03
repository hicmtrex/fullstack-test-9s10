import { useState } from 'react';
import {
  useFactures,
  useDeleteFacture,
  useUpdateFactureStatus,
} from '@/features/factures/hooks/useFactures';
import { FactureTable, PrintFacture } from '@/features/factures/components';
import { useFacture } from '@/features/factures/hooks/useFactures';
import { useNotification } from '@/shared/providers/NotificationProvider';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog/ConfirmDialog';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/shared/components/Button';

/**
 * Factures page component
 * Displays all factures (bills) with filtering, pagination, and management operations
 */
function Factures() {
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [printId, setPrintId] = useState<number | null>(null);
  const { data, isLoading, error, refetch } = useFactures({ page, limit: 10 });
  const { data: printFacture } = useFacture(printId || 0, !!printId);
  const deleteMutation = useDeleteFacture();
  const updateStatusMutation = useUpdateFactureStatus();
  const { showSuccess, showError } = useNotification();

  const handleDelete = async (id: number) => {
    try {
      await deleteMutation.mutateAsync(id);
      showSuccess('Facture deleted successfully');
      setDeleteId(null);
    } catch (err) {
      showError('Failed to delete facture');
    }
  };

  const handleMarkPaid = async (id: number) => {
    try {
      await updateStatusMutation.mutateAsync({ id, data: { status: 'paid' } });
      showSuccess('Facture marked as paid');
    } catch (err) {
      showError('Failed to update facture status');
    }
  };

  const handleMarkCancelled = async (id: number) => {
    try {
      await updateStatusMutation.mutateAsync({ id, data: { status: 'cancelled' } });
      showSuccess('Facture marked as cancelled');
    } catch (err) {
      showError('Failed to update facture status');
    }
  };

  const handlePrint = (id: number) => {
    setPrintId(id);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-800 font-medium">Failed to load factures</p>
            <p className="text-red-600 text-sm mt-2">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Factures</h1>
            <p className="text-gray-600 text-sm sm:text-base">Manage all invoices and bills</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => refetch()}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Summary */}
        {data && (
          <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-6 shadow-lg text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm font-medium">Total Factures</p>
                  <p className="text-3xl font-bold mt-2">{data.total}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-6 shadow-lg text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-100 text-sm font-medium">Current Page</p>
                  <p className="text-3xl font-bold mt-2">
                    {data.page} / {Math.ceil(data.total / data.limit)}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl p-6 shadow-lg text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-cyan-100 text-sm font-medium">Showing</p>
                  <p className="text-3xl font-bold mt-2">{data.data.length}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 10h16M4 14h16M4 18h16"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Factures Table */}
        <FactureTable
          factures={data?.data || []}
          onPrint={handlePrint}
          onDelete={id => setDeleteId(id)}
          onMarkPaid={handleMarkPaid}
          onMarkCancelled={handleMarkCancelled}
          isLoading={isLoading}
        />

        {/* Pagination */}
        {data && data.total > data.limit && (
          <div className="mt-6 flex items-center justify-between">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1 || isLoading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm text-gray-700">
              Page {data.page} of {Math.ceil(data.total / data.limit)}
            </span>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={page >= Math.ceil(data.total / data.limit) || isLoading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          isOpen={deleteId !== null}
          onClose={() => setDeleteId(null)}
          onConfirm={() => deleteId && handleDelete(deleteId)}
          title="Delete Facture"
          message="Are you sure you want to delete this facture? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          variant="danger"
          isLoading={deleteMutation.isPending}
        />

        {/* Print Facture Modal */}
        {printFacture && (
          <PrintFacture
            facture={printFacture}
            isOpen={printId !== null}
            onClose={() => setPrintId(null)}
          />
        )}
      </div>
    </div>
  );
}

export default Factures;
