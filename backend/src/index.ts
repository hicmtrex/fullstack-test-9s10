import express, { Request, Response } from 'express';
import cors from 'cors';
import { env } from './shared/config/env';
import { logger } from './shared/config/logger';
import { getConnectionPool } from './database/connection';
import { runMigrations, seedDatabase } from './database/migrations/runMigrations';
import hotelRoutes from './features/hotels/hotel.routes';
import reservationRoutes from './features/reservations/reservation.routes';
import factureRoutes from './features/factures/facture.routes';
import dashboardRoutes from './features/dashboard/dashboard.routes';
import authRoutes from './features/auth/auth.routes';
import { errorHandler } from './shared/middleware/errorHandler';
import morgan from 'morgan';
const app = express();
const PORT = env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

/**
 * Health check endpoint
 */
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

/**
 * Initialize database with migrations and seeds
 */
async function initializeDatabase(): Promise<void> {
  try {
    // Small delay to allow MySQL to be ready (useful for Docker)
    await new Promise(resolve => setTimeout(resolve, 2000));

    await runMigrations();
    await seedDatabase();
    logger.info('Database initialized successfully');
  } catch (error) {
    logger.error('Database initialization error', error);
    logger.warn(
      'Server will continue running. Database will be initialized when MySQL is available.'
    );
    // Don't throw - allow server to start even if DB isn't ready
  }
}

/**
 * Initialize database on startup (non-blocking)
 * Server will start even if MySQL isn't ready yet
 * Database will be initialized when MySQL becomes available
 */
initializeDatabase().catch(error => {
  logger.error('Failed to initialize database', error);
  logger.warn(
    'Server is running but database is not initialized. Check MySQL connection and restart the server when MySQL is ready.'
  );
  // Don't exit - allow server to start even if DB isn't ready
  // This is useful for Docker setups where MySQL might start after the backend
});

// Register feature routes
app.use('/api/auth', authRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/factures', factureRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check endpoint
app.get('/health', async (_req: Request, res: Response) => {
  const dbHealthy = await getConnectionPool()
    .query('SELECT 1')
    .then(() => true)
    .catch(() => false);

  res.status(dbHealthy ? 200 : 503).json({
    status: dbHealthy ? 'healthy' : 'unhealthy',
    database: dbHealthy ? 'connected' : 'disconnected',
  });
});

// Global error handler (must be last middleware, after all routes)
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`, { port: PORT, env: env.NODE_ENV });
  logger.info('Note: Database initialization is running in the background');
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  // Close database connections
  await getConnectionPool().end();
  process.exit(0);
});
