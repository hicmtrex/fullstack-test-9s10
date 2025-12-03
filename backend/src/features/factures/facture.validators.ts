import { z } from 'zod';

/**
 * Zod validation schemas for facture-related requests
 */

/**
 * Schema for validating create facture request body
 */
export const createFactureSchema = z.object({
  reservationId: z.number().int().positive('Reservation ID must be a positive number'),
  totalAmount: z.number().positive('Total amount must be positive').optional(),
});

/**
 * Schema for validating update facture status request body
 */
export const updateFactureStatusSchema = z.object({
  status: z.enum(['pending', 'paid', 'cancelled'], {
    errorMap: () => ({ message: 'Status must be one of: pending, paid, cancelled' }),
  }),
});

/**
 * Schema for validating facture ID in URL parameters
 */
export const factureIdSchema = z.object({
  id: z.string().regex(/^\d+$/, 'Facture ID must be a number').transform(Number),
});

/**
 * Schema for validating facture query parameters
 */
export const factureQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).pipe(z.number().int().positive()).optional(),
  limit: z
    .string()
    .regex(/^\d+$/)
    .transform(Number)
    .pipe(z.number().int().positive().max(100))
    .optional(),
  status: z.enum(['pending', 'paid', 'cancelled']).optional(),
  reservationId: z
    .string()
    .regex(/^\d+$/)
    .transform(Number)
    .pipe(z.number().int().positive())
    .optional(),
});
