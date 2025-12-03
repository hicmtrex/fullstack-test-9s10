import mysql from 'mysql2/promise';
import { getConnectionPool } from '../../database/connection';
import { Hotel, HotelSearchCriteria } from './hotel.types';
import { HOTEL_TABLE_NAME, HOTEL_COLUMNS } from './hotel.model';

/**
 * Hotel Repository
 * Handles all database operations for hotels
 * Implements Repository Pattern for data access layer
 */
export class HotelRepository {
  private pool: mysql.Pool;

  constructor() {
    this.pool = getConnectionPool();
  }

  /**
   * Find all hotels with pagination
   * @param limit - Optional limit for pagination
   * @param offset - Optional offset for pagination
   * @returns Promise<Hotel[]> - Array of hotels
   */
  async findAll(limit?: number, offset?: number): Promise<Hotel[]> {
    let query = `SELECT * FROM ${HOTEL_TABLE_NAME} ORDER BY ${HOTEL_COLUMNS.CREATED_AT} DESC`;
    const params: unknown[] = [];

    if (limit !== undefined) {
      query += ' LIMIT ?';
      params.push(limit);
      if (offset !== undefined) {
        query += ' OFFSET ?';
        params.push(offset);
      }
    }

    const [rows] = await this.pool.query<mysql.RowDataPacket[]>(query, params);
    return rows as Hotel[];
  }

  /**
   * Count total number of hotels
   * @returns Promise<number> - Total count of hotels
   */
  async countAll(): Promise<number> {
    const query = `SELECT COUNT(*) as total FROM ${HOTEL_TABLE_NAME}`;
    const [rows] = await this.pool.query<mysql.RowDataPacket[]>(query);
    return (rows[0] as { total: number }).total;
  }

  /**
   * Find hotel by ID
   * @param id - Hotel ID
   * @returns Promise<Hotel | null> - Hotel or null if not found
   */
  async findById(id: number): Promise<Hotel | null> {
    const query = `SELECT * FROM ${HOTEL_TABLE_NAME} WHERE ${HOTEL_COLUMNS.ID} = ?`;
    const [rows] = await this.pool.query<mysql.RowDataPacket[]>(query, [id]);

    if (Array.isArray(rows) && rows.length > 0) {
      return rows[0] as Hotel;
    }
    return null;
  }

  /**
   * Search hotels based on criteria
   * @param criteria - Search criteria
   * @returns Promise<Hotel[]> - Array of matching hotels
   */
  async search(criteria: HotelSearchCriteria): Promise<Hotel[]> {
    let query = `SELECT * FROM ${HOTEL_TABLE_NAME} WHERE 1=1`;
    const params: unknown[] = [];

    if (criteria.country) {
      query += ` AND ${HOTEL_COLUMNS.COUNTRY} = ?`;
      params.push(criteria.country);
    }

    if (criteria.city) {
      query += ` AND ${HOTEL_COLUMNS.CITY} = ?`;
      params.push(criteria.city);
    }

    if (criteria.hotelIds && criteria.hotelIds.length > 0) {
      query += ` AND ${HOTEL_COLUMNS.ID} IN (?)`;
      params.push(criteria.hotelIds);
    }

    const [rows] = await this.pool.query<mysql.RowDataPacket[]>(query, params);
    return rows as Hotel[];
  }

  /**
   * Create a new hotel
   * @param hotelData - Hotel data to create
   * @returns Promise<Hotel> - Created hotel
   */
  async create(hotelData: Omit<Hotel, 'id' | 'created_at' | 'updated_at'>): Promise<Hotel> {
    const query = `
      INSERT INTO ${HOTEL_TABLE_NAME} 
      (${HOTEL_COLUMNS.NAME}, ${HOTEL_COLUMNS.COUNTRY}, ${HOTEL_COLUMNS.CITY}, ${HOTEL_COLUMNS.ADDRESS}, ${HOTEL_COLUMNS.PRICE_PER_NIGHT}, ${HOTEL_COLUMNS.IMAGE_URL})
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const params = [
      hotelData.name,
      hotelData.country,
      hotelData.city,
      hotelData.address || null,
      hotelData.price_per_night,
      hotelData.image_url || null,
    ];

    const [result] = await this.pool.query<mysql.ResultSetHeader>(query, params);
    const createdHotel = await this.findById(result.insertId);

    if (!createdHotel) {
      throw new Error('Failed to retrieve created hotel');
    }

    return createdHotel;
  }

  /**
   * Update a hotel
   * @param id - Hotel ID
   * @param hotelData - Hotel data to update
   * @returns Promise<Hotel | null> - Updated hotel or null if not found
   */
  async update(
    id: number,
    hotelData: Partial<Omit<Hotel, 'id' | 'created_at' | 'updated_at'>>
  ): Promise<Hotel | null> {
    const fields: string[] = [];
    const params: unknown[] = [];

    if (hotelData.name !== undefined) {
      fields.push(`${HOTEL_COLUMNS.NAME} = ?`);
      params.push(hotelData.name);
    }
    if (hotelData.country !== undefined) {
      fields.push(`${HOTEL_COLUMNS.COUNTRY} = ?`);
      params.push(hotelData.country);
    }
    if (hotelData.city !== undefined) {
      fields.push(`${HOTEL_COLUMNS.CITY} = ?`);
      params.push(hotelData.city);
    }
    if (hotelData.address !== undefined) {
      fields.push(`${HOTEL_COLUMNS.ADDRESS} = ?`);
      params.push(hotelData.address);
    }
    if (hotelData.price_per_night !== undefined) {
      fields.push(`${HOTEL_COLUMNS.PRICE_PER_NIGHT} = ?`);
      params.push(hotelData.price_per_night);
    }
    if (hotelData.image_url !== undefined) {
      fields.push(`${HOTEL_COLUMNS.IMAGE_URL} = ?`);
      params.push(hotelData.image_url);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    params.push(id);
    const query = `UPDATE ${HOTEL_TABLE_NAME} SET ${fields.join(', ')} WHERE ${HOTEL_COLUMNS.ID} = ?`;

    await this.pool.query(query, params);
    return this.findById(id);
  }

  /**
   * Delete a hotel
   * @param id - Hotel ID
   * @returns Promise<boolean> - True if deleted, false if not found
   */
  async delete(id: number): Promise<boolean> {
    const query = `DELETE FROM ${HOTEL_TABLE_NAME} WHERE ${HOTEL_COLUMNS.ID} = ?`;
    const [result] = await this.pool.query<mysql.ResultSetHeader>(query, [id]);
    return result.affectedRows > 0;
  }
}
