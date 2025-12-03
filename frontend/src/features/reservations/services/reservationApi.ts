import { apiClient } from '@/shared/services/apiClient';
import { API_ENDPOINTS } from '@/shared/constants/api';
import {
  ReservationWithDetails,
  CreateReservationDto,
  UpdateReservationDto,
  ReservationQueryParams,
  ReservationsResponse,
} from '../types/reservation.types';

/**
 * API service for reservation-related operations
 */
export const reservationApi = {
  /**
   * Fetches all reservations with optional filtering and pagination
   * @param params - Query parameters
   * @returns Promise<ReservationsResponse>
   */
  getAllReservations: async (params?: ReservationQueryParams): Promise<ReservationsResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.hotelId) queryParams.append('hotelId', params.hotelId.toString());
    if (params?.checkInFrom) queryParams.append('checkInFrom', params.checkInFrom);
    if (params?.checkInTo) queryParams.append('checkInTo', params.checkInTo);

    const queryString = queryParams.toString();
    const url = queryString
      ? `${API_ENDPOINTS.RESERVATIONS}?${queryString}`
      : API_ENDPOINTS.RESERVATIONS;
    return apiClient.get<ReservationsResponse>(url);
  },

  /**
   * Fetches a single reservation by ID
   * @param id - Reservation ID
   * @returns Promise<ReservationWithDetails>
   */
  getReservationById: async (id: number): Promise<ReservationWithDetails> => {
    return apiClient.get<ReservationWithDetails>(API_ENDPOINTS.RESERVATION_BY_ID(id));
  },

  /**
   * Creates a new reservation
   * @param data - Reservation data
   * @returns Promise<ReservationWithDetails>
   */
  createReservation: async (data: CreateReservationDto): Promise<ReservationWithDetails> => {
    return apiClient.post<ReservationWithDetails>(API_ENDPOINTS.RESERVATIONS, data);
  },

  /**
   * Updates a reservation
   * @param id - Reservation ID
   * @param data - Update data
   * @returns Promise<ReservationWithDetails>
   */
  updateReservation: async (
    id: number,
    data: UpdateReservationDto
  ): Promise<ReservationWithDetails> => {
    return apiClient.put<ReservationWithDetails>(API_ENDPOINTS.RESERVATION_BY_ID(id), data);
  },

  /**
   * Deletes a reservation
   * @param id - Reservation ID
   * @returns Promise<void>
   */
  deleteReservation: async (id: number): Promise<void> => {
    return apiClient.delete(API_ENDPOINTS.RESERVATION_BY_ID(id));
  },
};
