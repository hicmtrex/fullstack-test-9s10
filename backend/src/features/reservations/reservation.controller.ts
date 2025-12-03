import { Request, Response, NextFunction } from 'express';
import { ReservationService } from './reservation.service';
import { ReservationRepository } from './reservation.repository';
import { HotelRepository } from '../hotels/hotel.repository';
import { FactureService } from '../factures/facture.service';
import { FactureRepository } from '../factures/facture.repository';
import { logger } from '../../shared/config/logger';

/**
 * Reservation Controller
 * Handles HTTP requests and responses for reservation endpoints
 * Delegates business logic to ReservationService
 */

// Initialize dependencies
const reservationRepository = new ReservationRepository();
const hotelRepository = new HotelRepository();
const factureRepository = new FactureRepository();
const factureService = new FactureService(factureRepository, reservationRepository);
const reservationService = new ReservationService(
  reservationRepository,
  hotelRepository,
  factureService
);

export class ReservationController {
  /**
   * Get all reservations with optional filtering and pagination
   * GET /api/reservations
   */
  async getAllReservations(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const queryParams = {
        page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
        status: req.query.status as 'pending' | 'confirmed' | 'cancelled' | 'completed' | undefined,
        hotelId: req.query.hotelId ? parseInt(req.query.hotelId as string, 10) : undefined,
        checkInFrom: req.query.checkInFrom as string | undefined,
        checkInTo: req.query.checkInTo as string | undefined,
      };

      const result = await reservationService.getAllReservations(queryParams);
      res.json(result);
    } catch (error) {
      logger.error('Error fetching reservations', error);
      next(error);
    }
  }

  /**
   * Get a single reservation by ID
   * GET /api/reservations/:id
   */
  async getReservationById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const reservation = await reservationService.getReservationById(id);

      if (!reservation) {
        res.status(404).json({ message: 'Reservation not found' });
        return;
      }

      res.json(reservation);
    } catch (error) {
      logger.error(`Error fetching reservation ${req.params.id}`, error);
      next(error);
    }
  }

  /**
   * Create a new reservation
   * POST /api/reservations
   * Automatically generates a bill for the reservation
   */
  async createReservation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const reservation = await reservationService.createReservation(req.body);
      res.status(201).json(reservation);
    } catch (error) {
      // Enhanced error logging for debugging
      logger.error('Error creating reservation', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        body: req.body,
      });

      if (error instanceof Error) {
        res.status(400).json({
          message: error.message,
          error: error.message,
          details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        });
        return;
      }
      next(error);
    }
  }

  /**
   * Update a reservation
   * PUT /api/reservations/:id
   */
  async updateReservation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const reservation = await reservationService.updateReservation(id, req.body);

      if (!reservation) {
        res.status(404).json({ message: 'Reservation not found' });
        return;
      }

      res.json(reservation);
    } catch (error) {
      logger.error(`Error updating reservation ${req.params.id}`, error);
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
        return;
      }
      next(error);
    }
  }

  /**
   * Delete a reservation
   * DELETE /api/reservations/:id
   */
  async deleteReservation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const deleted = await reservationService.deleteReservation(id);

      if (!deleted) {
        res.status(404).json({ message: 'Reservation not found' });
        return;
      }

      res.status(204).send();
    } catch (error) {
      logger.error(`Error deleting reservation ${req.params.id}`, error);
      next(error);
    }
  }
}

// Export an instance of the controller
export const reservationController = new ReservationController();
