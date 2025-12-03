import { z } from 'zod';

/**
 * Schema for user registration request body
 */
export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .max(128, 'Password is too long'),
  role: z.enum(['user', 'admin']).optional(),
});

/**
 * Schema for user login request body
 */
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

/**
 * Schema for refresh token request body
 * We accept refresh token in body as a fallback even if cookie is preferred
 */
export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});
