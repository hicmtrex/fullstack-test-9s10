#!/usr/bin/env ts-node
"use strict";
/**
 * Standalone script to seed the database
 * Can be run independently: npm run seed
 * or: ts-node scripts/seed-database.ts
 */
Object.defineProperty(exports, "__esModule", { value: true });
const runMigrations_1 = require("../src/database/migrations/runMigrations");
const logger_1 = require("../src/shared/config/logger");
/**
 * Main function to run seed script
 */
async function main() {
    try {
        logger_1.logger.info('Starting database seed script...');
        await (0, runMigrations_1.seedDatabase)();
        logger_1.logger.info('✅ Database seeding completed successfully!');
        process.exit(0);
    }
    catch (error) {
        logger_1.logger.error('❌ Database seeding failed', error);
        process.exit(1);
    }
}
// Run the script
main();
//# sourceMappingURL=seed-database.js.map