import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reservationApi } from '../services/reservationApi';
import type {
  ReservationWithDetails,
  ReservationsResponse,
  CreateReservationDto,
  UpdateReservationDto,
  ReservationQueryParams,
} from '../types/reservation.types';
import { ApiClientError } from '@/shared/services/apiClient';
import { useNotification } from '@/shared/providers/NotificationProvider';

/**
 * Query keys for reservation queries
 */
export const reservationKeys = {
  all: ['reservations'] as const,
  lists: () => [...reservationKeys.all, 'list'] as const,
  list: (params?: ReservationQueryParams) => [...reservationKeys.lists(), params] as const,
  details: () => [...reservationKeys.all, 'detail'] as const,
  detail: (id: number) => [...reservationKeys.details(), id] as const,
};

/**
 * Custom hook to fetch all reservations
 * @param params - Query parameters for filtering and pagination
 * @returns React Query hook result
 */
export const useReservations = (params?: ReservationQueryParams) => {
  return useQuery<ReservationsResponse, ApiClientError>({
    queryKey: reservationKeys.list(params),
    queryFn: () => reservationApi.getAllReservations(params),
    staleTime: 30 * 1000, // 30 seconds
  });
};

/**
 * Custom hook to fetch a single reservation
 * @param id - Reservation ID
 * @param enabled - Whether the query should be enabled
 * @returns React Query hook result
 */
export const useReservation = (id: number, enabled: boolean = true) => {
  return useQuery<ReservationWithDetails, ApiClientError>({
    queryKey: reservationKeys.detail(id),
    queryFn: () => reservationApi.getReservationById(id),
    enabled: enabled && !!id,
  });
};

/**
 * Custom hook to create a reservation
 * Includes toast notifications for success and error
 * @returns Mutation hook for creating reservations
 */
export const useCreateReservation = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useNotification();

  return useMutation<ReservationWithDetails, ApiClientError, CreateReservationDto>({
    mutationFn: data => reservationApi.createReservation(data),
    onSuccess: () => {
      // Invalidate and refetch reservations list
      queryClient.invalidateQueries({ queryKey: reservationKeys.lists() });
      showSuccess('Reservation created successfully! A bill has been automatically generated.');
    },
    onError: (error: ApiClientError) => {
      const errorMessage =
        (typeof error.data === 'object' &&
          error.data !== null &&
          'message' in error.data &&
          String((error.data as { message: string }).message)) ||
        (typeof error.data === 'object' &&
          error.data !== null &&
          'error' in error.data &&
          String((error.data as { error: string }).error)) ||
        error.message ||
        'Failed to create reservation. Please check your input and try again.';
      showError(errorMessage);
    },
  });
};

/**
 * Custom hook to update a reservation
 * Includes toast notifications for success and error
 * @returns Mutation hook for updating reservations
 */
export const useUpdateReservation = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useNotification();

  return useMutation<
    ReservationWithDetails,
    ApiClientError,
    { id: number; data: UpdateReservationDto }
  >({
    mutationFn: ({ id, data }) => reservationApi.updateReservation(id, data),
    onSuccess: data => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: reservationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: reservationKeys.detail(data.id) });
      showSuccess('Reservation updated successfully!');
    },
    onError: (error: ApiClientError) => {
      const errorMessage =
        (typeof error.data === 'object' &&
          error.data !== null &&
          'message' in error.data &&
          String((error.data as { message: string }).message)) ||
        (typeof error.data === 'object' &&
          error.data !== null &&
          'error' in error.data &&
          String((error.data as { error: string }).error)) ||
        error.message ||
        'Failed to update reservation. Please check your input and try again.';
      showError(errorMessage);
    },
  });
};

/**
 * Custom hook to delete a reservation
 * Includes toast notifications for success and error
 * @returns Mutation hook for deleting reservations
 */
export const useDeleteReservation = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useNotification();

  return useMutation<void, ApiClientError, number>({
    mutationFn: id => reservationApi.deleteReservation(id),
    onSuccess: () => {
      // Invalidate and refetch reservations list
      queryClient.invalidateQueries({ queryKey: reservationKeys.lists() });
      showSuccess('Reservation deleted successfully');
    },
    onError: (error: ApiClientError) => {
      const errorMessage =
        (typeof error.data === 'object' &&
          error.data !== null &&
          'message' in error.data &&
          String((error.data as { message: string }).message)) ||
        (typeof error.data === 'object' &&
          error.data !== null &&
          'error' in error.data &&
          String((error.data as { error: string }).error)) ||
        error.message ||
        'Failed to delete reservation. Please try again.';
      showError(errorMessage);
    },
  });
};
