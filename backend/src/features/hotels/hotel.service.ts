import { HotelRepository } from './hotel.repository';
import {
  Hotel,
  HotelSearchCriteria,
  HotelSearchResult,
  CreateHotelDto,
  UpdateHotelDto,
} from './hotel.types';

/**
 * Hotel Service
 * Contains business logic for hotel operations
 * Acts as a layer between controller and repository
 */
export class HotelService {
  private repository: HotelRepository;

  constructor(repository: HotelRepository) {
    this.repository = repository;
  }

  /**
   * Get all hotels
   * @param limit - Optional limit for pagination
   * @param offset - Optional offset for pagination
   * @returns Promise<Hotel[]> - Array of hotels
   */
  async getAllHotels(limit?: number, offset?: number): Promise<Hotel[]> {
    return this.repository.findAll(limit, offset);
  }

  /**
   * Get hotel by ID
   * @param id - Hotel ID
   * @returns Promise<Hotel | null> - Hotel or null if not found
   */
  async getHotelById(id: number): Promise<Hotel | null> {
    return this.repository.findById(id);
  }

  /**
   * Search hotels with calculated total prices
   * @param criteria - Search criteria
   * @returns Promise<HotelSearchResult[]> - Array of hotels with total prices
   */
  async searchHotels(criteria: HotelSearchCriteria): Promise<HotelSearchResult[]> {
    const hotels = await this.repository.search(criteria);
    const numberOfNights = criteria.numberOfNights || 1;

    // Calculate total price for each hotel
    return hotels.map(hotel => ({
      ...hotel,
      totalPrice: hotel.price_per_night * numberOfNights,
    }));
  }

  /**
   * Create a new hotel
   * @param hotelData - Hotel data to create
   * @returns Promise<Hotel> - Created hotel
   */
  async createHotel(hotelData: CreateHotelDto): Promise<Hotel> {
    // Business logic validation can be added here
    return this.repository.create({
      name: hotelData.name,
      country: hotelData.country,
      city: hotelData.city,
      address: hotelData.address || null,
      price_per_night: hotelData.price_per_night,
      image_url: hotelData.image_url ?? null,
    });
  }

  /**
   * Update a hotel
   * @param id - Hotel ID
   * @param hotelData - Hotel data to update
   * @returns Promise<Hotel | null> - Updated hotel or null if not found
   */
  async updateHotel(id: number, hotelData: UpdateHotelDto): Promise<Hotel | null> {
    return this.repository.update(id, hotelData);
  }

  /**
   * Delete a hotel
   * @param id - Hotel ID
   * @returns Promise<boolean> - True if deleted, false if not found
   */
  async deleteHotel(id: number): Promise<boolean> {
    return this.repository.delete(id);
  }
}
