import { Request, Response, NextFunction } from 'express';
import { FactureService } from './facture.service';
import { FactureRepository } from './facture.repository';
import { ReservationRepository } from '../reservations/reservation.repository';
import { logger } from '../../shared/config/logger';

/**
 * Facture Controller
 * Handles HTTP requests and responses for facture endpoints
 * Delegates business logic to FactureService
 */

// Initialize dependencies
const factureRepository = new FactureRepository();
const reservationRepository = new ReservationRepository();
const factureService = new FactureService(factureRepository, reservationRepository);

export class FactureController {
  /**
   * Get all factures with optional filtering and pagination
   * GET /api/factures
   */
  async getAllFactures(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const queryParams = {
        page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
        status: req.query.status as 'pending' | 'paid' | 'cancelled' | undefined,
        reservationId: req.query.reservationId
          ? parseInt(req.query.reservationId as string, 10)
          : undefined,
      };

      const result = await factureService.getAllFactures(queryParams);
      res.json(result);
    } catch (error) {
      logger.error('Error fetching factures', error);
      next(error);
    }
  }

  /**
   * Get a single facture by ID
   * GET /api/factures/:id
   */
  async getFactureById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const facture = await factureService.getFactureById(id);

      if (!facture) {
        res.status(404).json({ message: 'Facture not found' });
        return;
      }

      res.json(facture);
    } catch (error) {
      logger.error(`Error fetching facture ${req.params.id}`, error);
      next(error);
    }
  }

  /**
   * Create a facture manually for a reservation
   * POST /api/factures
   */
  async createFacture(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const facture = await factureService.createFacture(req.body);
      res.status(201).json(facture);
    } catch (error) {
      logger.error('Error creating facture', error);
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
        return;
      }
      next(error);
    }
  }

  /**
   * Update facture status
   * PUT /api/factures/:id/status
   */
  async updateFactureStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const facture = await factureService.updateFactureStatus(id, req.body);

      if (!facture) {
        res.status(404).json({ message: 'Facture not found' });
        return;
      }

      res.json(facture);
    } catch (error) {
      logger.error(`Error updating facture status ${req.params.id}`, error);
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
        return;
      }
      next(error);
    }
  }

  /**
   * Delete a facture
   * DELETE /api/factures/:id
   */
  async deleteFacture(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const deleted = await factureService.deleteFacture(id);

      if (!deleted) {
        res.status(404).json({ message: 'Facture not found' });
        return;
      }

      res.status(204).send();
    } catch (error) {
      logger.error(`Error deleting facture ${req.params.id}`, error);
      next(error);
    }
  }

  /**
   * Get printable facture (returns facture data formatted for printing)
   * GET /api/factures/:id/print
   */
  async getPrintableFacture(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const facture = await factureService.getFactureById(id);

      if (!facture) {
        res.status(404).json({ message: 'Facture not found' });
        return;
      }

      // Return facture data formatted for printing
      // Frontend will handle the actual PDF/HTML generation
      res.json({
        ...facture,
        printable: true,
      });
    } catch (error) {
      logger.error(`Error fetching printable facture ${req.params.id}`, error);
      next(error);
    }
  }
}

// Export an instance of the controller
export const factureController = new FactureController();
