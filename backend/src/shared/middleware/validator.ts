import { Request, Response, NextFunction } from 'express';
import { z, ZodError, ZodIssue } from 'zod';
import { logger } from '../config/logger';

/**
 * Validation middleware factory
 * Creates middleware to validate request data against a Zod schema
 * @param schema - Zod schema to validate against
 * @param source - Where to validate from: 'body', 'query', or 'params'
 * @returns Express middleware function
 */
export function validate(schema: z.ZodSchema, source: 'body' | 'query' | 'params' = 'body') {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const data = req[source];
      schema.parse(data);
      next();
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        const errorDetails = error.errors.map((err: ZodIssue) => ({
          path: err.path.join('.'),
          message: err.message,
        }));

        // Log validation errors for debugging
        logger.warn('Validation error', {
          source,
          data: req[source],
          errors: errorDetails,
        });

        res.status(400).json({
          error: 'Validation error',
          message: errorDetails[0]?.message || 'Invalid request data',
          details: errorDetails,
        });
      } else {
        res.status(400).json({ error: 'Invalid request data' });
      }
    }
  };
}
