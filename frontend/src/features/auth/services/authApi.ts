import { apiClient } from '@/shared/services/apiClient';
import type {
  AuthUser,
  LoginCredentials,
  LoginResponse,
  RefreshResponse,
} from '../types/auth.types';

/**
 * Auth API service
 * Wraps backend /api/auth endpoints
 */
export const authApi = {
  /**
   * Login with email and password
   * @param credentials - Login credentials
   * @returns Access token and user info
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    return apiClient.post<LoginResponse>('/api/auth/login', credentials);
  },

  /**
   * Refresh access token using refresh token cookie
   * @returns New access token
   */
  async refresh(): Promise<RefreshResponse> {
    return apiClient.post<RefreshResponse>('/api/auth/refresh', {});
  },

  /**
   * Logout current user (clears refresh cookie)
   */
  async logout(): Promise<void> {
    await apiClient.post<void>('/api/auth/logout');
  },

  /**
   * Register a new user (optional, mainly for demo/admin seeding)
   */
  async register(data: { email: string; password: string; role?: AuthUser['role'] }): Promise<{
    id: number;
    email: string;
    role: AuthUser['role'];
  }> {
    return apiClient.post('/api/auth/register', data);
  },
};
