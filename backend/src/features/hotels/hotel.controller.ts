import { Request, Response } from 'express';
import { HotelService } from './hotel.service';
import { CreateHotelDto, UpdateHotelDto } from './hotel.types';
import { asyncHandler } from '../../shared/middleware/errorHandler';

/**
 * Hotel Controller
 * Handles HTTP requests and responses for hotel operations
 */
export class HotelController {
  private service: HotelService;

  constructor(service: HotelService) {
    this.service = service;
  }

  /**
   * Get all hotels with pagination
   * GET /api/hotels?limit=12&offset=0
   */
  getAll = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 12;
    const offset = req.query.offset ? parseInt(req.query.offset as string, 10) : 0;

    const result = await this.service.getAllHotels(limit, offset);
    res.json(result);
  });

  /**
   * Get hotel by ID
   * GET /api/hotels/:id
   */
  getById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid hotel ID' });
      return;
    }

    const hotel = await this.service.getHotelById(id);

    if (!hotel) {
      res.status(404).json({ error: 'Hotel not found' });
      return;
    }

    res.json(hotel);
  });

  /**
   * Search hotels with pagination
   * POST /api/hotels/search
   * GET /api/hotels/search?country=France&city=Paris&limit=12&offset=0
   */
  search = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    // Support both POST (body) and GET (query params) for better caching
    const searchCriteria =
      req.method === 'POST'
        ? req.body
        : {
            country: req.query.country as string | undefined,
            city: req.query.city as string | undefined,
            checkIn: req.query.checkIn as string | undefined,
            checkOut: req.query.checkOut as string | undefined,
            numberOfNights: req.query.numberOfNights
              ? parseInt(req.query.numberOfNights as string, 10)
              : undefined,
            limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
            offset: req.query.offset ? parseInt(req.query.offset as string, 10) : undefined,
          };

    const results = await this.service.searchHotels(searchCriteria);
    res.json(results);
  });

  /**
   * Create a new hotel
   * POST /api/hotels
   */
  create = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const hotelData: CreateHotelDto = req.body;
    const hotel = await this.service.createHotel(hotelData);
    res.status(201).json(hotel);
  });

  /**
   * Update a hotel
   * PUT /api/hotels/:id
   */
  update = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid hotel ID' });
      return;
    }

    const hotelData: UpdateHotelDto = req.body;
    const hotel = await this.service.updateHotel(id, hotelData);

    if (!hotel) {
      res.status(404).json({ error: 'Hotel not found' });
      return;
    }

    res.json(hotel);
  });

  /**
   * Delete a hotel
   * DELETE /api/hotels/:id
   */
  delete = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid hotel ID' });
      return;
    }

    const deleted = await this.service.deleteHotel(id);

    if (!deleted) {
      res.status(404).json({ error: 'Hotel not found' });
      return;
    }

    res.status(204).send();
  });
}
