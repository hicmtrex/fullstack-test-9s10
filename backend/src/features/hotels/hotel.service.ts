import { HotelRepository } from './hotel.repository';
import {
  Hotel,
  HotelSearchCriteria,
  HotelSearchResult,
  CreateHotelDto,
  UpdateHotelDto,
  PaginatedResponse,
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
   * Get all hotels with pagination
   * @param limit - Optional limit for pagination (default: 12)
   * @param offset - Optional offset for pagination
   * @returns Promise<PaginatedResponse<Hotel>> - Paginated hotels response
   */
  async getAllHotels(limit = 12, offset = 0): Promise<PaginatedResponse<Hotel>> {
    const [hotels, total] = await Promise.all([
      this.repository.findAll(limit, offset),
      this.repository.countAll(),
    ]);

    return {
      data: hotels,
      total,
      limit,
      offset,
      hasMore: offset + hotels.length < total,
    };
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
   * Search hotels with calculated total prices and pagination
   * @param criteria - Search criteria
   * @returns Promise<PaginatedResponse<HotelSearchResult>> - Paginated search results
   */
  async searchHotels(criteria: HotelSearchCriteria): Promise<PaginatedResponse<HotelSearchResult>> {
    const limit = criteria.limit || 12;
    const offset = criteria.offset || 0;
    const numberOfNights = criteria.numberOfNights || 1;

    // Get hotels matching search criteria
    const hotels = await this.repository.search(criteria);

    // Apply pagination
    const paginatedHotels = hotels.slice(offset, offset + limit);

    // Calculate total price for each hotel
    const results: HotelSearchResult[] = paginatedHotels.map(hotel => ({
      ...hotel,
      totalPrice: hotel.price_per_night * numberOfNights,
    }));

    return {
      data: results,
      total: hotels.length,
      limit,
      offset,
      hasMore: offset + results.length < hotels.length,
    };
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
