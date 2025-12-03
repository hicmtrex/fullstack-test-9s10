import { apiClient } from '@/shared/services/apiClient';
import { API_ENDPOINTS } from '@/shared/constants/api';
import type {
  Hotel,
  HotelSearchCriteria,
  HotelSearchResult,
  CreateHotelDto,
  UpdateHotelDto,
} from '../types/hotel.types';

/**
 * Hotel API service
 * Centralized API calls for hotel operations
 */
export const hotelApi = {
  /**
   * Get all hotels
   * @param limit - Optional limit for pagination
   * @param offset - Optional offset for pagination
   * @returns Promise<Hotel[]>
   */
  getAll: async (limit?: number, offset?: number): Promise<Hotel[]> => {
    const params = new URLSearchParams();
    if (limit !== undefined) params.append('limit', limit.toString());
    if (offset !== undefined) params.append('offset', offset.toString());

    const queryString = params.toString();
    const url = queryString ? `${API_ENDPOINTS.HOTELS}?${queryString}` : API_ENDPOINTS.HOTELS;
    return apiClient.get<Hotel[]>(url);
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
   * Search hotels
   * @param criteria - Search criteria
   * @returns Promise<HotelSearchResult[]>
   */
  search: async (criteria: HotelSearchCriteria): Promise<HotelSearchResult[]> => {
    return apiClient.post<HotelSearchResult[]>(API_ENDPOINTS.HOTELS_SEARCH, criteria);
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

