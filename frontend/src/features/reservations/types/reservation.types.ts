/**
 * Reservation-related TypeScript types
 */

export interface Room {
  id?: number;
  reservation_id?: number;
  nb_adults: number;
  nb_enfants: number;
  ages_enfants: number[];
  created_at?: string;
}

export interface Reservation {
  id: number;
  hotel_id: number;
  check_in: string;
  check_out: string;
  number_of_nights: number;
  total_price: number;
  status: ReservationStatus;
  created_at: string;
  updated_at?: string;
}

export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface ReservationWithDetails extends Reservation {
  hotel_name?: string;
  hotel_city?: string;
  hotel_country?: string;
  hotel_address?: string;
  hotel_price_per_night?: number;
  rooms?: Room[];
}

export interface CreateReservationDto {
  hotelId: number;
  checkIn: string;
  checkOut: string;
  rooms: CreateRoomDto[];
}

export interface CreateRoomDto {
  nb_adults: number;
  nb_enfants: number;
  ages_enfants?: number[]; // Optional - should be provided if nb_enfants > 0
}

export interface UpdateReservationDto {
  checkIn?: string;
  checkOut?: string;
  rooms?: CreateRoomDto[];
  status?: ReservationStatus;
}

export interface ReservationQueryParams {
  page?: number;
  limit?: number;
  status?: ReservationStatus;
  hotelId?: number;
  checkInFrom?: string;
  checkInTo?: string;
}

export interface ReservationsResponse {
  data: ReservationWithDetails[];
  total: number;
  page: number;
  limit: number;
}
