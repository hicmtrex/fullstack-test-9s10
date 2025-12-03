# Architecture Guide - Feature-Based Structure

## Overview
This document explains the feature-based architecture pattern used in this project.

## Why Feature-Based Architecture?

### Benefits
1. **Scalability**: Easy to add new features without affecting existing ones
2. **Maintainability**: All related code for a feature is in one place
3. **Team Collaboration**: Different developers can work on different features
4. **Clear Boundaries**: Each feature is self-contained
5. **Easier Testing**: Test features in isolation

## Backend Feature Structure

Each feature follows this structure:

```
features/
└── [feature-name]/
    ├── [feature].controller.ts    # HTTP request/response handling
    ├── [feature].service.ts       # Business logic
    ├── [feature].repository.ts    # Database operations (Repository Pattern)
    ├── [feature].model.ts         # Database model/schema
    ├── [feature].routes.ts        # Route definitions
    ├── [feature].types.ts         # TypeScript interfaces
    └── [feature].validators.ts    # Input validation (Zod schemas)
```

### Example: Hotels Feature

```typescript
// hotels/hotel.types.ts
export interface Hotel {
  id: number;
  name: string;
  country: string;
  city: string;
  address: string;
  price_per_night: number;
  created_at: Date;
}

// hotels/hotel.model.ts
export class HotelModel {
  // Database schema definition
}

// hotels/hotel.repository.ts
export class HotelRepository {
  async findAll(): Promise<Hotel[]> { }
  async findById(id: number): Promise<Hotel | null> { }
  async search(criteria: SearchCriteria): Promise<Hotel[]> { }
}

// hotels/hotel.service.ts
export class HotelService {
  constructor(private repository: HotelRepository) {}
  
  async getAllHotels(): Promise<Hotel[]> {
    return this.repository.findAll();
  }
  
  async searchHotels(criteria: SearchCriteria): Promise<Hotel[]> {
    // Business logic here
    return this.repository.search(criteria);
  }
}

// hotels/hotel.controller.ts
export class HotelController {
  constructor(private service: HotelService) {}
  
  async getAll(req: Request, res: Response) {
    const hotels = await this.service.getAllHotels();
    res.json(hotels);
  }
}

// hotels/hotel.routes.ts
export const hotelRoutes = Router();
hotelRoutes.get('/', hotelController.getAll);
```

## Frontend Feature Structure

Each feature follows this structure:

```
features/
└── [feature-name]/
    ├── components/          # Feature-specific components
    ├── hooks/              # Custom React hooks
    ├── services/           # API service layer
    ├── types/              # TypeScript types
    └── pages/              # Page components (if needed)
```

### Example: Reservations Feature

```typescript
// reservations/types/reservation.types.ts
export interface Reservation {
  id: number;
  hotel_id: number;
  check_in: string;
  check_out: string;
  // ...
}

// reservations/services/reservationApi.ts
export const reservationApi = {
  getAll: () => apiClient.get<Reservation[]>('/reservations'),
  getById: (id: number) => apiClient.get<Reservation>(`/reservations/${id}`),
  create: (data: CreateReservationDto) => apiClient.post('/reservations', data),
  update: (id: number, data: UpdateReservationDto) => apiClient.put(`/reservations/${id}`, data),
  delete: (id: number) => apiClient.delete(`/reservations/${id}`),
};

// reservations/hooks/useReservations.ts
export const useReservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fetchReservations = useCallback(async () => {
    setLoading(true);
    try {
      const data = await reservationApi.getAll();
      setReservations(data);
    } catch (err) {
      setError('Failed to fetch reservations');
    } finally {
      setLoading(false);
    }
  }, []);
  
  return { reservations, loading, error, fetchReservations };
};

// reservations/components/ReservationCard.tsx
export const ReservationCard: React.FC<{ reservation: Reservation }> = ({ reservation }) => {
  // Component implementation
};
```

## Shared Code

### Backend Shared
```
shared/
├── config/          # Configuration (database, env, logger)
├── middleware/      # Express middleware
├── utils/           # Utility functions
└── types/           # Common types
```

### Frontend Shared
```
shared/
├── components/      # Reusable UI components
├── hooks/           # Reusable hooks
├── services/        # Shared services (API client)
├── utils/           # Utility functions
├── types/           # Common types
└── constants/       # Constants (API endpoints, etc.)
```

## Design Patterns Used

### 1. Repository Pattern (Backend)
- Separates data access logic from business logic
- Makes testing easier (can mock repository)
- Example: `HotelRepository` handles all database queries

### 2. Service Layer Pattern (Backend)
- Contains business logic
- Orchestrates repository calls
- Example: `HotelService` contains search logic, price calculations

### 3. Custom Hooks Pattern (Frontend)
- Encapsulates stateful logic
- Reusable across components
- Example: `useReservations` hook manages reservation state

### 4. API Service Layer (Frontend)
- Centralizes API calls
- Consistent error handling
- Example: `reservationApi` object with all reservation endpoints

## Data Flow

### Backend Flow
```
Request → Routes → Controller → Service → Repository → Database
                ↓
            Response ← Controller ← Service ← Repository
```

### Frontend Flow
```
User Action → Component → Hook → API Service → Backend
                                    ↓
                            Component ← Hook ← API Service
```

## Dependency Injection

### Backend Example
```typescript
// Create instances with dependencies
const hotelRepository = new HotelRepository(connection);
const hotelService = new HotelService(hotelRepository);
const hotelController = new HotelController(hotelService);

// Use in routes
hotelRoutes.get('/', hotelController.getAll.bind(hotelController));
```

## Best Practices

1. **One Feature = One Folder**: Keep all feature code together
2. **No Cross-Feature Imports**: Features should not directly import from other features
3. **Use Shared for Common Code**: Put reusable code in `shared/`
4. **Clear Separation of Concerns**: Controller → Service → Repository
5. **Type Safety**: Use TypeScript types throughout
6. **Validation**: Validate inputs at controller level
7. **Error Handling**: Handle errors at appropriate layers

## Migration Strategy

When refactoring existing code:

1. **Start with one feature** (e.g., Hotels)
2. **Create the folder structure**
3. **Move and refactor code** into appropriate files
4. **Update imports** in main files
5. **Test thoroughly**
6. **Move to next feature**

## Example: Migrating Hotels Feature

### Before (index.ts)
```typescript
app.get('/api/hotels', async (req, res) => {
  const [rows] = await connection.query('SELECT * FROM hotels');
  res.json(rows);
});
```

### After (Feature-Based)

**hotels/hotel.repository.ts**
```typescript
export class HotelRepository {
  async findAll(): Promise<Hotel[]> {
    const [rows] = await connection.query('SELECT * FROM hotels');
    return rows as Hotel[];
  }
}
```

**hotels/hotel.service.ts**
```typescript
export class HotelService {
  constructor(private repository: HotelRepository) {}
  
  async getAllHotels(): Promise<Hotel[]> {
    return this.repository.findAll();
  }
}
```

**hotels/hotel.controller.ts**
```typescript
export class HotelController {
  constructor(private service: HotelService) {}
  
  async getAll(req: Request, res: Response) {
    try {
      const hotels = await this.service.getAllHotels();
      res.json(hotels);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch hotels' });
    }
  }
}
```

**hotels/hotel.routes.ts**
```typescript
const router = Router();
const repository = new HotelRepository(connection);
const service = new HotelService(repository);
const controller = new HotelController(service);

router.get('/', controller.getAll.bind(controller));
export default router;
```

**index.ts**
```typescript
import hotelRoutes from './features/hotels/hotel.routes';
app.use('/api/hotels', hotelRoutes);
```

This structure makes the codebase more maintainable and scalable! 🚀

