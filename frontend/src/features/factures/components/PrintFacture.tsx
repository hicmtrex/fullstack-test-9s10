import React from 'react';
import { FactureWithDetails } from '../types/facture.types';
import { formatCurrency } from '@/shared/utils/formatters';
import { formatDate } from '@/shared/utils/dateUtils';
import { Printer, X } from 'lucide-react';

/**
 * PrintFacture component props
 */
export interface PrintFactureProps {
  facture: FactureWithDetails;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * PrintFacture component
 * Displays a printable version of a facture with proper formatting
 * Can be printed using browser's print functionality
 */
export const PrintFacture: React.FC<PrintFactureProps> = ({ facture, isOpen, onClose }) => {
  if (!isOpen) return null;

  /**
   * Handle print action
   * Opens browser print dialog
   */
  const handlePrint = (): void => {
    window.print();
  };

  return (
    <>
      {/* Print styles - only visible when printing */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .printable-facture,
          .printable-facture * {
            visibility: visible;
          }
          .printable-facture {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Modal overlay */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 no-print">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full m-4 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b no-print">
            <h2 className="text-2xl font-bold text-gray-900">Facture #{facture.id}</h2>
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Printer className="h-4 w-4" />
                Print
              </button>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Printable content */}
          <div className="printable-facture p-8">
            {/* Company Header */}
            <div className="mb-8 text-center border-b pb-6">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Travel Agency</h1>
              <p className="text-gray-600">Hotel Reservation Invoice</p>
            </div>

            {/* Facture Details */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Bill To</h3>
                <div className="text-gray-900">
                  <p className="font-semibold">Reservation #{facture.reservation?.id}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {facture.hotel?.name || 'Hotel Name'}
                  </p>
                  <p className="text-sm text-gray-600">{facture.hotel?.address || ''}</p>
                  <p className="text-sm text-gray-600">
                    {facture.hotel?.city}, {facture.hotel?.country}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                  Invoice Details
                </h3>
                <div className="text-gray-900">
                  <p className="font-semibold">Invoice #: {facture.id}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Date: {formatDate(facture.created_at)}
                  </p>
                  <p className="text-sm text-gray-600">
                    Status:{' '}
                    <span
                      className={`font-semibold ${
                        facture.status === 'paid'
                          ? 'text-green-600'
                          : facture.status === 'cancelled'
                            ? 'text-red-600'
                            : 'text-yellow-600'
                      }`}
                    >
                      {facture.status.toUpperCase()}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Reservation Details */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Reservation Details</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Check-in</p>
                    <p className="font-semibold text-gray-900">
                      {facture.reservation?.check_in
                        ? formatDate(facture.reservation.check_in)
                        : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Check-out</p>
                    <p className="font-semibold text-gray-900">
                      {facture.reservation?.check_out
                        ? formatDate(facture.reservation.check_out)
                        : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Number of Nights</p>
                    <p className="font-semibold text-gray-900">
                      {facture.reservation?.number_of_nights || 0} nights
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Reservation Status</p>
                    <p className="font-semibold text-gray-900">
                      {facture.reservation?.status || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Items/Summary */}
            <div className="mb-8">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Description
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-right text-sm font-semibold text-gray-700">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-3 text-gray-900">
                      Hotel Reservation - {facture.hotel?.name || 'Hotel'}
                      <br />
                      <span className="text-sm text-gray-600">
                        {facture.reservation?.number_of_nights || 0} night
                        {facture.reservation?.number_of_nights !== 1 ? 's' : ''} stay
                      </span>
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-right font-semibold text-gray-900">
                      {formatCurrency(facture.total_amount, 'EUR', 'en-US')}
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3 text-right font-bold text-gray-900">
                      Total
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-right font-bold text-lg text-gray-900">
                      {formatCurrency(facture.total_amount, 'EUR', 'en-US')}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Footer */}
            <div className="mt-12 pt-6 border-t text-center text-sm text-gray-600">
              <p>Thank you for your business!</p>
              <p className="mt-2">This is an automatically generated invoice.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
