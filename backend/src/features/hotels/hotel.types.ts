/**
 * Hotel-related TypeScript types and interfaces
 */

/**
 * Hotel entity interface
 */
export interface Hotel {
  id: number;
  name: string;
  country: string;
  city: string;
  address: string | null;
  price_per_night: number;
  image_url: string | null;
  created_at: Date;
  updated_at: Date;
}

/**
 * Hotel search criteria
 */
export interface HotelSearchCriteria {
  country?: string;
  city?: string;
  hotelIds?: number[];
  checkIn?: string;
  checkOut?: string;
  numberOfNights?: number;
}

/**
 * Hotel search result with calculated total price
 */
export interface HotelSearchResult extends Hotel {
  totalPrice: number;
}

/**
 * Create hotel DTO
 */
export interface CreateHotelDto {
  name: string;
  country: string;
  city: string;
  address?: string;
  price_per_night: number;
  image_url?: string;
}

/**
 * Update hotel DTO
 */
export interface UpdateHotelDto {
  name?: string;
  country?: string;
  city?: string;
  address?: string;
  price_per_night?: number;
  image_url?: string;
}
