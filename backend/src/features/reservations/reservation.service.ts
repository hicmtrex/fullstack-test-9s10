import { getConnectionPool } from '../../database/connection';
import { ReservationRepository } from './reservation.repository';
import { HotelRepository } from '../hotels/hotel.repository';
import { FactureService } from '../factures/facture.service';
import {
  ReservationWithDetails,
  CreateReservationDto,
  UpdateReservationDto,
  ReservationQueryParams,
} from './reservation.types';
import { logger } from '../../shared/config/logger';

/**
 * Reservation Service
 * Handles business logic for reservations
 * Orchestrates repository calls and implements business rules
 */
export class ReservationService {
  private reservationRepository: ReservationRepository;
  private hotelRepository: HotelRepository;
  private factureService: FactureService;

  constructor(
    reservationRepository: ReservationRepository,
    hotelRepository: HotelRepository,
    factureService: FactureService
  ) {
    this.reservationRepository = reservationRepository;
    this.hotelRepository = hotelRepository;
    this.factureService = factureService;
  }

  /**
   * Calculate number of nights between two dates
   * @param checkIn - Check-in date
   * @param checkOut - Check-out date
   * @returns Number of nights
   */
  private calculateNumberOfNights(checkIn: Date, checkOut: Date): number {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const diffTime = checkOut.getTime() - checkIn.getTime();
    const diffDays = Math.round(diffTime / oneDay);
    return diffDays > 0 ? diffDays : 1; // Minimum 1 night
  }

  /**
   * Get all reservations with optional filtering and pagination
   * @param params - Query parameters
   * @returns Promise with reservations and total count
   */
  async getAllReservations(params: ReservationQueryParams = {}): Promise<{
    data: ReservationWithDetails[];
    total: number;
    page: number;
    limit: number;
  }> {
    const reservations = await this.reservationRepository.findAll(params);
    const total = await this.reservationRepository.count(
      Object.fromEntries(
        Object.entries(params).filter(([key]) => key !== 'page' && key !== 'limit')
      ) as Omit<ReservationQueryParams, 'page' | 'limit'>
    );

    // Fetch rooms for each reservation
    const reservationsWithRooms = await Promise.all(
      reservations.map(async reservation => {
        const rooms = await this.reservationRepository.findRoomsByReservationId(reservation.id);
        return { ...reservation, rooms };
      })
    );

    return {
      data: reservationsWithRooms,
      total,
      page: params.page || 1,
      limit: params.limit || 50,
    };
  }

  /**
   * Get a single reservation by ID with all details
   * @param id - Reservation ID
   * @returns Promise<ReservationWithDetails | null>
   */
  async getReservationById(id: number): Promise<ReservationWithDetails | null> {
    const reservation = await this.reservationRepository.findById(id);
    if (!reservation) {
      return null;
    }

    const rooms = await this.reservationRepository.findRoomsByReservationId(id);
    return { ...reservation, rooms };
  }

  /**
   * Create a new reservation with automatic bill generation
   * Uses database transaction to ensure data consistency
   * @param dto - Reservation creation data
   * @returns Promise<ReservationWithDetails> - Created reservation with details
   */
  async createReservation(dto: CreateReservationDto): Promise<ReservationWithDetails> {
    const connection = await getConnectionPool().getConnection();

    try {
      await connection.beginTransaction();

      // Validate hotel exists
      const hotel = await this.hotelRepository.findById(dto.hotelId);
      if (!hotel) {
        throw new Error('Hotel not found');
      }

      // Parse dates consistently (YYYY-MM-DD format)
      // Use 'Z' suffix to force UTC interpretation, then normalize to UTC midnight
      const checkInDateStr = dto.checkIn + 'T00:00:00Z';
      const checkOutDateStr = dto.checkOut + 'T00:00:00Z';
      const checkIn = new Date(checkInDateStr);
      const checkOut = new Date(checkOutDateStr);

      // Normalize to UTC midnight for comparison
      checkIn.setUTCHours(0, 0, 0, 0);
      checkOut.setUTCHours(0, 0, 0, 0);

      // Validate dates
      if (checkIn >= checkOut) {
        throw new Error('Check-out date must be after check-in date');
      }

      // Get today's date at midnight UTC for consistent comparison
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);

      // Allow same-day check-ins (>= instead of <)
      if (checkIn < today) {
        throw new Error('Check-in date cannot be in the past');
      }

      // Calculate number of nights and total price
      const numberOfNights = this.calculateNumberOfNights(checkIn, checkOut);
      const totalPrice = hotel.price_per_night * numberOfNights;

      // Validate rooms
      if (!dto.rooms || dto.rooms.length === 0) {
        throw new Error('At least one room is required');
      }

      for (const room of dto.rooms) {
        if (room.nb_adults < 1) {
          throw new Error('Each room must have at least 1 adult');
        }
        if (room.nb_enfants < 0) {
          throw new Error('Number of children cannot be negative');
        }
        // Validate ages_enfants: if children exist, ages must be provided and match count
        if (room.nb_enfants > 0) {
          if (!room.ages_enfants || room.ages_enfants.length !== room.nb_enfants) {
            throw new Error('Number of children ages must match number of children');
          }
        } else if (room.ages_enfants && room.ages_enfants.length > 0) {
          // If no children but ages provided, that's also invalid
          throw new Error('Cannot provide children ages when number of children is 0');
        }
      }

      // Create reservation
      const reservation = await this.reservationRepository.create(
        {
          hotel_id: dto.hotelId,
          check_in: checkIn,
          check_out: checkOut,
          number_of_nights: numberOfNights,
          total_price: totalPrice,
          status: 'pending',
        },
        connection
      );

      // Create rooms
      await this.reservationRepository.createRooms(reservation.id, dto.rooms, connection);

      // Create facture automatically
      await this.factureService.createFactureForReservation(reservation.id, totalPrice, connection);

      // Fetch rooms before commit (using same connection to ensure data is available)
      const rooms = await this.reservationRepository.findRoomsByReservationId(
        reservation.id,
        connection
      );

      // Commit transaction
      await connection.commit();

      // Build reservation with details (we have all data from the transaction, no need to query again)
      const reservationWithDetails: ReservationWithDetails = {
        ...reservation,
        hotel_name: hotel.name,
        hotel_city: hotel.city,
        hotel_country: hotel.country,
        hotel_address: hotel.address || undefined,
        hotel_price_per_night: hotel.price_per_night,
        rooms,
      };

      logger.info(`Reservation created successfully: ${reservation.id}`);
      return reservationWithDetails;
    } catch (error) {
      await connection.rollback();
      logger.error('Error creating reservation', error);
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Update a reservation
   * Recalculates price if dates change
   * @param id - Reservation ID
   * @param dto - Update data
   * @returns Promise<ReservationWithDetails | null>
   */
  async updateReservation(
    id: number,
    dto: UpdateReservationDto
  ): Promise<ReservationWithDetails | null> {
    const existingReservation = await this.reservationRepository.findById(id);
    if (!existingReservation) {
      return null;
    }

    const connection = await getConnectionPool().getConnection();

    try {
      await connection.beginTransaction();

      let checkIn = existingReservation.check_in;
      let checkOut = existingReservation.check_out;
      let numberOfNights = existingReservation.number_of_nights;
      let totalPrice = existingReservation.total_price;

      // Update dates if provided
      if (dto.checkIn || dto.checkOut) {
        checkIn = dto.checkIn ? new Date(dto.checkIn) : existingReservation.check_in;
        checkOut = dto.checkOut ? new Date(dto.checkOut) : existingReservation.check_out;

        if (checkIn >= checkOut) {
          throw new Error('Check-out date must be after check-in date');
        }

        numberOfNights = this.calculateNumberOfNights(checkIn, checkOut);
        totalPrice = existingReservation.hotel_price_per_night! * numberOfNights;
      }

      // Update reservation
      const updatedReservation = await this.reservationRepository.update(id, {
        check_in: checkIn,
        check_out: checkOut,
        number_of_nights: numberOfNights,
        total_price: totalPrice,
        status: dto.status,
      });

      if (!updatedReservation) {
        throw new Error('Failed to update reservation');
      }

      // Update rooms if provided
      if (dto.rooms) {
        // Validate rooms
        for (const room of dto.rooms) {
          if (room.nb_adults < 1) {
            throw new Error('Each room must have at least 1 adult');
          }
          if (room.nb_enfants < 0) {
            throw new Error('Number of children cannot be negative');
          }
          if (room.ages_enfants && room.ages_enfants.length !== room.nb_enfants) {
            throw new Error('Number of children ages must match number of children');
          }
        }

        // Delete existing rooms and create new ones
        await this.reservationRepository.deleteRooms(id, connection);
        await this.reservationRepository.createRooms(id, dto.rooms, connection);
      }

      // Update associated facture if total price changed and facture exists
      if (totalPrice !== existingReservation.total_price) {
        const existingFacture = await this.factureService.findByReservationId(id);
        if (existingFacture) {
          await this.factureService.updateFactureTotalAmount(
            existingFacture.id,
            totalPrice,
            connection
          );
        }
      }

      await connection.commit();

      // Fetch complete reservation with details
      const reservationWithDetails = await this.getReservationById(id);
      logger.info(`Reservation updated successfully: ${id}`);
      return reservationWithDetails;
    } catch (error) {
      await connection.rollback();
      logger.error(`Error updating reservation ${id}`, error);
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Delete a reservation
   * Cascade deletion will handle rooms and bills
   * @param id - Reservation ID
   * @returns Promise<boolean>
   */
  async deleteReservation(id: number): Promise<boolean> {
    const deleted = await this.reservationRepository.delete(id);
    if (deleted) {
      logger.info(`Reservation deleted successfully: ${id}`);
    }
    return deleted;
  }
}
