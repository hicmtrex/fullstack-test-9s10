#!/usr/bin/env ts-node

/**
 * Script to generate bcrypt password hash
 * Usage: ts-node scripts/generate-password-hash.ts <password>
 */

import bcrypt from 'bcryptjs';

const password = process.argv[2] || 'admin123';

async function generateHash(): Promise<void> {
  const hash = await bcrypt.hash(password, 10);
  // eslint-disable-next-line no-console
  console.log('\n========================================');
  // eslint-disable-next-line no-console
  console.log(`Password: ${password}`);
  // eslint-disable-next-line no-console
  console.log(`Hash: ${hash}`);
  // eslint-disable-next-line no-console
  console.log('========================================\n');
  // eslint-disable-next-line no-console
  console.log('Copy the hash above to your seed file.\n');
}

generateHash().catch(console.error);
