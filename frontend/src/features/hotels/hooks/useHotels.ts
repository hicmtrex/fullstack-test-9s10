import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { hotelApi } from '../services/hotelApi';
import type {
  CreateHotelDto,
  UpdateHotelDto,
  PaginatedResponse,
  Hotel,
} from '../types/hotel.types';

/**
 * Query keys for hotel queries
 */
export const hotelKeys = {
  all: ['hotels'] as const,
  lists: () => [...hotelKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...hotelKeys.lists(), filters] as const,
  searches: () => [...hotelKeys.all, 'search'] as const,
  search: (criteria: Record<string, unknown>) => [...hotelKeys.searches(), criteria] as const,
  details: () => [...hotelKeys.all, 'detail'] as const,
  detail: (id: number) => [...hotelKeys.details(), id] as const,
};

/**
 * Custom hook to fetch all hotels with pagination
 * @param limit - Limit for pagination (default: 12)
 * @param offset - Offset for pagination (default: 0)
 * @returns React Query hook result
 */
export const useHotels = (limit = 12, offset = 0) => {
  return useQuery({
    queryKey: hotelKeys.list({ limit, offset }),
    queryFn: () => hotelApi.getAll(limit, offset),
    staleTime: 10 * 60 * 1000, // 10 minutes - hotels don't change often
    gcTime: 30 * 60 * 1000, // 30 minutes cache
  });
};

/**
 * Custom hook for infinite scroll/pagination of hotels
 * @param limit - Items per page (default: 12)
 * @returns Infinite query hook result
 */
export const useHotelsInfinite = (limit = 12) => {
  return useInfiniteQuery({
    queryKey: hotelKeys.lists(),
    queryFn: async ({ pageParam = 0 }): Promise<PaginatedResponse<Hotel>> => {
      try {
        const response = await hotelApi.getAll(limit, pageParam);
        // Backend should return PaginatedResponse, but add safety checks
        if (response && typeof response === 'object' && 'data' in response) {
          const paginated = response as PaginatedResponse<Hotel>;
          // Ensure data is always an array
          return {
            ...paginated,
            data: Array.isArray(paginated.data) ? paginated.data : [],
          };
        }
        // Fallback: empty paginated response
        return {
          data: [],
          total: 0,
          limit,
          offset: pageParam,
          hasMore: false,
        };
      } catch (error) {
        console.error('Error fetching hotels:', error);
        return {
          data: [],
          total: 0,
          limit,
          offset: pageParam,
          hasMore: false,
        };
      }
    },
    getNextPageParam: (lastPage: PaginatedResponse<Hotel>) => {
      if (!lastPage || typeof lastPage !== 'object' || !('hasMore' in lastPage)) {
        return undefined;
      }
      return lastPage.hasMore ? lastPage.offset + lastPage.limit : undefined;
    },
    initialPageParam: 0,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
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
