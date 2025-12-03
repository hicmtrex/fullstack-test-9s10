import { Router } from 'express';
import { HotelRepository } from './hotel.repository';
import { HotelService } from './hotel.service';
import { HotelController } from './hotel.controller';
import { validate } from '../../shared/middleware/validator';
import { createHotelSchema, updateHotelSchema, hotelSearchSchema } from './hotel.validators';

/**
 * Hotel routes
 * Defines all HTTP endpoints for hotel operations
 */
const router = Router();

// Initialize dependencies (Dependency Injection)
const repository = new HotelRepository();
const service = new HotelService(repository);
const controller = new HotelController(service);

/**
 * @route   GET /api/hotels
 * @desc    Get all hotels (with optional pagination)
 * @access  Public
 * @query   limit, offset (optional)
 */
router.get('/', controller.getAll);

/**
 * @route   GET /api/hotels/search
 * @desc    Search hotels (GET for better caching)
 * @access  Public
 * NOTE: Must come before /:id route to avoid "search" being treated as an ID
 */
router.get('/search', controller.search);

/**
 * @route   GET /api/hotels/:id
 * @desc    Get hotel by ID
 * @access  Public
 */
router.get('/:id', controller.getById);

/**
 * @route   POST /api/hotels/search
 * @desc    Search hotels (POST for complex queries)
 * @access  Public
 */
router.post('/search', validate(hotelSearchSchema, 'body'), controller.search);

/**
 * @route   POST /api/hotels
 * @desc    Create a new hotel
 * @access  Public (should be protected in production)
 */
router.post('/', validate(createHotelSchema, 'body'), controller.create);

/**
 * @route   PUT /api/hotels/:id
 * @desc    Update a hotel
 * @access  Public (should be protected in production)
 */
router.put('/:id', validate(updateHotelSchema, 'body'), controller.update);

/**
 * @route   DELETE /api/hotels/:id
 * @desc    Delete a hotel
 * @access  Public (should be protected in production)
 */
router.delete('/:id', controller.delete);

export default router;
