import { Router } from 'express';
import { factureController } from './facture.controller';
import { validate } from '../../shared/middleware/validator';
import {
  createFactureSchema,
  updateFactureStatusSchema,
  factureIdSchema,
  factureQuerySchema,
} from './facture.validators';

const router = Router();

/**
 * @route GET /api/factures
 * @description Get all factures with optional filtering and pagination
 * @access Public
 * @query {number} page - Page number (optional)
 * @query {number} limit - Items per page (optional, max 100)
 * @query {string} status - Filter by status (optional: pending, paid, cancelled)
 * @query {number} reservationId - Filter by reservation ID (optional)
 */
router.get(
  '/',
  validate(factureQuerySchema, 'query'),
  factureController.getAllFactures.bind(factureController)
);

/**
 * @route GET /api/factures/:id
 * @description Get a single facture by ID
 * @access Public
 * @param {number} id - Facture ID
 */
router.get(
  '/:id',
  validate(factureIdSchema, 'params'),
  factureController.getFactureById.bind(factureController)
);

/**
 * @route GET /api/factures/:id/print
 * @description Get facture data formatted for printing
 * @access Public
 * @param {number} id - Facture ID
 */
router.get(
  '/:id/print',
  validate(factureIdSchema, 'params'),
  factureController.getPrintableFacture.bind(factureController)
);

/**
 * @route POST /api/factures
 * @description Create a facture manually for a reservation
 * @access Public
 * @body {CreateFactureDto} - Facture data
 */
router.post(
  '/',
  validate(createFactureSchema),
  factureController.createFacture.bind(factureController)
);

/**
 * @route PUT /api/factures/:id/status
 * @description Update facture status
 * @access Public
 * @param {number} id - Facture ID
 * @body {UpdateFactureStatusDto} - Status update data
 */
router.put(
  '/:id/status',
  validate(factureIdSchema, 'params'),
  validate(updateFactureStatusSchema),
  factureController.updateFactureStatus.bind(factureController)
);

/**
 * @route DELETE /api/factures/:id
 * @description Delete a facture
 * @access Public
 * @param {number} id - Facture ID
 */
router.delete(
  '/:id',
  validate(factureIdSchema, 'params'),
  factureController.deleteFacture.bind(factureController)
);

export default router;
