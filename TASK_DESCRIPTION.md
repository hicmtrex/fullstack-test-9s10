# Fullstack Developer Test - Task Description

## Overview
This project is a travel agency hotel reservation system. Your task is to complete, fix, optimize, and improve the existing codebase to make it production-ready.

## Project Structure
- `frontend/` - React + TypeScript + Vite application
- `backend/` - Node.js + Express + TypeScript application

## Tasks

### 1. Complete the Project Functionality

#### 1.1 Hotel Search & Reservation Flow
- [ ] Ensure the complete flow works: Search → Select Hotel → Create Reservation → Generate Bill
- [ ] Implement **automatic bill generation** when a reservation is created
- [ ] Implement **manual bill generation** for existing reservations (without bills)
- [ ] Add validation to prevent duplicate bills for the same reservation
- [ ] Ensure all reservation data (rooms, guests, dates) is properly saved

#### 1.2 Reservation Management
- [ ] Implement **update reservation** functionality:
  - Allow editing check-in/check-out dates
  - Allow modifying room configurations
  - Recalculate total price when dates change
  - Update associated bill if it exists
- [ ] Implement **delete reservation** functionality:
  - Delete associated rooms
  - Delete associated bills (or mark as cancelled)
  - Add proper cascade deletion handling (db level)
  - Add confirmation dialog before deletion

#### 1.3 Bill Management
- [ ] Implement **print bill** functionality:
  - Generate PDF or printable HTML format
  - Include all reservation details
  - Include hotel information
  - Include guest details and room configurations
  - Add proper formatting for printing
- [ ] Implement **delete bill** functionality:
  - Allow deletion of bills (with proper validation)
  - Handle associated reservation status
  - Add confirmation dialog
- [ ] Add bill status management (pending, paid, cancelled)
- [ ] Add ability to mark bills as paid

#### 1.4 Missing Features
- [ ] Add error handling UI (user-friendly error messages)
- [ ] Add success notifications after operations
- [ ] Add loading states for all async operations
- [ ] Add form validation (client-side and server-side)
- [ ] Add confirmation dialogs for destructive actions
- [ ] Refresh data after create/update/delete operations

### 2. Fix Errors and Bugs

#### 2.1 Frontend Bugs
- [ ] Fix React "Maximum update depth exceeded" error in `MoteurReservation.tsx`
- [ ] Fix infinite loop in useEffect hooks
- [ ] Fix multiple unnecessary rerenders
- [ ] Fix state update issues causing performance problems
- [ ] Fix form submission handling
- [ ] Fix date validation and calculation issues
- [ ] Fix children ages array management in room configuration

#### 2.2 Backend Bugs
- [ ] Fix database connection pool management
- [ ] Fix query parameter handling (especially for hotelIds array)
- [ ] Fix transaction handling for reservation creation
- [ ] Fix error handling and proper HTTP status codes
- [ ] Fix date validation and timezone issues
- [ ] Fix SQL injection vulnerabilities (use parameterized queries properly)
- [ ] Fix race conditions in concurrent operations

#### 2.3 Data Integrity Issues
- [ ] Ensure referential integrity between tables
- [ ] Add proper foreign key constraints
- [ ] Handle orphaned records
- [ ] Validate data before database operations

### 3. Optimize Performance

#### 3.1 Frontend Optimization
- [ ] Optimize React component rerenders:
  - Use React.memo where appropriate
  - Use useMemo for expensive calculations
  - Use useCallback for event handlers passed to children
  - Fix dependency arrays in useEffect hooks
- [ ] Optimize state management:
  - Reduce unnecessary state updates
  - Combine related state updates
  - Use proper state structure
- [ ] Optimize API calls:
  - Implement proper caching where appropriate
  - Debounce search inputs
  - Add request cancellation for unmounted components
- [ ] Optimize bundle size:
  - Code splitting for routes
  - Lazy loading components
  - Remove unused dependencies

#### 3.2 Backend Optimization
- [ ] Optimize database queries:
  - Add proper indexes
  - Use JOINs efficiently
  - Avoid N+1 query problems
  - Use connection pooling properly
- [ ] Optimize API endpoints:
  - Add pagination for list endpoints
  - Add filtering and sorting
  - Implement proper caching headers
  - Optimize response payloads
- [ ] Optimize database operations:
  - Use transactions efficiently
  - Batch operations where possible
  - Optimize bulk inserts/updates

### 4. Style the Application (Tailwind CSS Only)

#### 4.1 Setup Tailwind CSS
- [ ] Install and configure Tailwind CSS
- [ ] Remove existing CSS files (or convert to Tailwind)
- [ ] Create a consistent design system

#### 4.2 UI/UX Improvements
- [ ] Design a modern, professional interface
- [ ] Create responsive layouts (mobile, tablet, desktop)
- [ ] Style all pages:
  - Dashboard with cards and charts
  - Factures table with proper styling
  - Reservations table with status badges
  - Search form with clean layout
  - Hotel cards in search results
- [ ] Add proper spacing, typography, and visual hierarchy
- [ ] Style buttons, inputs, and form elements
- [ ] Add hover states and transitions
- [ ] Style the side menu navigation
- [ ] Add loading spinners and skeletons
- [ ] Style error and success messages
- [ ] Create print-friendly styles for bills

### 5. Comment All Code

#### 5.1 Code Documentation
- [ ] Add JSDoc comments to all functions
- [ ] Add inline comments explaining complex logic
- [ ] Document all interfaces and types
- [ ] Add comments explaining business logic
- [ ] Document API endpoints (request/response formats)
- [ ] Add file-level comments explaining purpose
- [ ] Document database schema and relationships

#### 5.2 Documentation Standards
- [ ] Use consistent comment style
- [ ] Explain "why" not just "what"
- [ ] Document edge cases and assumptions
- [ ] Add TODO comments for future improvements if needed

### 6. Implement Good Design Patterns

#### 6.1 Backend Architecture (MVC Pattern)
- [ ] Restructure backend into MVC pattern:
  - Create `models/` folder for database models
  - Create `controllers/` folder for route handlers
  - Create `routes/` folder for route definitions
  - Create `services/` folder for business logic
  - Create `middleware/` folder for custom middleware
  - Create `config/` folder for configuration
  - Create `utils/` folder for utility functions
- [ ] Separate concerns properly:
  - Models handle database operations
  - Controllers handle HTTP requests/responses
  - Services contain business logic
  - Routes define endpoints

#### 6.2 Frontend Architecture
- [ ] Organize components properly:
  - Create `components/common/` for reusable components
  - Create `components/forms/` for form components
  - Create `components/layout/` for layout components
  - Create `hooks/` folder for custom hooks
  - Create `services/` or `api/` folder for API calls
  - Create `utils/` folder for utility functions
  - Create `types/` folder for TypeScript types
- [ ] Implement proper state management:
  - Use Context API or state management library if needed
  - Avoid prop drilling
  - Centralize API calls

#### 6.3 Code Patterns
- [ ] Use dependency injection where appropriate
- [ ] Implement repository pattern for database access
- [ ] Use factory patterns where beneficial
- [ ] Implement proper error handling patterns
- [ ] Use async/await consistently
- [ ] Implement proper validation patterns

### 7. Zero Linting and TypeScript Errors

#### 7.1 TypeScript
- [ ] Fix all TypeScript compilation errors
- [ ] Fix all TypeScript warnings
- [ ] Add proper type definitions for all functions
- [ ] Use strict TypeScript settings
- [ ] Add proper return types
- [ ] Fix any `any` types with proper types
- [ ] Ensure type safety throughout the application

#### 7.2 Linting
- [ ] Configure ESLint properly
- [ ] Fix all ESLint errors
- [ ] Fix all ESLint warnings
- [ ] Follow consistent code style
- [ ] Remove unused imports and variables
- [ ] Fix code formatting issues
- [ ] Ensure consistent naming conventions

#### 7.3 Code Quality
- [ ] Remove all console.log statements (or use proper logging)
- [ ] Remove commented-out code
- [ ] Remove unused code and dependencies
- [ ] Ensure consistent code formatting

## Technical Requirements

### Database
- Use MySQL2 with proper connection pooling
- Implement proper migrations (or at least initialization scripts)
- Add proper indexes for performance
- Ensure data integrity with constraints

### API Design
- Follow RESTful conventions
- Use proper HTTP status codes
- Return consistent response formats
- Implement proper error responses

### Security
- Validate and sanitize all inputs
- Use parameterized queries (prevent SQL injection)
- Add CORS configuration properly
- Implement proper authentication if needed (optional)

### Testing (Optional but Recommended)
- Add unit tests for critical functions
- Add integration tests for API endpoints
- Test error scenarios

## Deliverables

1. **Working Application**: Fully functional application with all features implemented
2. **Clean Code**: Well-structured, commented, and maintainable code
3. **Documentation**: Updated README with setup instructions and architecture overview
4. **Code Quality**: Zero linting and TypeScript errors

## Evaluation Criteria

- **Functionality**: All features work correctly
- **Code Quality**: Clean, maintainable, well-documented code
- **Performance**: Optimized queries and component rendering
- **Architecture**: Proper design patterns and folder structure
- **UI/UX**: Professional, responsive design with Tailwind CSS
- **Error Handling**: Proper error handling throughout the application
- **Type Safety**: Full TypeScript coverage with no errors

## Notes

- The project intentionally contains bugs and incomplete features
- Some code is intentionally poorly structured to test refactoring skills
- Focus on writing production-ready code
- Consider scalability and maintainability
- Follow best practices and industry standards

## Getting Started

1. Read the existing codebase to understand the current implementation
2. Identify all issues and missing features
3. Plan your refactoring and implementation approach
4. Implement changes systematically
5. Test thoroughly before submission

Good luck!

