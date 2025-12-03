import { z } from 'zod';

/**
 * Validation schemas for hotel operations using Zod
 */

/**
 * Schema for creating a hotel
 */
export const createHotelSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name is too long'),
  country: z.string().min(1, 'Country is required').max(100, 'Country is too long'),
  city: z.string().min(1, 'City is required').max(100, 'City is too long'),
  address: z.string().max(500, 'Address is too long').optional().nullable(),
  price_per_night: z
    .number()
    .positive('Price must be positive')
    .max(999999.99, 'Price is too high'),
});

/**
 * Schema for updating a hotel
 */
export const updateHotelSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name is too long').optional(),
  country: z.string().min(1, 'Country is required').max(100, 'Country is too long').optional(),
  city: z.string().min(1, 'City is required').max(100, 'City is too long').optional(),
  address: z.string().max(500, 'Address is too long').optional().nullable(),
  price_per_night: z
    .number()
    .positive('Price must be positive')
    .max(999999.99, 'Price is too high')
    .optional(),
});

/**
 * Schema for hotel search
 */
export const hotelSearchSchema = z.object({
  country: z.string().max(100).optional(),
  city: z.string().max(100).optional(),
  hotelIds: z.array(z.number().int().positive()).optional(),
  checkIn: z.string().optional(),
  checkOut: z.string().optional(),
  numberOfNights: z.number().int().positive().optional(),
});

/**
 * Schema for hotel ID parameter
 */
export const hotelIdSchema = z.object({
  id: z.string().regex(/^\d+$/).transform(Number),
});

