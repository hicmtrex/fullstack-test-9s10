#!/usr/bin/env ts-node

/**
 * Standalone script to seed the database
 * Can be run independently: npm run seed
 * or: ts-node scripts/seed-database.ts
 */

import { seedDatabase } from '../src/database/migrations/runMigrations';
import { logger } from '../src/shared/config/logger';

/**
 * Main function to run seed script
 */
async function main(): Promise<void> {
  try {
    logger.info('Starting database seed script...');
    await seedDatabase();
    logger.info('✅ Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    logger.error('❌ Database seeding failed', error);
    process.exit(1);
  }
}

// Run the script
main();
