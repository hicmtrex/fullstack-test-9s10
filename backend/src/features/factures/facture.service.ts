import mysql from 'mysql2/promise';
import { FactureRepository } from './facture.repository';
import { ReservationRepository } from '../reservations/reservation.repository';
import {
  Facture,
  FactureWithDetails,
  CreateFactureDto,
  UpdateFactureStatusDto,
  FactureQueryParams,
} from './facture.types';
import { logger } from '../../shared/config/logger';

/**
 * Facture Service
 * Handles business logic for factures (bills)
 * Orchestrates repository calls and implements business rules
 */
export class FactureService {
  private factureRepository: FactureRepository;
  private reservationRepository: ReservationRepository;

  constructor(factureRepository: FactureRepository, reservationRepository: ReservationRepository) {
    this.factureRepository = factureRepository;
    this.reservationRepository = reservationRepository;
  }

  /**
   * Get all factures with optional filtering and pagination
   * @param params - Query parameters
   * @returns Promise with factures and total count
   */
  async getAllFactures(params: FactureQueryParams = {}): Promise<{
    data: FactureWithDetails[];
    total: number;
    page: number;
    limit: number;
  }> {
    const factures = await this.factureRepository.findAll(params);
    const total = await this.factureRepository.count(
      Object.fromEntries(
        Object.entries(params).filter(([key]) => key !== 'page' && key !== 'limit')
      ) as Omit<FactureQueryParams, 'page' | 'limit'>
    );

    return {
      data: factures,
      total,
      page: params.page || 1,
      limit: params.limit || 50,
    };
  }

  /**
   * Get a single facture by ID with all details
   * @param id - Facture ID
   * @returns Promise<FactureWithDetails | null>
   */
  async getFactureById(id: number): Promise<FactureWithDetails | null> {
    return this.factureRepository.findById(id);
  }

  /**
   * Create a facture for a reservation
   * Prevents duplicate factures for the same reservation
   * @param dto - Facture creation data
   * @returns Promise<FactureWithDetails> - Created facture with details
   */
  async createFacture(dto: CreateFactureDto): Promise<FactureWithDetails> {
    // Check if facture already exists for this reservation
    const existingFacture = await this.factureRepository.findByReservationId(dto.reservationId);
    if (existingFacture) {
      throw new Error('A facture already exists for this reservation');
    }

    // Get reservation to calculate total amount
    const reservation = await this.reservationRepository.findById(dto.reservationId);
    if (!reservation) {
      throw new Error('Reservation not found');
    }

    const totalAmount = dto.totalAmount || reservation.total_price;

    const facture = await this.factureRepository.create({
      reservation_id: dto.reservationId,
      total_amount: totalAmount,
      status: 'pending',
    });

    // Build facture with details directly (we already have the facture, no need to query again)
    // Note: This method is used outside transactions, so we can query for details
    const factureWithDetails = await this.factureRepository.findById(facture.id);
    if (!factureWithDetails) {
      // If query fails, return basic facture (shouldn't happen, but handle gracefully)
      logger.warn(`Could not fetch facture details for ${facture.id}, returning basic facture`);
      return {
        ...facture,
        reservation: undefined,
        hotel: undefined,
      } as FactureWithDetails;
    }

    logger.info(`Facture created successfully: ${facture.id} for reservation ${dto.reservationId}`);
    return factureWithDetails;
  }

  /**
   * Update facture status
   * @param id - Facture ID
   * @param dto - Status update data
   * @returns Promise<FactureWithDetails | null>
   */
  async updateFactureStatus(
    id: number,
    dto: UpdateFactureStatusDto
  ): Promise<FactureWithDetails | null> {
    const updatedFacture = await this.factureRepository.update(id, {
      status: dto.status,
    });

    if (!updatedFacture) {
      return null;
    }

    logger.info(`Facture ${id} status updated to ${dto.status}`);
    return this.factureRepository.findById(id);
  }

  /**
   * Delete a facture
   * @param id - Facture ID
   * @returns Promise<boolean>
   */
  async deleteFacture(id: number): Promise<boolean> {
    const deleted = await this.factureRepository.delete(id);
    if (deleted) {
      logger.info(`Facture deleted successfully: ${id}`);
    }
    return deleted;
  }

  /**
   * Create facture automatically for a reservation (used by reservation service)
   * @param reservationId - Reservation ID
   * @param totalAmount - Total amount
   * @param connection - Database connection (for transaction)
   * @returns Promise<Facture> - Created facture
   */
  async createFactureForReservation(
    reservationId: number,
    totalAmount: number,
    connection?: mysql.PoolConnection
  ): Promise<Facture> {
    // Check if facture already exists (use same connection if in transaction)
    const existingFacture = await this.factureRepository.findByReservationId(
      reservationId,
      connection
    );
    if (existingFacture) {
      return existingFacture;
    }

    return this.factureRepository.create(
      {
        reservation_id: reservationId,
        total_amount: totalAmount,
        status: 'pending',
      },
      connection
    );
  }

  /**
   * Find facture by reservation ID
   * @param reservationId - Reservation ID
   * @returns Promise<Facture | null> - Facture or null if not found
   */
  async findByReservationId(reservationId: number): Promise<Facture | null> {
    return this.factureRepository.findByReservationId(reservationId);
  }

  /**
   * Update facture total amount (used when reservation price changes)
   * @param factureId - Facture ID
   * @param totalAmount - New total amount
   * @param connection - Optional database connection (for transaction)
   * @returns Promise<Facture | null> - Updated facture or null if not found
   */
  async updateFactureTotalAmount(
    factureId: number,
    totalAmount: number,
    connection?: mysql.PoolConnection
  ): Promise<Facture | null> {
    return this.factureRepository.update(factureId, { total_amount: totalAmount }, connection);
  }
}
