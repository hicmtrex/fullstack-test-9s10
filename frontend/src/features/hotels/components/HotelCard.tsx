import React from 'react';
import { HotelSearchResult } from '../types/hotel.types';
import { formatCurrency } from '@/shared/utils/formatters';
import { Button } from '@/shared/components/Button';

/**
 * HotelCard component props
 */
export interface HotelCardProps {
  hotel: HotelSearchResult;
  numberOfNights: number;
  onReserve: (hotelId: number) => void;
  isLoading?: boolean;
}

/**
 * Hotel card component
 * Displays hotel information in a card format
 * Memoized to prevent unnecessary re-renders when parent updates
 */
export const HotelCard: React.FC<HotelCardProps> = React.memo(({
  hotel,
  numberOfNights,
  onReserve,
  isLoading = false,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{hotel.name}</h3>
        
        <div className="space-y-2 mb-4">
          <p className="text-gray-600 flex items-center">
            <svg className="h-5 w-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {hotel.address || `${hotel.city}, ${hotel.country}`}
          </p>
          <p className="text-sm text-gray-500">{hotel.city}, {hotel.country}</p>
        </div>

        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm text-gray-500">Price per night</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatCurrency(hotel.price_per_night)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Total for {numberOfNights} night{numberOfNights > 1 ? 's' : ''}</p>
              <p className="text-xl font-bold text-primary-600">
                {formatCurrency(hotel.totalPrice)}
              </p>
            </div>
          </div>

          <Button
            variant="primary"
            onClick={() => onReserve(hotel.id)}
            isLoading={isLoading}
            className="w-full"
          >
            Reserve Now
          </Button>
        </div>
      </div>
    </div>
  );
});

