/**
 * Reservation model constants
 * Defines table name and column names for the reservations table
 */

export const RESERVATION_TABLE_NAME = 'reservations';
export const ROOM_TABLE_NAME = 'rooms';

/**
 * Reservation table column names
 */
export const RESERVATION_COLUMNS = {
  ID: 'id',
  HOTEL_ID: 'hotel_id',
  CHECK_IN: 'check_in',
  CHECK_OUT: 'check_out',
  NUMBER_OF_NIGHTS: 'number_of_nights',
  TOTAL_PRICE: 'total_price',
  STATUS: 'status',
  CREATED_AT: 'created_at',
  UPDATED_AT: 'updated_at',
} as const;

/**
 * Room table column names
 */
export const ROOM_COLUMNS = {
  ID: 'id',
  RESERVATION_ID: 'reservation_id',
  NB_ADULTS: 'nb_adults',
  NB_ENFANTS: 'nb_enfants',
  AGES_ENFANTS: 'ages_enfants',
  CREATED_AT: 'created_at',
} as const;
