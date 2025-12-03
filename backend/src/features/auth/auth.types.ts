/**
 * Authentication and user related TypeScript types
 */

/**
 * Supported user roles in the system
 */
export type UserRole = 'user' | 'admin';

/**
 * User entity as stored in the database
 */
export interface User {
  id: number;
  email: string;
  password_hash: string;
  role: UserRole;
  created_at: Date;
  updated_at?: Date;
}

/**
 * DTO for registering a new user
 */
export interface RegisterDto {
  email: string;
  password: string;
  role?: UserRole;
}

/**
 * DTO for logging in an existing user
 */
export interface LoginDto {
  email: string;
  password: string;
}

/**
 * JWT tokens returned to the client
 */
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

/**
 * Payload stored in JWT tokens
 */
export interface AuthTokenPayload {
  sub: number;
  role: UserRole;
}
