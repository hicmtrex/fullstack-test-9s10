import mysql from 'mysql2/promise';
import { getConnectionPool } from '../../database/connection';
import { Facture, FactureWithDetails, FactureQueryParams } from './facture.types';
import { FACTURE_TABLE_NAME, FACTURE_COLUMNS } from './facture.model';

/**
 * Facture Repository
 * Handles all database operations for factures (bills)
 * Implements Repository Pattern for data access layer
 */
export class FactureRepository {
  private pool: mysql.Pool;

  constructor() {
    this.pool = getConnectionPool();
  }

  /**
   * Find all factures with optional pagination and filtering
   * @param params - Query parameters for filtering and pagination
   * @returns Promise<FactureWithDetails[]> - Array of factures with reservation and hotel details
   */
  async findAll(params: FactureQueryParams = {}): Promise<FactureWithDetails[]> {
    const { page = 1, limit = 50, status, reservationId } = params;
    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        f.${FACTURE_COLUMNS.ID},
        f.${FACTURE_COLUMNS.RESERVATION_ID},
        f.${FACTURE_COLUMNS.TOTAL_AMOUNT},
        f.${FACTURE_COLUMNS.STATUS},
        f.${FACTURE_COLUMNS.CREATED_AT},
        f.${FACTURE_COLUMNS.UPDATED_AT},
        r.id as reservation_id,
        r.check_in,
        r.check_out,
        r.number_of_nights,
        r.total_price,
        r.status as reservation_status,
        h.id as hotel_id,
        h.name as hotel_name,
        h.city as hotel_city,
        h.country as hotel_country,
        h.address as hotel_address
      FROM ${FACTURE_TABLE_NAME} f
      INNER JOIN reservations r ON f.${FACTURE_COLUMNS.RESERVATION_ID} = r.id
      INNER JOIN hotels h ON r.hotel_id = h.id
      WHERE 1=1
    `;
    const queryParams: unknown[] = [];

    if (status) {
      query += ` AND f.${FACTURE_COLUMNS.STATUS} = ?`;
      queryParams.push(status);
    }

    if (reservationId) {
      query += ` AND f.${FACTURE_COLUMNS.RESERVATION_ID} = ?`;
      queryParams.push(reservationId);
    }

    query += ` ORDER BY f.${FACTURE_COLUMNS.CREATED_AT} DESC LIMIT ? OFFSET ?`;
    queryParams.push(limit, offset);

    const [rows] = await this.pool.query<mysql.RowDataPacket[]>(query, queryParams);

    return rows.map(row => ({
      id: row[FACTURE_COLUMNS.ID],
      reservation_id: row[FACTURE_COLUMNS.RESERVATION_ID],
      total_amount: parseFloat(row[FACTURE_COLUMNS.TOTAL_AMOUNT]),
      status: row[FACTURE_COLUMNS.STATUS],
      created_at: row[FACTURE_COLUMNS.CREATED_AT],
      updated_at: row[FACTURE_COLUMNS.UPDATED_AT],
      reservation: {
        id: row.reservation_id,
        check_in: row.check_in,
        check_out: row.check_out,
        number_of_nights: row.number_of_nights,
        total_price: parseFloat(row.total_price),
        status: row.reservation_status,
      },
      hotel: {
        id: row.hotel_id,
        name: row.hotel_name,
        city: row.hotel_city,
        country: row.hotel_country,
        address: row.hotel_address,
      },
    })) as FactureWithDetails[];
  }

  /**
   * Find a facture by ID with reservation and hotel details
   * @param id - Facture ID
   * @returns Promise<FactureWithDetails | null> - Facture with details or null if not found
   */
  async findById(id: number): Promise<FactureWithDetails | null> {
    const query = `
      SELECT 
        f.${FACTURE_COLUMNS.ID},
        f.${FACTURE_COLUMNS.RESERVATION_ID},
        f.${FACTURE_COLUMNS.TOTAL_AMOUNT},
        f.${FACTURE_COLUMNS.STATUS},
        f.${FACTURE_COLUMNS.CREATED_AT},
        f.${FACTURE_COLUMNS.UPDATED_AT},
        r.id as reservation_id,
        r.check_in,
        r.check_out,
        r.number_of_nights,
        r.total_price,
        r.status as reservation_status,
        h.id as hotel_id,
        h.name as hotel_name,
        h.city as hotel_city,
        h.country as hotel_country,
        h.address as hotel_address
      FROM ${FACTURE_TABLE_NAME} f
      INNER JOIN reservations r ON f.${FACTURE_COLUMNS.RESERVATION_ID} = r.id
      INNER JOIN hotels h ON r.hotel_id = h.id
      WHERE f.${FACTURE_COLUMNS.ID} = ?
    `;

    const [rows] = await this.pool.query<mysql.RowDataPacket[]>(query, [id]);

    if (Array.isArray(rows) && rows.length > 0) {
      const row = rows[0];
      return {
        id: row[FACTURE_COLUMNS.ID],
        reservation_id: row[FACTURE_COLUMNS.RESERVATION_ID],
        total_amount: parseFloat(row[FACTURE_COLUMNS.TOTAL_AMOUNT]),
        status: row[FACTURE_COLUMNS.STATUS],
        created_at: row[FACTURE_COLUMNS.CREATED_AT],
        updated_at: row[FACTURE_COLUMNS.UPDATED_AT],
        reservation: {
          id: row.reservation_id,
          check_in: row.check_in,
          check_out: row.check_out,
          number_of_nights: row.number_of_nights,
          total_price: parseFloat(row.total_price),
          status: row.reservation_status,
        },
        hotel: {
          id: row.hotel_id,
          name: row.hotel_name,
          city: row.hotel_city,
          country: row.hotel_country,
          address: row.hotel_address,
        },
      } as FactureWithDetails;
    }
    return null;
  }

  /**
   * Find facture by reservation ID
   * @param reservationId - Reservation ID
   * @param connection - Optional database connection (for use within transaction)
   * @returns Promise<Facture | null> - Facture or null if not found
   */
  async findByReservationId(
    reservationId: number,
    connection?: mysql.PoolConnection
  ): Promise<Facture | null> {
    const query = `SELECT * FROM ${FACTURE_TABLE_NAME} WHERE ${FACTURE_COLUMNS.RESERVATION_ID} = ?`;
    const db = connection || this.pool;
    const [rows] = await db.query<mysql.RowDataPacket[]>(query, [reservationId]);

    if (Array.isArray(rows) && rows.length > 0) {
      return rows[0] as Facture;
    }
    return null;
  }

  /**
   * Create a new facture
   * @param factureData - Facture data
   * @param connection - Optional database connection (for transaction)
   * @returns Promise<Facture> - Created facture
   */
  async create(
    factureData: Omit<Facture, 'id' | 'created_at' | 'updated_at'>,
    connection?: mysql.PoolConnection
  ): Promise<Facture> {
    const query = `
      INSERT INTO ${FACTURE_TABLE_NAME} 
      (${FACTURE_COLUMNS.RESERVATION_ID}, ${FACTURE_COLUMNS.TOTAL_AMOUNT}, ${FACTURE_COLUMNS.STATUS})
      VALUES (?, ?, ?)
    `;
    const params = [
      factureData.reservation_id,
      factureData.total_amount,
      factureData.status || 'pending',
    ];

    const db = connection || this.pool;
    const [result] = await db.query<mysql.ResultSetHeader>(query, params);

    // Build facture object directly from insert result (don't query again within transaction)
    const createdFacture: Facture = {
      id: result.insertId,
      reservation_id: factureData.reservation_id,
      total_amount: factureData.total_amount,
      status: factureData.status || 'pending',
      created_at: new Date(),
      updated_at: undefined,
    };

    return createdFacture;
  }

  /**
   * Update a facture
   * @param id - Facture ID
   * @param factureData - Partial facture data to update
   * @param connection - Optional database connection (for use within transaction)
   * @returns Promise<Facture | null> - Updated facture or null if not found
   */
  async update(
    id: number,
    factureData: Partial<Omit<Facture, 'id' | 'created_at' | 'updated_at'>>,
    connection?: mysql.PoolConnection
  ): Promise<Facture | null> {
    const fields: string[] = [];
    const params: unknown[] = [];

    if (factureData.reservation_id !== undefined) {
      fields.push(`${FACTURE_COLUMNS.RESERVATION_ID} = ?`);
      params.push(factureData.reservation_id);
    }
    if (factureData.total_amount !== undefined) {
      fields.push(`${FACTURE_COLUMNS.TOTAL_AMOUNT} = ?`);
      params.push(factureData.total_amount);
    }
    if (factureData.status !== undefined) {
      fields.push(`${FACTURE_COLUMNS.STATUS} = ?`);
      params.push(factureData.status);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    params.push(id);
    const query = `UPDATE ${FACTURE_TABLE_NAME} SET ${fields.join(', ')} WHERE ${FACTURE_COLUMNS.ID} = ?`;

    const db = connection || this.pool;
    await db.query(query, params);

    // Query the updated facture (use same connection if in transaction)
    // Note: findById doesn't support connection parameter, so we'll query directly
    const selectQuery = `SELECT * FROM ${FACTURE_TABLE_NAME} WHERE ${FACTURE_COLUMNS.ID} = ?`;
    const [rows] = await db.query<mysql.RowDataPacket[]>(selectQuery, [id]);

    if (Array.isArray(rows) && rows.length > 0) {
      const row = rows[0];
      return {
        id: row[FACTURE_COLUMNS.ID],
        reservation_id: row[FACTURE_COLUMNS.RESERVATION_ID],
        total_amount: parseFloat(row[FACTURE_COLUMNS.TOTAL_AMOUNT]),
        status: row[FACTURE_COLUMNS.STATUS],
        created_at: row[FACTURE_COLUMNS.CREATED_AT],
        updated_at: row[FACTURE_COLUMNS.UPDATED_AT] || undefined,
      } as Facture;
    }

    return null;
  }

  /**
   * Delete a facture
   * @param id - Facture ID
   * @returns Promise<boolean> - True if deleted, false if not found
   */
  async delete(id: number): Promise<boolean> {
    const query = `DELETE FROM ${FACTURE_TABLE_NAME} WHERE ${FACTURE_COLUMNS.ID} = ?`;
    const [result] = await this.pool.query<mysql.ResultSetHeader>(query, [id]);
    return result.affectedRows > 0;
  }

  /**
   * Count total factures matching criteria
   * @param params - Query parameters for filtering
   * @returns Promise<number> - Total count
   */
  async count(params: Omit<FactureQueryParams, 'page' | 'limit'> = {}): Promise<number> {
    const { status, reservationId } = params;

    let query = `SELECT COUNT(*) as total FROM ${FACTURE_TABLE_NAME} WHERE 1=1`;
    const queryParams: unknown[] = [];

    if (status) {
      query += ` AND ${FACTURE_COLUMNS.STATUS} = ?`;
      queryParams.push(status);
    }

    if (reservationId) {
      query += ` AND ${FACTURE_COLUMNS.RESERVATION_ID} = ?`;
      queryParams.push(reservationId);
    }

    const [rows] = await this.pool.query<mysql.RowDataPacket[]>(query, queryParams);
    return (rows[0] as { total: number }).total;
  }
}
