import { Router } from 'express';
import { reservationController } from './reservation.controller';
import { validate } from '../../shared/middleware/validator';
import {
  createReservationSchema,
  updateReservationSchema,
  reservationIdSchema,
  reservationQuerySchema,
} from './reservation.validators';

const router = Router();

/**
 * @route GET /api/reservations
 * @description Get all reservations with optional filtering and pagination
 * @access Public
 * @query {number} page - Page number (optional)
 * @query {number} limit - Items per page (optional, max 100)
 * @query {string} status - Filter by status (optional)
 * @query {number} hotelId - Filter by hotel ID (optional)
 * @query {string} checkInFrom - Filter by check-in date from (optional, YYYY-MM-DD)
 * @query {string} checkInTo - Filter by check-in date to (optional, YYYY-MM-DD)
 */
router.get(
  '/',
  validate(reservationQuerySchema, 'query'),
  reservationController.getAllReservations.bind(reservationController)
);

/**
 * @route GET /api/reservations/:id
 * @description Get a single reservation by ID
 * @access Public
 * @param {number} id - Reservation ID
 */
router.get(
  '/:id',
  validate(reservationIdSchema, 'params'),
  reservationController.getReservationById.bind(reservationController)
);

/**
 * @route POST /api/reservations
 * @description Create a new reservation
 * @access Public
 * @body {CreateReservationDto} - Reservation data
 */
router.post(
  '/',
  validate(createReservationSchema),
  reservationController.createReservation.bind(reservationController)
);

/**
 * @route PUT /api/reservations/:id
 * @description Update a reservation
 * @access Public
 * @param {number} id - Reservation ID
 * @body {UpdateReservationDto} - Update data
 */
router.put(
  '/:id',
  validate(reservationIdSchema, 'params'),
  validate(updateReservationSchema),
  reservationController.updateReservation.bind(reservationController)
);

/**
 * @route DELETE /api/reservations/:id
 * @description Delete a reservation
 * @access Public
 * @param {number} id - Reservation ID
 */
router.delete(
  '/:id',
  validate(reservationIdSchema, 'params'),
  reservationController.deleteReservation.bind(reservationController)
);

export default router;
