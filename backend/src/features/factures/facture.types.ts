/**
 * Facture (Bill) related TypeScript types and interfaces
 */

/**
 * Facture status enum
 */
export type FactureStatus = 'pending' | 'paid' | 'cancelled';

/**
 * Facture entity
 */
export interface Facture {
  id: number;
  reservation_id: number;
  total_amount: number;
  status: FactureStatus;
  created_at: Date;
  updated_at?: Date;
}

/**
 * Facture with related reservation and hotel data
 */
export interface FactureWithDetails extends Facture {
  reservation?: {
    id: number;
    check_in: Date;
    check_out: Date;
    number_of_nights: number;
    total_price: number;
    status: string;
  };
  hotel?: {
    id: number;
    name: string;
    city: string;
    country: string;
    address: string;
  };
}

/**
 * DTO for creating a facture manually
 */
export interface CreateFactureDto {
  reservationId: number;
  totalAmount?: number; // Optional, will use reservation total if not provided
}

/**
 * DTO for updating facture status
 */
export interface UpdateFactureStatusDto {
  status: FactureStatus;
}

/**
 * Query parameters for listing factures
 */
export interface FactureQueryParams {
  page?: number;
  limit?: number;
  status?: FactureStatus;
  reservationId?: number;
}
