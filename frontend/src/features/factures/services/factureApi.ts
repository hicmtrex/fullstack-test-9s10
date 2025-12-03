import { apiClient } from '@/shared/services/apiClient';
import { API_ENDPOINTS } from '@/shared/constants/api';
import {
  FactureWithDetails,
  CreateFactureDto,
  UpdateFactureStatusDto,
  FactureQueryParams,
  FacturesResponse,
} from '../types/facture.types';

/**
 * API service for facture-related operations
 */
export const factureApi = {
  /**
   * Fetches all factures with optional filtering and pagination
   * @param params - Query parameters
   * @returns Promise<FacturesResponse>
   */
  getAllFactures: async (params?: FactureQueryParams): Promise<FacturesResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.reservationId) queryParams.append('reservationId', params.reservationId.toString());

    const queryString = queryParams.toString();
    const url = queryString ? `${API_ENDPOINTS.FACTURES}?${queryString}` : API_ENDPOINTS.FACTURES;
    return apiClient.get<FacturesResponse>(url);
  },

  /**
   * Fetches a single facture by ID
   * @param id - Facture ID
   * @returns Promise<FactureWithDetails>
   */
  getFactureById: async (id: number): Promise<FactureWithDetails> => {
    return apiClient.get<FactureWithDetails>(API_ENDPOINTS.FACTURE_BY_ID(id));
  },

  /**
   * Gets printable facture data
   * @param id - Facture ID
   * @returns Promise<FactureWithDetails>
   */
  getPrintableFacture: async (id: number): Promise<FactureWithDetails> => {
    return apiClient.get<FactureWithDetails>(API_ENDPOINTS.FACTURE_PRINT(id));
  },

  /**
   * Creates a facture manually
   * @param data - Facture data
   * @returns Promise<FactureWithDetails>
   */
  createFacture: async (data: CreateFactureDto): Promise<FactureWithDetails> => {
    return apiClient.post<FactureWithDetails>(API_ENDPOINTS.FACTURES, data);
  },

  /**
   * Updates facture status
   * @param id - Facture ID
   * @param data - Status update data
   * @returns Promise<FactureWithDetails>
   */
  updateFactureStatus: async (
    id: number,
    data: UpdateFactureStatusDto
  ): Promise<FactureWithDetails> => {
    return apiClient.put<FactureWithDetails>(API_ENDPOINTS.FACTURE_STATUS(id), data);
  },

  /**
   * Deletes a facture
   * @param id - Facture ID
   * @returns Promise<void>
   */
  deleteFacture: async (id: number): Promise<void> => {
    return apiClient.delete(API_ENDPOINTS.FACTURE_BY_ID(id));
  },
};
