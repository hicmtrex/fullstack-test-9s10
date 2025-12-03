/**
 * Facture (Bill) related TypeScript types
 */

export type FactureStatus = 'pending' | 'paid' | 'cancelled';

export interface Facture {
  id: number;
  reservation_id: number;
  total_amount: number;
  status: FactureStatus;
  created_at: string;
  updated_at?: string;
}

export interface FactureWithDetails extends Facture {
  reservation?: {
    id: number;
    check_in: string;
    check_out: string;
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

export interface CreateFactureDto {
  reservationId: number;
  totalAmount?: number;
}

export interface UpdateFactureStatusDto {
  status: FactureStatus;
}

export interface FactureQueryParams {
  page?: number;
  limit?: number;
  status?: FactureStatus;
  reservationId?: number;
}

export interface FacturesResponse {
  data: FactureWithDetails[];
  total: number;
  page: number;
  limit: number;
}
