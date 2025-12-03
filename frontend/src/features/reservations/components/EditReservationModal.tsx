import React, { useState, useEffect, useCallback } from 'react';
import { Modal } from '@/shared/components/Modal';
import {
  ReservationWithDetails,
  UpdateReservationDto,
  CreateRoomDto,
} from '../types/reservation.types';
import { formatDateInput, validateDateRange, getTodayDate } from '@/shared/utils/dateUtils';
import { Button } from '@/shared/components/Button';
import { Input } from '@/shared/components/Input';
import { useNotification } from '@/shared/providers/NotificationProvider';
import { Plus, Trash2 } from 'lucide-react';

/**
 * EditReservationModal component props
 */
export interface EditReservationModalProps {
  reservation: ReservationWithDetails;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: number, data: UpdateReservationDto) => Promise<void>;
}

/**
 * EditReservationModal component
 * Allows editing reservation dates, room configurations, and status
 */
export const EditReservationModal: React.FC<EditReservationModalProps> = ({
  reservation,
  isOpen,
  onClose,
  onSave,
}) => {
  const [checkIn, setCheckIn] = useState<string>('');
  const [checkOut, setCheckOut] = useState<string>('');
  const [status, setStatus] = useState<ReservationWithDetails['status']>('pending');
  const [rooms, setRooms] = useState<CreateRoomDto[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const { showSuccess, showError } = useNotification();

  /**
   * Initialize form with reservation data
   */
  useEffect(() => {
    if (reservation && isOpen) {
      setCheckIn(formatDateInput(new Date(reservation.check_in)));
      setCheckOut(formatDateInput(new Date(reservation.check_out)));
      setStatus(reservation.status);
      setRooms(
        reservation.rooms?.map(room => ({
          nb_adults: room.nb_adults,
          nb_enfants: room.nb_enfants,
          ages_enfants: room.ages_enfants || [],
        })) || []
      );
      setErrors({});
    }
  }, [reservation, isOpen]);

  /**
   * Validate form data
   */
  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    if (!checkIn) {
      newErrors.checkIn = 'Check-in date is required';
    }

    if (!checkOut) {
      newErrors.checkOut = 'Check-out date is required';
    }

    if (checkIn && checkOut) {
      const isValid = validateDateRange(checkIn, checkOut);
      if (!isValid) {
        newErrors.checkOut = 'Check-out date must be after check-in date';
      }
    }

    if (rooms.length === 0) {
      newErrors.rooms = 'At least one room is required';
    }

    rooms.forEach((room, index) => {
      if (room.nb_adults < 1) {
        newErrors[`room_${index}_adults`] = 'Each room must have at least 1 adult';
      }
      if (room.nb_enfants < 0) {
        newErrors[`room_${index}_enfants`] = 'Number of children cannot be negative';
      }
      if (
        room.nb_enfants > 0 &&
        (!room.ages_enfants || room.ages_enfants.length !== room.nb_enfants)
      ) {
        newErrors[`room_${index}_ages`] = 'Number of children ages must match number of children';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [checkIn, checkOut, rooms]);

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) {
        showError('Please fix the errors in the form');
        return;
      }

      setIsSaving(true);
      try {
        const updateData: UpdateReservationDto = {
          checkIn,
          checkOut,
          status,
          rooms: rooms.map(room => ({
            nb_adults: room.nb_adults,
            nb_enfants: room.nb_enfants,
            ages_enfants: room.nb_enfants > 0 ? room.ages_enfants || [] : [],
          })),
        };

        await onSave(reservation.id, updateData);
        showSuccess('Reservation updated successfully');
        onClose();
      } catch (error) {
        showError('Failed to update reservation. Please try again.');
      } finally {
        setIsSaving(false);
      }
    },
    [
      checkIn,
      checkOut,
      status,
      rooms,
      reservation.id,
      validateForm,
      onSave,
      onClose,
      showSuccess,
      showError,
    ]
  );

  /**
   * Add a new room
   */
  const addRoom = useCallback(() => {
    setRooms(prev => [...prev, { nb_adults: 1, nb_enfants: 0, ages_enfants: [] }]);
  }, []);

  /**
   * Remove a room
   */
  const removeRoom = useCallback((index: number) => {
    setRooms(prev => prev.filter((_, i) => i !== index));
  }, []);

  /**
   * Update room configuration
   */
  const updateRoom = useCallback(
    (index: number, field: keyof CreateRoomDto, value: number | number[]) => {
      setRooms(prev =>
        prev.map((room, i) => {
          if (i === index) {
            if (field === 'ages_enfants') {
              return { ...room, ages_enfants: value as number[] };
            }
            const updated = { ...room, [field]: value };
            // Reset ages_enfants if number of children changes
            if (field === 'nb_enfants') {
              updated.ages_enfants = Array(value as number).fill(0);
            }
            return updated;
          }
          return room;
        })
      );
    },
    []
  );

  /**
   * Update child age
   */
  const updateChildAge = useCallback((roomIndex: number, ageIndex: number, age: number) => {
    setRooms(prev =>
      prev.map((room, i) => {
        if (i === roomIndex) {
          const newAges = [...(room.ages_enfants || [])];
          newAges[ageIndex] = age;
          return { ...room, ages_enfants: newAges };
        }
        return room;
      })
    );
  }, []);

  if (!reservation) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit Reservation #${reservation.id}`}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Dates Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="checkIn" className="block text-sm font-medium text-gray-700 mb-2">
              Check-in Date *
            </label>
            <Input
              id="checkIn"
              type="date"
              value={checkIn}
              onChange={e => {
                setCheckIn(e.target.value);
                setErrors(prev => ({ ...prev, checkIn: '' }));
              }}
              min={getTodayDate()}
              error={errors.checkIn}
            />
          </div>
          <div>
            <label htmlFor="checkOut" className="block text-sm font-medium text-gray-700 mb-2">
              Check-out Date *
            </label>
            <Input
              id="checkOut"
              type="date"
              value={checkOut}
              onChange={e => {
                setCheckOut(e.target.value);
                setErrors(prev => ({ ...prev, checkOut: '' }));
              }}
              min={checkIn || getTodayDate()}
              error={errors.checkOut}
            />
          </div>
        </div>

        {/* Status Section */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={e => setStatus(e.target.value as ReservationWithDetails['status'])}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Rooms Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-gray-700">Rooms *</label>
            <Button
              type="button"
              onClick={addRoom}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" /> Add Room
            </Button>
          </div>
          {errors.rooms && <p className="text-red-600 text-sm mb-2">{errors.rooms}</p>}

          <div className="space-y-4">
            {rooms.map((room, roomIndex) => (
              <div key={roomIndex} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-800">Room {roomIndex + 1}</h4>
                  {rooms.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRoom(roomIndex)}
                      className="p-1 text-red-600 hover:text-red-800 rounded"
                      title="Remove room"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Adults *</label>
                    <Input
                      type="number"
                      min="1"
                      value={room.nb_adults}
                      onChange={e =>
                        updateRoom(roomIndex, 'nb_adults', parseInt(e.target.value, 10) || 1)
                      }
                      error={errors[`room_${roomIndex}_adults`]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Children</label>
                    <Input
                      type="number"
                      min="0"
                      value={room.nb_enfants}
                      onChange={e => {
                        const nbEnfants = parseInt(e.target.value, 10) || 0;
                        updateRoom(roomIndex, 'nb_enfants', nbEnfants);
                        setErrors(prev => ({
                          ...prev,
                          [`room_${roomIndex}_enfants`]: '',
                          [`room_${roomIndex}_ages`]: '',
                        }));
                      }}
                      error={errors[`room_${roomIndex}_enfants`]}
                    />
                  </div>
                </div>

                {room.nb_enfants > 0 && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Children Ages (0-17) *
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {Array.from({ length: room.nb_enfants }, (_, ageIndex) => (
                        <Input
                          key={ageIndex}
                          type="number"
                          min="0"
                          max="17"
                          placeholder={`Age ${ageIndex + 1}`}
                          value={room.ages_enfants?.[ageIndex] || 0}
                          onChange={e =>
                            updateChildAge(roomIndex, ageIndex, parseInt(e.target.value, 10) || 0)
                          }
                        />
                      ))}
                    </div>
                    {errors[`room_${roomIndex}_ages`] && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors[`room_${roomIndex}_ages`]}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving} isLoading={isSaving}>
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
};
