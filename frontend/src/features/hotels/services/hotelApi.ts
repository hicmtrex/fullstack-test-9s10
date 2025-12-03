import { apiClient } from '@/shared/services/apiClient';
import { API_ENDPOINTS } from '@/shared/constants/api';
import type {
  Hotel,
  HotelSearchCriteria,
  HotelSearchResult,
  CreateHotelDto,
  UpdateHotelDto,
  PaginatedResponse,
} from '../types/hotel.types';

/**
 * Hotel API service
 * Centralized API calls for hotel operations
 */
export const hotelApi = {
  /**
   * Get all hotels with pagination
   * @param limit - Limit for pagination (default: 12)
   * @param offset - Offset for pagination (default: 0)
   * @returns Promise<PaginatedResponse<Hotel>>
   */
  getAll: async (limit = 12, offset = 0): Promise<PaginatedResponse<Hotel>> => {
    const params = new URLSearchParams();
    params.append('limit', limit.toString());
    params.append('offset', offset.toString());

    const url = `${API_ENDPOINTS.HOTELS}?${params.toString()}`;
    return apiClient.get<PaginatedResponse<Hotel>>(url);
  },

  /**
   * Get hotel by ID
   * @param id - Hotel ID
   * @returns Promise<Hotel>
   */
  getById: async (id: number): Promise<Hotel> => {
    return apiClient.get<Hotel>(`${API_ENDPOINTS.HOTELS}/${id}`);
  },

  /**
   * Search hotels with pagination (using GET for better caching)
   * @param criteria - Search criteria
   * @returns Promise<PaginatedResponse<HotelSearchResult>>
   */
  search: async (criteria: HotelSearchCriteria): Promise<PaginatedResponse<HotelSearchResult>> => {
    const params = new URLSearchParams();
    if (criteria.country) params.append('country', criteria.country);
    if (criteria.city) params.append('city', criteria.city);
    if (criteria.checkIn) params.append('checkIn', criteria.checkIn);
    if (criteria.checkOut) params.append('checkOut', criteria.checkOut);
    if (criteria.numberOfNights)
      params.append('numberOfNights', criteria.numberOfNights.toString());
    if (criteria.limit) params.append('limit', criteria.limit.toString());
    if (criteria.offset) params.append('offset', criteria.offset.toString());

    const queryString = params.toString();
    const url = queryString
      ? `${API_ENDPOINTS.HOTELS_SEARCH}?${queryString}`
      : API_ENDPOINTS.HOTELS_SEARCH;
    return apiClient.get<PaginatedResponse<HotelSearchResult>>(url);
  },

  /**
   * Create a new hotel
   * @param data - Hotel data
   * @returns Promise<Hotel>
   */
  create: async (data: CreateHotelDto): Promise<Hotel> => {
    return apiClient.post<Hotel>(API_ENDPOINTS.HOTELS, data);
  },

  /**
   * Update a hotel
   * @param id - Hotel ID
   * @param data - Hotel data to update
   * @returns Promise<Hotel>
   */
  update: async (id: number, data: UpdateHotelDto): Promise<Hotel> => {
    return apiClient.put<Hotel>(`${API_ENDPOINTS.HOTELS}/${id}`, data);
  },

  /**
   * Delete a hotel
   * @param id - Hotel ID
   * @returns Promise<void>
   */
  delete: async (id: number): Promise<void> => {
    return apiClient.delete<void>(`${API_ENDPOINTS.HOTELS}/${id}`);
  },
};
