import { useMutation } from '@tanstack/react-query';
import { hotelApi } from '../services/hotelApi';
import type { HotelSearchCriteria, HotelSearchResult } from '../types/hotel.types';

/**
 * Custom hook for hotel search
 * @returns React Query mutation for hotel search
 */
export const useHotelSearch = () => {
  return useMutation<HotelSearchResult[], Error, HotelSearchCriteria>({
    mutationFn: (criteria: HotelSearchCriteria) => hotelApi.search(criteria),
  });
};

