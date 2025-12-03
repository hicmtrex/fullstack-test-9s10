/**
 * User role type matching backend roles
 */
export type UserRole = 'user' | 'admin';

/**
 * Authenticated user information
 */
export interface AuthUser {
  id: number;
  email: string;
  role: UserRole;
}

/**
 * Login credentials DTO
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Login response from backend
 */
export interface LoginResponse {
  accessToken: string;
  user: AuthUser;
}

/**
 * Refresh token response from backend
 */
export interface RefreshResponse {
  accessToken: string;
}
