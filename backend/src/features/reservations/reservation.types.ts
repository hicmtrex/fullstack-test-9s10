/**
 * Reservation-related TypeScript types and interfaces
 */

/**
 * Room configuration for a reservation
 */
export interface Room {
  id?: number;
  reservation_id?: number;
  nb_adults: number;
  nb_enfants: number;
  ages_enfants: number[];
  created_at?: Date;
}

/**
 * Reservation entity
 */
export interface Reservation {
  id: number;
  hotel_id: number;
  check_in: Date;
  check_out: Date;
  number_of_nights: number;
  total_price: number;
  status: ReservationStatus;
  created_at: Date;
  updated_at?: Date;
}

/**
 * Reservation with related data (hotel info, rooms)
 */
export interface ReservationWithDetails extends Reservation {
  hotel_name?: string;
  hotel_city?: string;
  hotel_country?: string;
  hotel_address?: string;
  hotel_price_per_night?: number;
  rooms?: Room[];
}

/**
 * Reservation status enum
 */
export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

/**
 * DTO for creating a reservation
 */
export interface CreateReservationDto {
  hotelId: number;
  checkIn: string; // ISO date string
  checkOut: string; // ISO date string
  rooms: CreateRoomDto[];
}

/**
 * DTO for creating a room
 */
export interface CreateRoomDto {
  nb_adults: number;
  nb_enfants: number;
  ages_enfants?: number[]; // Optional - should be provided if nb_enfants > 0
}

/**
 * DTO for updating a reservation
 */
export interface UpdateReservationDto {
  checkIn?: string;
  checkOut?: string;
  rooms?: CreateRoomDto[];
  status?: ReservationStatus;
}

/**
 * Query parameters for listing reservations
 */
export interface ReservationQueryParams {
  page?: number;
  limit?: number;
  status?: ReservationStatus;
  hotelId?: number;
  checkInFrom?: string;
  checkInTo?: string;
}
