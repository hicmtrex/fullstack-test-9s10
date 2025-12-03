#!/usr/bin/env ts-node
"use strict";
/**
 * Script to generate bcrypt password hash
 * Usage: ts-node scripts/generate-password-hash.ts <password>
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const password = process.argv[2] || 'admin123';
async function generateHash() {
    const hash = await bcryptjs_1.default.hash(password, 10);
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
//# sourceMappingURL=generate-password-hash.js.map