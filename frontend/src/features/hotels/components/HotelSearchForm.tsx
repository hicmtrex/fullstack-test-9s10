import React from 'react';
import { Search, Calendar } from 'lucide-react';
import { Button } from '@/shared/components/Button';
import { Input } from '@/shared/components/Input';
import { Select } from '@/shared/components/Select';
import { RoomConfiguration, type Room } from '@/features/reservations/components/RoomConfiguration';
import { getTodayDate } from '@/shared/utils/dateUtils';

/**
 * List of available countries (extracted from hotel data)
 */
const COUNTRIES = [
  { value: '', label: 'All Countries' },
  { value: 'Austria', label: 'Austria' },
  { value: 'Belgium', label: 'Belgium' },
  { value: 'Croatia', label: 'Croatia' },
  { value: 'Czech Republic', label: 'Czech Republic' },
  { value: 'Denmark', label: 'Denmark' },
  { value: 'France', label: 'France' },
  { value: 'Germany', label: 'Germany' },
  { value: 'Greece', label: 'Greece' },
  { value: 'Hungary', label: 'Hungary' },
  { value: 'Ireland', label: 'Ireland' },
  { value: 'Italy', label: 'Italy' },
  { value: 'Malta', label: 'Malta' },
  { value: 'Netherlands', label: 'Netherlands' },
  { value: 'Norway', label: 'Norway' },
  { value: 'Poland', label: 'Poland' },
  { value: 'Portugal', label: 'Portugal' },
  { value: 'Scotland', label: 'Scotland' },
  { value: 'Spain', label: 'Spain' },
  { value: 'Sweden', label: 'Sweden' },
  { value: 'Switzerland', label: 'Switzerland' },
  { value: 'Turkey', label: 'Turkey' },
  { value: 'United Arab Emirates', label: 'United Arab Emirates' },
  { value: 'United Kingdom', label: 'United Kingdom' },
  { value: 'United States', label: 'United States' },
  { value: 'Canada', label: 'Canada' },
  { value: 'Mexico', label: 'Mexico' },
  { value: 'Brazil', label: 'Brazil' },
  { value: 'Argentina', label: 'Argentina' },
  { value: 'Chile', label: 'Chile' },
  { value: 'Peru', label: 'Peru' },
  { value: 'Colombia', label: 'Colombia' },
  { value: 'Venezuela', label: 'Venezuela' },
  { value: 'Tunisia', label: 'Tunisia' },
  { value: 'Morocco', label: 'Morocco' },
  { value: 'Algeria', label: 'Algeria' },
  { value: 'Egypt', label: 'Egypt' },
  { value: 'Nigeria', label: 'Nigeria' },
  { value: 'Kenya', label: 'Kenya' },
  { value: 'South Africa', label: 'South Africa' },
  { value: 'Nigeria', label: 'Nigeria' },
  { value: 'Kenya', label: 'Kenya' },
  { value: 'South Africa', label: 'South Africa' },
].sort((a, b) => {
  // Sort alphabetically, but keep "All Countries" first
  if (a.value === '') return -1;
  if (b.value === '') return 1;
  return a.label.localeCompare(b.label);
});

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
          <Select
            label="Country"
            value={country}
            onChange={e => onCountryChange(e.target.value)}
            options={COUNTRIES}
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
