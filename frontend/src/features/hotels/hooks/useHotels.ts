import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { hotelApi } from '../services/hotelApi';
import type { CreateHotelDto, UpdateHotelDto } from '../types/hotel.types';

/**
 * Query keys for hotel queries
 */
export const hotelKeys = {
  all: ['hotels'] as const,
  lists: () => [...hotelKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...hotelKeys.lists(), filters] as const,
  details: () => [...hotelKeys.all, 'detail'] as const,
  detail: (id: number) => [...hotelKeys.details(), id] as const,
};

/**
 * Custom hook to fetch all hotels
 * @param limit - Optional limit for pagination
 * @param offset - Optional offset for pagination
 * @returns React Query hook result
 */
export const useHotels = (limit?: number, offset?: number) => {
  return useQuery({
    queryKey: hotelKeys.list({ limit, offset }),
    queryFn: () => hotelApi.getAll(limit, offset),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Custom hook to fetch a single hotel by ID
 * @param id - Hotel ID
 * @param enabled - Whether the query should run
 * @returns React Query hook result
 */
export const useHotel = (id: number | null, enabled = true) => {
  return useQuery({
    queryKey: hotelKeys.detail(id!),
    queryFn: () => hotelApi.getById(id!),
    enabled: enabled && id !== null,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Custom hook to create a hotel
 * @returns React Query mutation
 */
export const useCreateHotel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateHotelDto) => hotelApi.create(data),
    onSuccess: () => {
      // Invalidate and refetch hotels list
      queryClient.invalidateQueries({ queryKey: hotelKeys.lists() });
    },
  });
};

/**
 * Custom hook to update a hotel
 * @returns React Query mutation
 */
export const useUpdateHotel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateHotelDto }) => hotelApi.update(id, data),
    onSuccess: (_, variables) => {
      // Invalidate specific hotel and list
      queryClient.invalidateQueries({ queryKey: hotelKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: hotelKeys.lists() });
    },
  });
};

/**
 * Custom hook to delete a hotel
 * @returns React Query mutation
 */
export const useDeleteHotel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => hotelApi.delete(id),
    onSuccess: (_, id) => {
      // Remove from cache and invalidate list
      queryClient.removeQueries({ queryKey: hotelKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: hotelKeys.lists() });
    },
  });
};
