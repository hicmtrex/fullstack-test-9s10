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
export const HotelCard: React.FC<HotelCardProps> = React.memo(
  ({ hotel, numberOfNights, onReserve, isLoading = false }) => {
    console.log(hotel);
    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        {/* Hotel Image */}
        <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300">
          {hotel.image_url ? (
            <img
              src={hotel.image_url}
              alt={hotel.name}
              className="w-full h-full object-cover"
              onError={e => {
                // Fallback to placeholder if image fails to load
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg
                className="w-16 h-16 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </div>
          )}
        </div>

        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">{hotel.name}</h3>

          <div className="space-y-2 mb-4">
            <p className="text-gray-600 flex items-center text-sm">
              <svg
                className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="truncate">{hotel.address || `${hotel.city}, ${hotel.country}`}</span>
            </p>
            <p className="text-sm text-gray-500">
              {hotel.city}, {hotel.country}
            </p>
          </div>

          <div className="border-t border-gray-200 pt-4 mt-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Price per night</p>
                <p className="text-lg font-semibold text-gray-900 mt-1">
                  {formatCurrency(hotel.price_per_night)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Total for {numberOfNights} night{numberOfNights > 1 ? 's' : ''}
                </p>
                <p className="text-2xl font-bold text-indigo-600 mt-1">
                  {formatCurrency(hotel.totalPrice)}
                </p>
              </div>
            </div>

            <Button
              variant="primary"
              onClick={() => onReserve(hotel.id)}
              isLoading={isLoading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              Reserve Now
            </Button>
          </div>
        </div>
      </div>
    );
  }
);
