import mysql from 'mysql2/promise';
import { getConnectionPool } from '../../database/connection';
import {
  Reservation,
  ReservationWithDetails,
  Room,
  ReservationQueryParams,
} from './reservation.types';
import {
  RESERVATION_TABLE_NAME,
  ROOM_TABLE_NAME,
  RESERVATION_COLUMNS,
  ROOM_COLUMNS,
} from './reservation.model';

/**
 * Reservation Repository
 * Handles all database operations for reservations and rooms
 * Implements Repository Pattern for data access layer
 */
export class ReservationRepository {
  private pool: mysql.Pool;

  constructor() {
    this.pool = getConnectionPool();
  }

  /**
   * Find all reservations with optional pagination and filtering
   * @param params - Query parameters for filtering and pagination
   * @returns Promise<ReservationWithDetails[]> - Array of reservations with hotel details
   */
  async findAll(params: ReservationQueryParams = {}): Promise<ReservationWithDetails[]> {
    const { page = 1, limit = 50, status, hotelId, checkInFrom, checkInTo } = params;
    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        r.${RESERVATION_COLUMNS.ID},
        r.${RESERVATION_COLUMNS.HOTEL_ID},
        r.${RESERVATION_COLUMNS.CHECK_IN},
        r.${RESERVATION_COLUMNS.CHECK_OUT},
        r.${RESERVATION_COLUMNS.NUMBER_OF_NIGHTS},
        r.${RESERVATION_COLUMNS.TOTAL_PRICE},
        r.${RESERVATION_COLUMNS.STATUS},
        r.${RESERVATION_COLUMNS.CREATED_AT},
        r.${RESERVATION_COLUMNS.UPDATED_AT},
        h.name as hotel_name,
        h.city as hotel_city,
        h.country as hotel_country,
        h.address as hotel_address,
        h.price_per_night as hotel_price_per_night
      FROM ${RESERVATION_TABLE_NAME} r
      INNER JOIN hotels h ON r.${RESERVATION_COLUMNS.HOTEL_ID} = h.id
      WHERE 1=1
    `;
    const queryParams: unknown[] = [];

    if (status) {
      query += ` AND r.${RESERVATION_COLUMNS.STATUS} = ?`;
      queryParams.push(status);
    }

    if (hotelId) {
      query += ` AND r.${RESERVATION_COLUMNS.HOTEL_ID} = ?`;
      queryParams.push(hotelId);
    }

    if (checkInFrom) {
      query += ` AND r.${RESERVATION_COLUMNS.CHECK_IN} >= ?`;
      queryParams.push(checkInFrom);
    }

    if (checkInTo) {
      query += ` AND r.${RESERVATION_COLUMNS.CHECK_IN} <= ?`;
      queryParams.push(checkInTo);
    }

    query += ` ORDER BY r.${RESERVATION_COLUMNS.CREATED_AT} DESC LIMIT ? OFFSET ?`;
    queryParams.push(limit, offset);

    const [rows] = await this.pool.query<mysql.RowDataPacket[]>(query, queryParams);
    return rows as ReservationWithDetails[];
  }

  /**
   * Find a reservation by ID with hotel details
   * @param id - Reservation ID
   * @returns Promise<ReservationWithDetails | null> - Reservation with details or null if not found
   */
  async findById(id: number): Promise<ReservationWithDetails | null> {
    const query = `
      SELECT 
        r.${RESERVATION_COLUMNS.ID},
        r.${RESERVATION_COLUMNS.HOTEL_ID},
        r.${RESERVATION_COLUMNS.CHECK_IN},
        r.${RESERVATION_COLUMNS.CHECK_OUT},
        r.${RESERVATION_COLUMNS.NUMBER_OF_NIGHTS},
        r.${RESERVATION_COLUMNS.TOTAL_PRICE},
        r.${RESERVATION_COLUMNS.STATUS},
        r.${RESERVATION_COLUMNS.CREATED_AT},
        r.${RESERVATION_COLUMNS.UPDATED_AT},
        h.name as hotel_name,
        h.city as hotel_city,
        h.country as hotel_country,
        h.address as hotel_address,
        h.price_per_night as hotel_price_per_night
      FROM ${RESERVATION_TABLE_NAME} r
      INNER JOIN hotels h ON r.${RESERVATION_COLUMNS.HOTEL_ID} = h.id
      WHERE r.${RESERVATION_COLUMNS.ID} = ?
    `;

    const [rows] = await this.pool.query<mysql.RowDataPacket[]>(query, [id]);

    if (Array.isArray(rows) && rows.length > 0) {
      return rows[0] as ReservationWithDetails;
    }
    return null;
  }

  /**
   * Find all rooms for a reservation
   * @param reservationId - Reservation ID
   * @param connection - Optional database connection (for use within transaction)
   * @returns Promise<Room[]> - Array of rooms
   */
  async findRoomsByReservationId(
    reservationId: number,
    connection?: mysql.PoolConnection
  ): Promise<Room[]> {
    const query = `
      SELECT 
        ${ROOM_COLUMNS.ID},
        ${ROOM_COLUMNS.RESERVATION_ID},
        ${ROOM_COLUMNS.NB_ADULTS},
        ${ROOM_COLUMNS.NB_ENFANTS},
        ${ROOM_COLUMNS.AGES_ENFANTS},
        ${ROOM_COLUMNS.CREATED_AT}
      FROM ${ROOM_TABLE_NAME}
      WHERE ${ROOM_COLUMNS.RESERVATION_ID} = ?
      ORDER BY ${ROOM_COLUMNS.ID}
    `;

    const [rows] = connection
      ? await connection.query<mysql.RowDataPacket[]>(query, [reservationId])
      : await this.pool.query<mysql.RowDataPacket[]>(query, [reservationId]);

    return rows.map(row => ({
      id: row[ROOM_COLUMNS.ID],
      reservation_id: row[ROOM_COLUMNS.RESERVATION_ID],
      nb_adults: row[ROOM_COLUMNS.NB_ADULTS],
      nb_enfants: row[ROOM_COLUMNS.NB_ENFANTS],
      ages_enfants: JSON.parse(row[ROOM_COLUMNS.AGES_ENFANTS] || '[]'),
      created_at: row[ROOM_COLUMNS.CREATED_AT],
    })) as Room[];
  }

  /**
   * Create a new reservation (used within a transaction)
   * @param reservationData - Reservation data
   * @param connection - Database connection (for transaction)
   * @returns Promise<Reservation> - Created reservation
   */
  async create(
    reservationData: Omit<Reservation, 'id' | 'created_at' | 'updated_at'>,
    connection: mysql.PoolConnection
  ): Promise<Reservation> {
    const query = `
      INSERT INTO ${RESERVATION_TABLE_NAME} 
      (${RESERVATION_COLUMNS.HOTEL_ID}, ${RESERVATION_COLUMNS.CHECK_IN}, ${RESERVATION_COLUMNS.CHECK_OUT}, 
       ${RESERVATION_COLUMNS.NUMBER_OF_NIGHTS}, ${RESERVATION_COLUMNS.TOTAL_PRICE}, ${RESERVATION_COLUMNS.STATUS})
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const params = [
      reservationData.hotel_id,
      reservationData.check_in,
      reservationData.check_out,
      reservationData.number_of_nights,
      reservationData.total_price,
      reservationData.status || 'pending',
    ];

    const [result] = await connection.query<mysql.ResultSetHeader>(query, params);

    // Build reservation object directly from insert result (don't query again within transaction)
    const createdReservation: Reservation = {
      id: result.insertId,
      hotel_id: reservationData.hotel_id,
      check_in: reservationData.check_in,
      check_out: reservationData.check_out,
      number_of_nights: reservationData.number_of_nights,
      total_price: reservationData.total_price,
      status: reservationData.status || 'pending',
      created_at: new Date(),
      updated_at: undefined,
    };

    return createdReservation;
  }

  /**
   * Create rooms for a reservation (used within a transaction)
   * @param reservationId - Reservation ID
   * @param rooms - Array of room data
   * @param connection - Database connection (for transaction)
   * @returns Promise<void>
   */
  async createRooms(
    reservationId: number,
    rooms: Array<{ nb_adults: number; nb_enfants: number; ages_enfants?: number[] }>,
    connection: mysql.PoolConnection
  ): Promise<void> {
    if (rooms.length === 0) {
      return;
    }

    const query = `
      INSERT INTO ${ROOM_TABLE_NAME} 
      (${ROOM_COLUMNS.RESERVATION_ID}, ${ROOM_COLUMNS.NB_ADULTS}, ${ROOM_COLUMNS.NB_ENFANTS}, ${ROOM_COLUMNS.AGES_ENFANTS})
      VALUES ?
    `;

    const values = rooms.map(room => [
      reservationId,
      room.nb_adults,
      room.nb_enfants,
      JSON.stringify(room.ages_enfants || []),
    ]);

    await connection.query(query, [values]);
  }

  /**
   * Update a reservation
   * @param id - Reservation ID
   * @param reservationData - Partial reservation data to update
   * @returns Promise<Reservation | null> - Updated reservation or null if not found
   */
  async update(
    id: number,
    reservationData: Partial<Omit<Reservation, 'id' | 'created_at' | 'updated_at'>>
  ): Promise<Reservation | null> {
    const fields: string[] = [];
    const params: unknown[] = [];

    if (reservationData.hotel_id !== undefined) {
      fields.push(`${RESERVATION_COLUMNS.HOTEL_ID} = ?`);
      params.push(reservationData.hotel_id);
    }
    if (reservationData.check_in !== undefined) {
      fields.push(`${RESERVATION_COLUMNS.CHECK_IN} = ?`);
      params.push(reservationData.check_in);
    }
    if (reservationData.check_out !== undefined) {
      fields.push(`${RESERVATION_COLUMNS.CHECK_OUT} = ?`);
      params.push(reservationData.check_out);
    }
    if (reservationData.number_of_nights !== undefined) {
      fields.push(`${RESERVATION_COLUMNS.NUMBER_OF_NIGHTS} = ?`);
      params.push(reservationData.number_of_nights);
    }
    if (reservationData.total_price !== undefined) {
      fields.push(`${RESERVATION_COLUMNS.TOTAL_PRICE} = ?`);
      params.push(reservationData.total_price);
    }
    if (reservationData.status !== undefined) {
      fields.push(`${RESERVATION_COLUMNS.STATUS} = ?`);
      params.push(reservationData.status);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    params.push(id);
    const query = `UPDATE ${RESERVATION_TABLE_NAME} SET ${fields.join(', ')} WHERE ${RESERVATION_COLUMNS.ID} = ?`;

    await this.pool.query(query, params);
    return this.findById(id);
  }

  /**
   * Delete rooms for a reservation
   * @param reservationId - Reservation ID
   * @param connection - Optional database connection (for transaction)
   * @returns Promise<void>
   */
  async deleteRooms(reservationId: number, connection?: mysql.PoolConnection): Promise<void> {
    const query = `DELETE FROM ${ROOM_TABLE_NAME} WHERE ${ROOM_COLUMNS.RESERVATION_ID} = ?`;
    const db = connection || this.pool;
    await db.query(query, [reservationId]);
  }

  /**
   * Delete a reservation (cascade will handle rooms)
   * @param id - Reservation ID
   * @returns Promise<boolean> - True if deleted, false if not found
   */
  async delete(id: number): Promise<boolean> {
    const query = `DELETE FROM ${RESERVATION_TABLE_NAME} WHERE ${RESERVATION_COLUMNS.ID} = ?`;
    const [result] = await this.pool.query<mysql.ResultSetHeader>(query, [id]);
    return result.affectedRows > 0;
  }

  /**
   * Count total reservations matching criteria
   * @param params - Query parameters for filtering
   * @returns Promise<number> - Total count
   */
  async count(params: Omit<ReservationQueryParams, 'page' | 'limit'> = {}): Promise<number> {
    const { status, hotelId, checkInFrom, checkInTo } = params;

    let query = `SELECT COUNT(*) as total FROM ${RESERVATION_TABLE_NAME} WHERE 1=1`;
    const queryParams: unknown[] = [];

    if (status) {
      query += ` AND ${RESERVATION_COLUMNS.STATUS} = ?`;
      queryParams.push(status);
    }

    if (hotelId) {
      query += ` AND ${RESERVATION_COLUMNS.HOTEL_ID} = ?`;
      queryParams.push(hotelId);
    }

    if (checkInFrom) {
      query += ` AND ${RESERVATION_COLUMNS.CHECK_IN} >= ?`;
      queryParams.push(checkInFrom);
    }

    if (checkInTo) {
      query += ` AND ${RESERVATION_COLUMNS.CHECK_IN} <= ?`;
      queryParams.push(checkInTo);
    }

    const [rows] = await this.pool.query<mysql.RowDataPacket[]>(query, queryParams);
    return (rows[0] as { total: number }).total;
  }
}
