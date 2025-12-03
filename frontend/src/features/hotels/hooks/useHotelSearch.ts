import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { hotelApi } from '../services/hotelApi';
import { hotelKeys } from './useHotels';
import type {
  HotelSearchCriteria,
  HotelSearchResult,
  PaginatedResponse,
} from '../types/hotel.types';

/**
 * Custom hook for hotel search (using query for better caching)
 * @param criteria - Search criteria
 * @param enabled - Whether the query should run
 * @returns React Query hook result
 */
export const useHotelSearch = (
  criteria: HotelSearchCriteria,
  enabled = true
): ReturnType<typeof useQuery<PaginatedResponse<HotelSearchResult>>> => {
  return useQuery({
    queryKey: hotelKeys.search({ ...(criteria as Record<string, unknown>) }),
    queryFn: () => hotelApi.search(criteria),
    enabled: enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes - search results can be cached
    gcTime: 15 * 60 * 1000, // 15 minutes cache
  });
};

/**
 * Custom hook for infinite scroll hotel search
 * @param criteria - Search criteria (without limit/offset)
 * @param limit - Items per page (default: 12)
 * @param enabled - Whether the query should run
 * @returns Infinite query hook result
 */
export const useHotelSearchInfinite = (
  criteria: Omit<HotelSearchCriteria, 'limit' | 'offset'>,
  limit = 12,
  enabled = true
) => {
  return useInfiniteQuery({
    queryKey: hotelKeys.search(criteria),
    queryFn: async ({ pageParam = 0 }): Promise<PaginatedResponse<HotelSearchResult>> => {
      try {
        const response = await hotelApi.search({ ...criteria, limit, offset: pageParam });
        // Backend should return PaginatedResponse, but add safety checks
        if (response && typeof response === 'object' && 'data' in response) {
          const paginated = response as PaginatedResponse<HotelSearchResult>;
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
        console.error('Error searching hotels:', error);
        return {
          data: [],
          total: 0,
          limit,
          offset: pageParam,
          hasMore: false,
        };
      }
    },
    getNextPageParam: (lastPage: PaginatedResponse<HotelSearchResult>) => {
      if (!lastPage || typeof lastPage !== 'object' || !('hasMore' in lastPage)) {
        return undefined;
      }
      return lastPage.hasMore ? lastPage.offset + lastPage.limit : undefined;
    },
    initialPageParam: 0,
    enabled: enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
};

/**
 * Legacy mutation hook for backward compatibility
 * @deprecated Use useHotelSearch instead for better caching
 */
export const useHotelSearchMutation = (): ReturnType<typeof useHotelSearch> => {
  // Convert to query internally but expose as mutation-like API
  return useHotelSearch({}, false);
};
