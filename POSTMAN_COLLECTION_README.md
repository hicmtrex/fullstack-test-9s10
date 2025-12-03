# Postman Collection - Travel Agency Hotel Reservation API

## 📋 Overview

This Postman collection contains all API endpoints for testing the Travel Agency Hotel Reservation System.

## 🚀 Quick Start

1. **Import the Collection**

   - Open Postman
   - Click "Import" button
   - Select `postman_collection.json` file
   - The collection will be imported with all endpoints

2. **Set Environment Variables (Optional)**

   - Create a new environment in Postman
   - Add variable: `base_url` = `http://localhost:3001/api`
   - Use this environment when testing

3. **Start the Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   Server should run on `http://localhost:3001`

## 📚 Collection Structure

### 1. Health Check

- **GET** `/api/health` - Check if API is running

### 2. Hotels

- **GET** `/api/hotels` - Get all hotels
- **GET** `/api/hotels/:id` - Get hotel by ID
- **GET** `/api/hotels/search?country=France&city=Paris` - Search hotels

### 3. Reservations

- **GET** `/api/reservations?page=1&limit=10` - Get all reservations (paginated)
- **GET** `/api/reservations/:id` - Get reservation by ID
- **POST** `/api/reservations` - Create new reservation
  - **Simple (No Children)**: `{"hotelId": 1, "checkIn": "2025-12-10", "checkOut": "2025-12-15", "rooms": [{"nb_adults": 2, "nb_enfants": 0, "ages_enfants": []}]}`
  - **With Children**: `{"hotelId": 1, "checkIn": "2025-12-10", "checkOut": "2025-12-15", "rooms": [{"nb_adults": 2, "nb_enfants": 2, "ages_enfants": [5, 10]}]}`
  - **Multiple Rooms**: Multiple room objects in the `rooms` array
- **PUT** `/api/reservations/:id` - Update reservation
- **DELETE** `/api/reservations/:id` - Delete reservation

### 4. Factures (Bills)

- **GET** `/api/factures?page=1&limit=10` - Get all factures (paginated)
- **GET** `/api/factures/:id` - Get facture by ID
- **POST** `/api/factures` - Create facture manually
- **PATCH** `/api/factures/:id/status` - Update facture status (paid/pending/cancelled)
- **GET** `/api/factures/:id/print` - Get printable facture data
- **DELETE** `/api/factures/:id` - Delete facture

### 5. Dashboard

- **GET** `/api/dashboard/stats` - Get dashboard statistics

## 🐛 Debugging Reservation Creation Issues

### Common Issues and Solutions

1. **400 Bad Request - Validation Error**

   - Check the error response for specific validation messages
   - Ensure dates are in `YYYY-MM-DD` format
   - Ensure `ages_enfants` array length matches `nb_enfants`
   - If `nb_enfants` is 0, `ages_enfants` must be empty array `[]`

2. **Date Validation Errors**

   - Check-in date cannot be in the past
   - Check-out date must be after check-in date
   - Dates must be in future (at least today)

3. **Room Validation Errors**
   - Each room must have at least 1 adult (`nb_adults >= 1`)
   - Number of children cannot be negative (`nb_enfants >= 0`)
   - If children exist, ages must be provided and match count
   - Children ages must be between 0-17

### Example Working Request

```json
{
  "hotelId": 1,
  "checkIn": "2025-12-10",
  "checkOut": "2025-12-15",
  "rooms": [
    {
      "nb_adults": 2,
      "nb_enfants": 0,
      "ages_enfants": []
    }
  ]
}
```

### Testing Steps

1. **First, check if hotels exist:**

   - Run `GET /api/hotels`
   - Note a valid `hotelId` (usually 1)

2. **Test simple reservation:**

   - Use `Create Reservation - Simple (No Children)`
   - Update `hotelId` if needed
   - Update dates to future dates (at least today)

3. **Check the response:**

   - Should return 201 Created with full reservation details
   - If 400, check the error message for specific validation issues

4. **Verify in database:**
   - Run `GET /api/reservations` to see all reservations
   - Run `GET /api/factures` to see if bill was auto-generated

## 📝 Notes

- All dates must be in `YYYY-MM-DD` format
- Dates must be in the future (check-in cannot be in the past)
- When creating reservations, bills are automatically generated
- Factures have a unique constraint (one bill per reservation)
- Use pagination for list endpoints (default: page=1, limit=50)

## 🔍 Error Response Format

```json
{
  "error": "Validation error",
  "message": "Specific error message",
  "details": [
    {
      "path": "rooms.0.ages_enfants",
      "message": "Number of children ages must match number of children"
    }
  ]
}
```

## 🎯 Next Steps

1. Import the collection
2. Test health check endpoint
3. Test hotel endpoints
4. Test reservation creation with simple example
5. Check error responses if issues occur
6. Use the detailed error messages to fix any validation issues
