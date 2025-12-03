import React from 'react';
import { ReservationWithDetails } from '../types/reservation.types';
import { formatCurrency } from '@/shared/utils/formatters';
import { formatDate } from '@/shared/utils/dateUtils';
import { Badge } from '@/shared/components/Badge';
import { Modal } from '@/shared/components/Modal';
import { Calendar, MapPin, Users, Receipt, Loader2 } from 'lucide-react';
import { useFactures, useCreateFacture } from '@/features/factures/hooks/useFactures';
import { useNotification } from '@/shared/providers/NotificationProvider';
import { Button } from '@/shared/components/Button';

/**
 * ReservationDetailsModal component props
 */
export interface ReservationDetailsModalProps {
  reservation: ReservationWithDetails | null;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * StatusBadge component for reservation status
 */
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const statusMap: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
    pending: 'warning',
    confirmed: 'success',
    cancelled: 'danger',
    completed: 'info',
  };

  return (
    <Badge variant={statusMap[status] || 'default'} size="md">
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

/**
 * ReservationDetailsModal component
 * Displays detailed information about a reservation in a modal
 */
export const ReservationDetailsModal: React.FC<ReservationDetailsModalProps> = ({
  reservation,
  isOpen,
  onClose,
}) => {
  // Check if a bill exists for this reservation
  const { data: facturesData, refetch: refetchFactures } = useFactures({
    reservationId: reservation?.id,
    limit: 1,
  });
  const createFactureMutation = useCreateFacture();
  const { showSuccess, showError } = useNotification();

  const existingFacture = facturesData?.data?.[0];
  const hasBill = !!existingFacture;

  /**
   * Handle manual bill generation
   */
  const handleCreateBill = async () => {
    if (!reservation) return;

    try {
      await createFactureMutation.mutateAsync({
        reservationId: reservation.id,
        totalAmount: reservation.total_price,
      });
      showSuccess('Bill created successfully!');
      refetchFactures();
    } catch (error) {
      showError('Failed to create bill. It may already exist for this reservation.');
    }
  };

  if (!reservation) return null;

  const totalGuests =
    reservation.rooms?.reduce((sum, room) => sum + room.nb_adults + room.nb_enfants, 0) || 0;
  const totalChildren = reservation.rooms?.reduce((sum, room) => sum + room.nb_enfants, 0) || 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Reservation #${reservation.id}`} size="lg">
      <div className="space-y-6">
        {/* Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Status</span>
          <StatusBadge status={reservation.status} />
        </div>

        {/* Hotel Information */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            Hotel Information
          </h3>
          <div className="space-y-2">
            <p className="font-semibold text-gray-900">
              {reservation.hotel_name || 'Unknown Hotel'}
            </p>
            <p className="text-sm text-gray-600">
              {reservation.hotel_city}, {reservation.hotel_country}
            </p>
            {reservation.hotel_address && (
              <p className="text-sm text-gray-600">{reservation.hotel_address}</p>
            )}
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">Check-in</span>
            </div>
            <p className="text-lg font-semibold text-gray-900">
              {formatDate(reservation.check_in)}
            </p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-gray-700">Check-out</span>
            </div>
            <p className="text-lg font-semibold text-gray-900">
              {formatDate(reservation.check_out)}
            </p>
          </div>
        </div>

        {/* Stay Details */}
        <div className="bg-indigo-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Number of Nights</p>
              <p className="text-xl font-bold text-gray-900">{reservation.number_of_nights}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Total Price</p>
              <p className="text-xl font-bold text-indigo-600">
                {formatCurrency(reservation.total_price, 'EUR', 'en-US')}
              </p>
            </div>
          </div>
        </div>

        {/* Rooms Configuration */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Users className="h-5 w-5 text-purple-600" />
            Rooms Configuration ({reservation.rooms?.length || 0} room
            {reservation.rooms?.length !== 1 ? 's' : ''})
          </h3>
          <div className="space-y-3">
            {reservation.rooms?.map((room, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-900">Room {index + 1}</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Adults: </span>
                    <span className="font-semibold text-gray-900">{room.nb_adults}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Children: </span>
                    <span className="font-semibold text-gray-900">{room.nb_enfants}</span>
                  </div>
                  {room.ages_enfants && room.ages_enfants.length > 0 && (
                    <div className="col-span-2">
                      <span className="text-gray-600">Children Ages: </span>
                      <span className="font-semibold text-gray-900">
                        {room.ages_enfants.join(', ')} years
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Guests</p>
              <p className="text-lg font-bold text-gray-900">{totalGuests}</p>
            </div>
            {totalChildren > 0 && (
              <div>
                <p className="text-sm text-gray-600">Children</p>
                <p className="text-lg font-bold text-gray-900">{totalChildren}</p>
              </div>
            )}
            <div className="text-right">
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="text-lg font-bold text-indigo-600">
                {formatCurrency(reservation.total_price, 'EUR', 'en-US')}
              </p>
            </div>
          </div>
        </div>

        {/* Bill Management */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Receipt className="h-5 w-5 text-yellow-600" />
              <div>
                <h4 className="font-semibold text-gray-900">Bill Status</h4>
                {hasBill ? (
                  <p className="text-sm text-gray-600">
                    Bill #{existingFacture.id} exists ({existingFacture.status})
                  </p>
                ) : (
                  <p className="text-sm text-gray-600">No bill generated for this reservation</p>
                )}
              </div>
            </div>
            {!hasBill && (
              <Button
                onClick={handleCreateBill}
                disabled={createFactureMutation.isPending}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                {createFactureMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Receipt className="h-4 w-4" />
                    Generate Bill
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Timestamps */}
        <div className="text-xs text-gray-500 border-t pt-4">
          <p>Created: {formatDate(reservation.created_at)}</p>
          {reservation.updated_at && <p>Last Updated: {formatDate(reservation.updated_at)}</p>}
        </div>
      </div>
    </Modal>
  );
};
