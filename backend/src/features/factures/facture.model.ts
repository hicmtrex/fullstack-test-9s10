/**
 * Facture model constants
 * Defines table name and column names for the factures table
 */

export const FACTURE_TABLE_NAME = 'factures';

/**
 * Facture table column names
 */
export const FACTURE_COLUMNS = {
  ID: 'id',
  RESERVATION_ID: 'reservation_id',
  TOTAL_AMOUNT: 'total_amount',
  STATUS: 'status',
  CREATED_AT: 'created_at',
  UPDATED_AT: 'updated_at',
} as const;
