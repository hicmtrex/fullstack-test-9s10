import React from 'react';
import { Search, Calendar } from 'lucide-react';
import { Button } from '@/shared/components/Button';
import { Input } from '@/shared/components/Input';
import { RoomConfiguration, type Room } from '@/features/reservations/components/RoomConfiguration';
import { getTodayDate } from '@/shared/utils/dateUtils';

/**
 * HotelSearchForm component props
 */
export interface HotelSearchFormProps {
  country: string;
  city: string;
  checkIn: string;
  checkOut: string;
  rooms: Room[];
  numberOfNights: number;
  isSearching: boolean;
  onCountryChange: (value: string) => void;
  onCityChange: (value: string) => void;
  onCheckInChange: (value: string) => void;
  onCheckOutChange: (value: string) => void;
  onSearch: (e: React.FormEvent) => void;
  onAddRoom: () => void;
  onRemoveRoom: (index: number) => void;
  onUpdateRoom: (index: number, field: keyof Room, value: number | number[]) => void;
  onUpdateNbEnfants: (roomIndex: number, nbEnfants: number) => void;
  onUpdateEnfantAge: (roomIndex: number, ageIndex: number, age: number) => void;
  onSearchTriggeredChange: (triggered: boolean) => void;
}

/**
 * HotelSearchForm component
 * Handles hotel search form with location, dates, and room configuration
 */
export const HotelSearchForm: React.FC<HotelSearchFormProps> = ({
  country,
  city,
  checkIn,
  checkOut,
  rooms,
  numberOfNights,
  isSearching,
  onCountryChange,
  onCityChange,
  onCheckInChange,
  onCheckOutChange,
  onSearch,
  onAddRoom,
  onRemoveRoom,
  onUpdateRoom,
  onUpdateNbEnfants,
  onUpdateEnfantAge,
  onSearchTriggeredChange,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
      <form onSubmit={onSearch} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Country */}
          <Input
            label="Country"
            type="text"
            value={country}
            onChange={e => onCountryChange(e.target.value)}
            placeholder="e.g., France"
          />

          {/* City */}
          <Input
            label="City"
            type="text"
            value={city}
            onChange={e => onCityChange(e.target.value)}
            placeholder="e.g., Paris"
          />

          {/* Check-in Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="inline h-4 w-4 mr-1" />
              Check-in Date
            </label>
            <input
              type="date"
              value={checkIn}
              min={getTodayDate()}
              onChange={e => {
                onCheckInChange(e.target.value);
                onSearchTriggeredChange(false);
              }}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Check-out Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="inline h-4 w-4 mr-1" />
              Check-out Date
            </label>
            <input
              type="date"
              value={checkOut}
              min={checkIn || getTodayDate()}
              onChange={e => {
                onCheckOutChange(e.target.value);
                onSearchTriggeredChange(false);
              }}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>

        {/* Number of Nights Display */}
        {checkIn && checkOut && numberOfNights > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <p className="text-sm text-blue-800">
              <strong>{numberOfNights}</strong> night{numberOfNights !== 1 ? 's' : ''} selected
            </p>
          </div>
        )}

        {/* Rooms Configuration */}
        <RoomConfiguration
          rooms={rooms}
          onAddRoom={onAddRoom}
          onRemoveRoom={onRemoveRoom}
          onUpdateRoom={onUpdateRoom}
          onUpdateNbEnfants={onUpdateNbEnfants}
          onUpdateEnfantAge={onUpdateEnfantAge}
        />

        {/* Search Button */}
        <Button
          type="submit"
          isLoading={isSearching}
          className="w-full sm:w-auto flex items-center justify-center gap-2"
        >
          <Search className="h-4 w-4" />
          {isSearching ? 'Searching...' : 'Search Hotels'}
        </Button>
      </form>
    </div>
  );
};

