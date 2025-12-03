import React from 'react';
import { HotelCard } from './HotelCard';
import type { HotelSearchResult } from '../types/hotel.types';
import { HotelCardSkeleton } from './HotelCardSkeleton';

/**
 * HotelSearchResults component props
 */
export interface HotelSearchResultsProps {
  hotels: HotelSearchResult[] | undefined;
  numberOfNights: number;
  reservingHotelId: number | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  onReserve: (hotelId: number) => void;
}

/**
 * HotelSearchResults component
 * Displays hotel search results with loading and error states
 */
export const HotelSearchResults: React.FC<HotelSearchResultsProps> = ({
  hotels,
  numberOfNights,
  reservingHotelId,
  isLoading,
  isError,
  error,
  onReserve,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <HotelCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-800 font-medium">Failed to search hotels</p>
        <p className="text-red-600 text-sm mt-2">
          {error instanceof Error ? error.message : 'Unknown error'}
        </p>
      </div>
    );
  }

  if (!hotels || hotels.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <p className="text-gray-500 text-lg">No hotels found</p>
        <p className="text-gray-400 text-sm mt-2">Try adjusting your search criteria</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {hotels.map(hotel => (
        <HotelCard
          key={hotel.id}
          hotel={hotel}
          numberOfNights={numberOfNights}
          onReserve={onReserve}
          isLoading={reservingHotelId === hotel.id}
        />
      ))}
    </div>
  );
};
