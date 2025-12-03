import React, { useState, useMemo, useCallback } from 'react';
import { useHotelsInfinite } from '@/features/hotels/hooks/useHotels';
import { useHotelSearch } from '@/features/hotels/hooks/useHotelSearch';
import {
  HotelCard,
  HotelCardSkeleton,
  HotelSearchForm,
  HotelSearchResults,
} from '@/features/hotels/components';
import { useReservationHandler } from '@/features/reservations/hooks/useReservationHandler';
import { useNotification } from '@/shared/providers/NotificationProvider';
import { calculateNights, getTodayDate, validateDateRange } from '@/shared/utils/dateUtils';
import { Button } from '@/shared/components/Button';
import type { Room } from '@/features/reservations/components/RoomConfiguration';

/**
 * MoteurReservation page component
 * Hotel search and reservation booking engine
 * Optimized with pagination and React Query caching
 */
function MoteurReservation(): JSX.Element {
  const { showError } = useNotification();
  const { handleReserve } = useReservationHandler();

  // Form state
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [checkIn, setCheckIn] = useState(getTodayDate());
  const [checkOut, setCheckOut] = useState('');
  const [rooms, setRooms] = useState<Room[]>([{ nb_adults: 1, nb_enfants: 0, ages_enfants: [] }]);
  const [searchTriggered, setSearchTriggered] = useState(false);
  const [reservingHotelId, setReservingHotelId] = useState<number | null>(null);

  // Calculate number of nights (memoized to prevent unnecessary recalculations)
  const numberOfNights = useMemo(() => {
    if (!checkIn || !checkOut) return 1;
    return calculateNights(checkIn, checkOut);
  }, [checkIn, checkOut]);

  // Fetch hotels with infinite scroll (paginated, 12 per page)
  const {
    data: hotelsInfiniteData,
    isLoading: hotelsLoading,
    fetchNextPage: fetchNextHotels,
    hasNextPage: hasMoreHotels,
    isFetchingNextPage: isLoadingMoreHotels,
  } = useHotelsInfinite(12);

  // Flatten paginated hotels data
  const hotelsData = useMemo(() => {
    try {
      if (!hotelsInfiniteData?.pages || !Array.isArray(hotelsInfiniteData.pages)) return [];
      const flattened = hotelsInfiniteData.pages.flatMap(page => {
        if (!page || typeof page !== 'object') return [];
        // Handle both paginated response and direct array
        if ('data' in page && Array.isArray(page.data)) {
          return page.data;
        }
        // If page itself is an array, return it
        if (Array.isArray(page)) {
          return page;
        }
        return [];
      });
      return Array.isArray(flattened) ? flattened : [];
    } catch (error) {
      console.error('Error flattening hotels data:', error);
      return [];
    }
  }, [hotelsInfiniteData]);

  // Hotel search with infinite scroll (only enabled when search is triggered)
  const searchCriteria = useMemo(
    () => ({
      country: country || undefined,
      city: city || undefined,
      checkIn: checkIn || undefined,
      checkOut: checkOut || undefined,
      numberOfNights: numberOfNights > 0 ? numberOfNights : undefined,
    }),
    [country, city, checkIn, checkOut, numberOfNights]
  );

  // Simple search query - just fetch and use data
  const {
    data: searchData,
    isLoading: isSearching,
    isError: isSearchError,
    error: searchError,
  } = useHotelSearch(searchCriteria, searchTriggered);

  // Simple extraction - just get the data array from paginated response
  const searchResults = useMemo(() => {
    if (!searchData) return [];
    // Handle paginated response: { data: [...], total, limit, offset, hasMore }
    if (searchData.data && Array.isArray(searchData.data)) {
      return searchData.data;
    }
    // Fallback: if response is directly an array (shouldn't happen but handle it)
    if (Array.isArray(searchData)) {
      return searchData;
    }
    return [];
  }, [searchData]);

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
    },
    [checkIn, checkOut, showError]
  );

  /**
   * Handle reservation creation
   */
  const onReserve = useCallback(
    async (hotelId: number) => {
      await handleReserve(hotelId, checkIn, checkOut, rooms, setReservingHotelId);
    },
    [checkIn, checkOut, rooms, handleReserve]
  );

  /**
   * Room management functions
   */
  const addRoom = useCallback(() => {
    setRooms(prev => [...prev, { nb_adults: 1, nb_enfants: 0, ages_enfants: [] }]);
  }, []);

  const removeRoom = useCallback((index: number) => {
    setRooms(prev => prev.filter((_, i) => i !== index));
  }, []);

  const updateRoom = useCallback((index: number, field: keyof Room, value: number | number[]) => {
    setRooms(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  }, []);

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
        <HotelSearchForm
          country={country}
          city={city}
          checkIn={checkIn}
          checkOut={checkOut}
          rooms={rooms}
          numberOfNights={numberOfNights}
          isSearching={isSearching}
          onCountryChange={setCountry}
          onCityChange={setCity}
          onCheckInChange={setCheckIn}
          onCheckOutChange={setCheckOut}
          onSearch={handleSearch}
          onAddRoom={addRoom}
          onRemoveRoom={removeRoom}
          onUpdateRoom={updateRoom}
          onUpdateNbEnfants={updateNbEnfants}
          onUpdateEnfantAge={updateEnfantAge}
          onSearchTriggeredChange={setSearchTriggered}
        />

        {/* Search Results */}
        {searchTriggered && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Search Results</h2>
            <HotelSearchResults
              hotels={searchResults}
              numberOfNights={numberOfNights}
              reservingHotelId={reservingHotelId}
              isLoading={isSearching}
              isError={isSearchError}
              error={searchError as Error | null}
              onReserve={onReserve}
            />
          </div>
        )}

        {/* Initial State - Show paginated hotels */}
        {!searchTriggered && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Hotels</h2>
            {hotelsLoading && hotelsData.length === 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <HotelCardSkeleton key={i} />
                ))}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.isArray(hotelsData) && hotelsData.length > 0 ? (
                    hotelsData.map(hotel => (
                      <HotelCard
                        key={hotel.id}
                        hotel={{
                          ...hotel,
                          // Calculate total price for the default list using current dates
                          totalPrice:
                            hotel.price_per_night * (numberOfNights > 0 ? numberOfNights : 1),
                        }}
                        numberOfNights={numberOfNights > 0 ? numberOfNights : 1}
                        onReserve={onReserve}
                        isLoading={reservingHotelId === hotel.id}
                      />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12 text-gray-500">
                      No hotels available
                    </div>
                  )}
                </div>

                {/* Load More Button */}
                {hasMoreHotels && (
                  <div className="mt-6 text-center">
                    <Button
                      onClick={() => fetchNextHotels()}
                      isLoading={isLoadingMoreHotels}
                      variant="outline"
                      className="min-w-[200px]"
                    >
                      {isLoadingMoreHotels
                        ? 'Loading...'
                        : `Load More (${hotelsData.length} shown)`}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default MoteurReservation;
