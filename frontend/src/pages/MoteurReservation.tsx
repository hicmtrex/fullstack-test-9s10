import React, { useState, useMemo, useCallback } from 'react';
import { useHotels } from '@/features/hotels/hooks/useHotels';
import { useHotelSearch as useHotelSearchMutation } from '@/features/hotels/hooks/useHotelSearch';
import { useCreateReservation } from '@/features/reservations/hooks/useReservations';
import { HotelCardSkeleton } from '@/features/hotels/components';
import { Button } from '@/shared/components/Button';
import { Input } from '@/shared/components/Input';
import { useNotification } from '@/shared/providers/NotificationProvider';
import { calculateNights, getTodayDate, validateDateRange } from '@/shared/utils/dateUtils';
import { formatCurrency } from '@/shared/utils/formatters';
import { Search, Plus, Trash2, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * Room configuration interface
 */
interface Room {
  nb_adults: number;
  nb_enfants: number;
  ages_enfants: number[];
}

/**
 * MoteurReservation page component
 * Hotel search and reservation booking engine
 * Fixed: Removed infinite loop, optimized rerenders, added React Query
 */
function MoteurReservation(): JSX.Element {
  const navigate = useNavigate();
  const { showError } = useNotification();

  // Form state
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [checkIn, setCheckIn] = useState(getTodayDate());
  const [checkOut, setCheckOut] = useState('');
  const [rooms, setRooms] = useState<Room[]>([{ nb_adults: 1, nb_enfants: 0, ages_enfants: [] }]);
  const [searchTriggered, setSearchTriggered] = useState(false);
  const [reservingHotelId, setReservingHotelId] = useState<number | null>(null);

  // Fetch all hotels for dropdown
  const { data: hotelsData, isLoading: hotelsLoading } = useHotels();

  // Calculate number of nights (memoized to prevent unnecessary recalculations)
  const numberOfNights = useMemo(() => {
    if (!checkIn || !checkOut) return 1;
    return calculateNights(checkIn, checkOut);
  }, [checkIn, checkOut]);

  // Hotel search mutation
  const searchMutation = useHotelSearchMutation();

  // Create reservation mutation
  const createReservation = useCreateReservation();

  /**
   * Handle search form submission
   */
  const handleSearch = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Validate dates
      if (!checkIn || !checkOut) {
        showError('Please select both check-in and check-out dates');
        return;
      }

      if (!validateDateRange(checkIn, checkOut)) {
        showError('Check-out date must be after check-in date');
        return;
      }

      setSearchTriggered(true);

      try {
        await searchMutation.mutateAsync({
          country: country || undefined,
          city: city || undefined,
          checkIn: checkIn || undefined,
          checkOut: checkOut || undefined,
          numberOfNights: numberOfNights > 0 ? numberOfNights : undefined,
        });
      } catch (error) {
        showError('Failed to search hotels');
      }
    },
    [checkIn, checkOut, country, city, numberOfNights, searchMutation, showError]
  );

  /**
   * Handle reservation creation
   * Tracks which hotel is being reserved for individual loading state
   */
  const handleReserve = useCallback(
    async (hotelId: number) => {
      if (!checkIn || !checkOut) {
        showError('Please select check-in and check-out dates');
        return;
      }

      if (!validateDateRange(checkIn, checkOut)) {
        showError('Check-out date must be after check-in date');
        return;
      }

      // Validate rooms
      for (const room of rooms) {
        if (room.nb_adults < 1) {
          showError('Each room must have at least 1 adult');
          return;
        }
        if (room.nb_enfants > 0 && room.ages_enfants.length !== room.nb_enfants) {
          showError('Please specify ages for all children');
          return;
        }
      }

      setReservingHotelId(hotelId);
      try {
        await createReservation.mutateAsync({
          hotelId,
          checkIn,
          checkOut,
          rooms: rooms.map(room => {
            // Ensure ages_enfants is always an array: empty if no children, or the provided ages if children exist
            const ages_enfants =
              room.nb_enfants > 0 && room.ages_enfants.length === room.nb_enfants
                ? room.ages_enfants
                : [];

            return {
              nb_adults: room.nb_adults,
              nb_enfants: room.nb_enfants,
              ages_enfants,
            };
          }),
        });

        // Success notification is handled in the hook
        navigate('/reservations');
      } catch (error) {
        // Error notification is handled in the hook
      } finally {
        setReservingHotelId(null);
      }
    },
    [checkIn, checkOut, rooms, createReservation, showError, navigate]
  );

  /**
   * Add a new room
   */
  const addRoom = useCallback(() => {
    setRooms(prev => [...prev, { nb_adults: 1, nb_enfants: 0, ages_enfants: [] }]);
  }, []);

  /**
   * Remove a room
   */
  const removeRoom = useCallback((index: number) => {
    setRooms(prev => prev.filter((_, i) => i !== index));
  }, []);

  /**
   * Update room field
   */
  const updateRoom = useCallback((index: number, field: keyof Room, value: number | number[]) => {
    setRooms(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  }, []);

  /**
   * Update number of children and adjust ages array
   */
  const updateNbEnfants = useCallback((roomIndex: number, nbEnfants: number) => {
    setRooms(prev => {
      const updated = [...prev];
      const currentAges = updated[roomIndex].ages_enfants;
      const newAges = Array(nbEnfants)
        .fill(0)
        .map((_, i) => (i < currentAges.length ? currentAges[i] : 0));
      updated[roomIndex] = {
        ...updated[roomIndex],
        nb_enfants: nbEnfants,
        ages_enfants: newAges,
      };
      return updated;
    });
  }, []);

  /**
   * Update child age
   */
  const updateEnfantAge = useCallback((roomIndex: number, ageIndex: number, age: number) => {
    setRooms(prev => {
      const updated = [...prev];
      updated[roomIndex].ages_enfants[ageIndex] = age;
      return updated;
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Hotel Reservation Engine
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Search for hotels and create reservations
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Country */}
              <Input
                label="Country"
                type="text"
                value={country}
                onChange={e => setCountry(e.target.value)}
                placeholder="e.g., France"
              />

              {/* City */}
              <Input
                label="City"
                type="text"
                value={city}
                onChange={e => setCity(e.target.value)}
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
                    setCheckIn(e.target.value);
                    setSearchTriggered(false);
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
                    setCheckOut(e.target.value);
                    setSearchTriggered(false);
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
            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Room Configuration</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addRoom}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Room
                </Button>
              </div>

              <div className="space-y-4">
                {rooms.map((room, roomIndex) => (
                  <div key={roomIndex} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-gray-900">Room {roomIndex + 1}</h4>
                      {rooms.length > 1 && (
                        <Button
                          type="button"
                          variant="danger"
                          size="sm"
                          onClick={() => removeRoom(roomIndex)}
                          className="flex items-center gap-2"
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Number of Adults */}
                      <Input
                        label="Number of Adults"
                        type="number"
                        min="1"
                        value={room.nb_adults}
                        onChange={e =>
                          updateRoom(roomIndex, 'nb_adults', parseInt(e.target.value) || 1)
                        }
                        required
                      />

                      {/* Number of Children */}
                      <Input
                        label="Number of Children"
                        type="number"
                        min="0"
                        value={room.nb_enfants}
                        onChange={e => updateNbEnfants(roomIndex, parseInt(e.target.value) || 0)}
                      />
                    </div>

                    {/* Children Ages */}
                    {room.nb_enfants > 0 && (
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Children Ages
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {room.ages_enfants.map((age, ageIndex) => (
                            <Input
                              key={ageIndex}
                              type="number"
                              min="0"
                              max="17"
                              value={age}
                              onChange={e =>
                                updateEnfantAge(roomIndex, ageIndex, parseInt(e.target.value) || 0)
                              }
                              placeholder={`Age ${ageIndex + 1}`}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Search Button */}
            <Button
              type="submit"
              isLoading={searchMutation.isPending}
              className="w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <Search className="h-4 w-4" />
              {searchMutation.isPending ? 'Searching...' : 'Search Hotels'}
            </Button>
          </form>
        </div>

        {/* Search Results */}
        {searchTriggered && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Search Results</h2>

            {searchMutation.isPending ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <HotelCardSkeleton key={i} />
                ))}
              </div>
            ) : searchMutation.isError ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <p className="text-red-800 font-medium">Failed to search hotels</p>
                <p className="text-red-600 text-sm mt-2">
                  {searchMutation.error instanceof Error
                    ? searchMutation.error.message
                    : 'Unknown error'}
                </p>
              </div>
            ) : searchMutation.data && searchMutation.data.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <p className="text-gray-500 text-lg">No hotels found</p>
                <p className="text-gray-400 text-sm mt-2">Try adjusting your search criteria</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchMutation.data?.map(hotel => (
                  <div
                    key={hotel.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                  >
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{hotel.name}</h3>
                      <p className="text-sm text-gray-600 mb-1">{hotel.address}</p>
                      <p className="text-sm text-gray-600 mb-4">
                        {hotel.city}, {hotel.country}
                      </p>
                      <div className="space-y-2 mb-4">
                        <p className="text-sm text-gray-600">
                          Price per night:{' '}
                          <span className="font-semibold">
                            {formatCurrency(hotel.price_per_night, 'EUR', 'en-US')}
                          </span>
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          Total for {numberOfNights} night{numberOfNights !== 1 ? 's' : ''}:{' '}
                          {formatCurrency(
                            hotel.totalPrice || hotel.price_per_night * numberOfNights,
                            'EUR',
                            'en-US'
                          )}
                        </p>
                      </div>
                      <Button
                        onClick={() => handleReserve(hotel.id)}
                        isLoading={reservingHotelId === hotel.id}
                        disabled={reservingHotelId !== null && reservingHotelId !== hotel.id}
                        className="w-full"
                      >
                        Reserve Now
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Initial State - Show all hotels */}
        {!searchTriggered && hotelsData && hotelsData.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Hotels</h2>
            {hotelsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <HotelCardSkeleton key={i} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hotelsData.map(hotel => (
                  <div
                    key={hotel.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{hotel.name}</h3>
                      <p className="text-sm text-gray-600 mb-1">{hotel.address || ''}</p>
                      <p className="text-sm text-gray-600 mb-4">
                        {hotel.city}, {hotel.country}
                      </p>
                      <p className="text-lg font-semibold text-gray-900">
                        {formatCurrency(hotel.price_per_night, 'EUR', 'en-US')} / night
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default MoteurReservation;
