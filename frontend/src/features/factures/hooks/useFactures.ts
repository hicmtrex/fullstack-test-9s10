import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { factureApi } from '../services/factureApi';
import type {
  FactureWithDetails,
  FacturesResponse,
  CreateFactureDto,
  UpdateFactureStatusDto,
  FactureQueryParams,
} from '../types/facture.types';
import { ApiClientError } from '@/shared/services/apiClient';
import { useNotification } from '@/shared/providers/NotificationProvider';

/**
 * Query keys for facture queries
 */
export const factureKeys = {
  all: ['factures'] as const,
  lists: () => [...factureKeys.all, 'list'] as const,
  list: (params?: FactureQueryParams) => [...factureKeys.lists(), params] as const,
  details: () => [...factureKeys.all, 'detail'] as const,
  detail: (id: number) => [...factureKeys.details(), id] as const,
  print: (id: number) => [...factureKeys.detail(id), 'print'] as const,
};

/**
 * Custom hook to fetch all factures
 * @param params - Query parameters for filtering and pagination
 * @returns React Query hook result
 */
export const useFactures = (params?: FactureQueryParams) => {
  return useQuery<FacturesResponse, ApiClientError>({
    queryKey: factureKeys.list(params),
    queryFn: () => factureApi.getAllFactures(params),
    staleTime: 30 * 1000, // 30 seconds
  });
};

/**
 * Custom hook to fetch a single facture
 * @param id - Facture ID
 * @param enabled - Whether the query should be enabled
 * @returns React Query hook result
 */
export const useFacture = (id: number, enabled: boolean = true) => {
  return useQuery<FactureWithDetails, ApiClientError>({
    queryKey: factureKeys.detail(id),
    queryFn: () => factureApi.getFactureById(id),
    enabled: enabled && !!id,
  });
};

/**
 * Custom hook to get printable facture
 * @param id - Facture ID
 * @param enabled - Whether the query should be enabled
 * @returns React Query hook result
 */
export const usePrintableFacture = (id: number, enabled: boolean = true) => {
  return useQuery<FactureWithDetails, ApiClientError>({
    queryKey: factureKeys.print(id),
    queryFn: () => factureApi.getPrintableFacture(id),
    enabled: enabled && !!id,
  });
};

/**
 * Custom hook to create a facture
 * Includes toast notifications for success and error
 * @returns Mutation hook for creating factures
 */
export const useCreateFacture = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useNotification();

  return useMutation<FactureWithDetails, ApiClientError, CreateFactureDto>({
    mutationFn: data => factureApi.createFacture(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: factureKeys.lists() });
      showSuccess('Bill created successfully!');
    },
    onError: (error: ApiClientError) => {
      const errorMessage =
        (typeof error.data === 'object' &&
          error.data !== null &&
          'message' in error.data &&
          String((error.data as { message: string }).message)) ||
        (typeof error.data === 'object' &&
          error.data !== null &&
          'error' in error.data &&
          String((error.data as { error: string }).error)) ||
        error.message ||
        'Failed to create bill. Please try again.';
      showError(errorMessage);
    },
  });
};

/**
 * Custom hook to update facture status
 * Includes toast notifications for success and error
 * @returns Mutation hook for updating facture status
 */
export const useUpdateFactureStatus = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useNotification();

  return useMutation<
    FactureWithDetails,
    ApiClientError,
    { id: number; data: UpdateFactureStatusDto }
  >({
    mutationFn: ({ id, data }) => factureApi.updateFactureStatus(id, data),
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: factureKeys.lists() });
      queryClient.invalidateQueries({ queryKey: factureKeys.detail(data.id) });
      showSuccess(`Bill status updated to ${data.status} successfully`);
    },
    onError: (error: ApiClientError) => {
      const errorMessage =
        (typeof error.data === 'object' &&
          error.data !== null &&
          'message' in error.data &&
          String((error.data as { message: string }).message)) ||
        (typeof error.data === 'object' &&
          error.data !== null &&
          'error' in error.data &&
          String((error.data as { error: string }).error)) ||
        error.message ||
        'Failed to update bill status. Please try again.';
      showError(errorMessage);
    },
  });
};

/**
 * Custom hook to delete a facture
 * Includes toast notifications for success and error
 * @returns Mutation hook for deleting factures
 */
export const useDeleteFacture = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useNotification();

  return useMutation<void, ApiClientError, number>({
    mutationFn: id => factureApi.deleteFacture(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: factureKeys.lists() });
      showSuccess('Bill deleted successfully');
    },
    onError: (error: ApiClientError) => {
      const errorMessage =
        (typeof error.data === 'object' &&
          error.data !== null &&
          'message' in error.data &&
          String((error.data as { message: string }).message)) ||
        (typeof error.data === 'object' &&
          error.data !== null &&
          'error' in error.data &&
          String((error.data as { error: string }).error)) ||
        error.message ||
        'Failed to delete bill. Please try again.';
      showError(errorMessage);
    },
  });
};
