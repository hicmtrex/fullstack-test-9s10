import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/shared/providers/AuthProvider';
import type { LoginCredentials } from '../types/auth.types';
import { useNotification } from '@/shared/providers/NotificationProvider';
import type { ApiClientError } from '@/shared/services/apiClient';

/**
 * Custom hook that wraps login with React Query mutation
 * Handles success/error toasts and exposes loading/error state
 */
export const useLogin = (): ReturnType<
  typeof useMutation<void, ApiClientError, LoginCredentials>
> => {
  const { login } = useAuth();
  const { showSuccess, showError } = useNotification();

  return useMutation<void, ApiClientError, LoginCredentials>({
    mutationFn: async (credentials: LoginCredentials) => {
      await login(credentials);
    },
    onSuccess: () => {
      showSuccess('Successfully logged in');
    },
    onError: error => {
      const message = error.message || 'Invalid email or password';
      showError(message);
    },
  });
};
