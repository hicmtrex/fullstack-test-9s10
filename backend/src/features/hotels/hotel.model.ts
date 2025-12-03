/**
 * Hotel database model
 * Defines the database schema and table structure for hotels
 */

export const HOTEL_TABLE_NAME = 'hotels';

/**
 * Hotel table columns
 */
export const HOTEL_COLUMNS = {
  ID: 'id',
  NAME: 'name',
  COUNTRY: 'country',
  CITY: 'city',
  ADDRESS: 'address',
  PRICE_PER_NIGHT: 'price_per_night',
  CREATED_AT: 'created_at',
  UPDATED_AT: 'updated_at',
} as const;

