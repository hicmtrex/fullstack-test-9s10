/**
 * API endpoint constants
 * Centralized location for all API endpoints
 */

export const API_BASE_URL = '/api';

export const API_ENDPOINTS = {
  // Hotels
  HOTELS: `${API_BASE_URL}/hotels`,
  HOTELS_SEARCH: `${API_BASE_URL}/hotels/search`,

  // Reservations
  RESERVATIONS: `${API_BASE_URL}/reservations`,
  RESERVATION_BY_ID: (id: number) => `${API_BASE_URL}/reservations/${id}`,
  RESERVATION_UPDATE: (id: number) => `${API_BASE_URL}/reservations/${id}`,
  RESERVATION_DELETE: (id: number) => `${API_BASE_URL}/reservations/${id}`,

  // Factures (Bills)
  FACTURES: `${API_BASE_URL}/factures`,
  FACTURE_BY_ID: (id: number) => `${API_BASE_URL}/factures/${id}`,
  FACTURE_PRINT: (id: number) => `${API_BASE_URL}/factures/${id}/print`,
  FACTURE_STATUS: (id: number) => `${API_BASE_URL}/factures/${id}/status`,

  // Dashboard
  DASHBOARD_STATS: `${API_BASE_URL}/dashboard/stats`,
} as const;
