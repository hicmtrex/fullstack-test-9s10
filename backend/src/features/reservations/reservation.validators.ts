import { z } from 'zod';

/**
 * Zod validation schemas for reservation-related requests
 */

/**
 * Schema for validating room data
 */
export const roomSchema = z
  .object({
    nb_adults: z.number().int().positive('Each room must have at least 1 adult'),
    nb_enfants: z.number().int().min(0, 'Number of children cannot be negative'),
    ages_enfants: z.array(z.number().int().min(0).max(17)).optional(),
  })
  .transform(data => {
    // Normalize ages_enfants: if undefined or null, set to empty array
    return {
      ...data,
      ages_enfants: data.ages_enfants ?? [],
    };
  })
  .refine(
    data => {
      const agesLength = data.ages_enfants.length;

      // If no children, ages_enfants should be empty
      if (data.nb_enfants === 0) {
        return agesLength === 0;
      }

      // If children exist, ages_enfants must match count
      return agesLength === data.nb_enfants;
    },
    {
      message: 'Number of children ages must match number of children',
      path: ['ages_enfants'],
    }
  );

/**
 * Schema for validating create reservation request body
 */
export const createReservationSchema = z
  .object({
    hotelId: z.number().int().positive('Hotel ID must be a positive number'),
    checkIn: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format, expected YYYY-MM-DD')
      .refine(
        date => {
          // Parse check-in date as UTC (use 'Z' suffix to force UTC interpretation)
          const checkInDate = new Date(date + 'T00:00:00Z');
          checkInDate.setUTCHours(0, 0, 0, 0);
          
          // Get today's date at UTC midnight
          const today = new Date();
          today.setUTCHours(0, 0, 0, 0);
          
          // Allow same-day check-ins (>= instead of >)
          return checkInDate >= today;
        },
        {
          message: 'Check-in date cannot be in the past',
        }
      ),
    checkOut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format, expected YYYY-MM-DD'),
    rooms: z
      .array(roomSchema)
      .min(1, 'At least one room is required')
      .max(10, 'Maximum 10 rooms allowed'),
  })
  .refine(
    data => {
      // Parse dates as UTC for consistent comparison
      const checkIn = new Date(data.checkIn + 'T00:00:00Z');
      const checkOut = new Date(data.checkOut + 'T00:00:00Z');
      checkIn.setUTCHours(0, 0, 0, 0);
      checkOut.setUTCHours(0, 0, 0, 0);
      return checkOut > checkIn;
    },
    {
      message: 'Check-out date must be after check-in date',
      path: ['checkOut'],
    }
  );

/**
 * Schema for validating update reservation request body
 */
export const updateReservationSchema = z
  .object({
    checkIn: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format, expected YYYY-MM-DD')
      .optional(),
    checkOut: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format, expected YYYY-MM-DD')
      .optional(),
    rooms: z.array(roomSchema).min(1).max(10).optional(),
    status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']).optional(),
  })
  .refine(
    data => {
      if (data.checkIn && data.checkOut) {
        const checkIn = new Date(data.checkIn);
        const checkOut = new Date(data.checkOut);
        return checkOut > checkIn;
      }
      return true;
    },
    {
      message: 'Check-out date must be after check-in date',
      path: ['checkOut'],
    }
  );

/**
 * Schema for validating reservation ID in URL parameters
 */
export const reservationIdSchema = z.object({
  id: z.string().regex(/^\d+$/, 'Reservation ID must be a number').transform(Number),
});

/**
 * Schema for validating reservation query parameters
 */
export const reservationQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).pipe(z.number().int().positive()).optional(),
  limit: z
    .string()
    .regex(/^\d+$/)
    .transform(Number)
    .pipe(z.number().int().positive().max(100))
    .optional(),
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']).optional(),
  hotelId: z.string().regex(/^\d+$/).transform(Number).pipe(z.number().int().positive()).optional(),
  checkInFrom: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  checkInTo: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
});
