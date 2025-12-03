import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateReservation } from './useReservations';
import { useNotification } from '@/shared/providers/NotificationProvider';
import { validateDateRange } from '@/shared/utils/dateUtils';
import type { Room } from '../components/RoomConfiguration';

/**
 * Custom hook for handling reservation creation
 * Extracts reservation logic from page components
 */
export const useReservationHandler = () => {
  const navigate = useNavigate();
  const { showError } = useNotification();
  const createReservation = useCreateReservation();

  /**
   * Handle reservation creation
   * Validates dates and rooms, then creates reservation
   */
  const handleReserve = useCallback(
    async (
      hotelId: number,
      checkIn: string,
      checkOut: string,
      rooms: Room[],
      onReservingChange: (hotelId: number | null) => void
    ): Promise<void> => {
      // Validate dates
      if (!checkIn || !checkOut) {
        showError('Please select check-in and check-out dates');
        return;
      }

      if (!validateDateRange(checkIn, checkOut)) {
        showError('Check-out date must be after check-in date');
        return;
      }

      // Validate rooms
      for (const room of rooms) {
        if (room.nb_adults < 1) {
          showError('Each room must have at least 1 adult');
          return;
        }
        if (room.nb_enfants > 0 && room.ages_enfants.length !== room.nb_enfants) {
          showError('Please specify ages for all children');
          return;
        }
      }

      onReservingChange(hotelId);
      try {
        await createReservation.mutateAsync({
          hotelId,
          checkIn,
          checkOut,
          rooms: rooms.map(room => {
            // Ensure ages_enfants is always an array: empty if no children, or the provided ages if children exist
            const ages_enfants =
              room.nb_enfants > 0 && room.ages_enfants.length === room.nb_enfants
                ? room.ages_enfants
                : [];

            return {
              nb_adults: room.nb_adults,
              nb_enfants: room.nb_enfants,
              ages_enfants,
            };
          }),
        });

        // Success notification is handled in the hook
        navigate('/reservations');
      } catch (error) {
        // Error notification is handled in the hook
      } finally {
        onReservingChange(null);
      }
    },
    [createReservation, showError, navigate]
  );

  return { handleReserve };
};

