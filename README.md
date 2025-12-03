# Travel Agency Fullstack Test Project

This is a test project for fullstack candidates. The project contains both frontend and backend with intentional issues that need to be fixed and optimized.

## Project Structure

- `frontend/` - React + TypeScript + Vite application
- `backend/` - Node.js + Express + TypeScript application

## Quick Start

1. **Set up the database** - See [DATABASE_SETUP.md](./DATABASE_SETUP.md) for detailed instructions
2. **Configure environment variables** - See [SETUP_ENV.md](./SETUP_ENV.md) for `.env` setup
3. **Install and run** - Follow the instructions below

## Setup Instructions

### Backend Setup

1. Navigate to backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

4. Update `.env` with your MySQL database credentials:

   - `DB_HOST` - MySQL host (default: localhost)
   - `DB_PORT` - MySQL port (default: 3306)
   - `DB_USER` - MySQL username (default: root)
   - `DB_PASSWORD` - MySQL password (leave empty if no password)
   - `DB_NAME` - Database name (default: travel_agency)

5. **Set up the MySQL database**:

   - See [DATABASE_SETUP.md](./DATABASE_SETUP.md) for detailed instructions
   - Quick setup: Connect to MySQL and run:

   ```sql
   CREATE DATABASE travel_agency CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

6. Start the backend server:

```bash
npm run dev
```

The backend will run on `http://localhost:3001`

### Frontend Setup

1. Navigate to frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## Features

### Frontend

- Dashboard with statistics
- Factures (Bills) listing
- Reservations listing
- Moteur Reservation (Hotel search engine) with:
  - Country and city filters
  - Optional hotel selection (multiple)
  - Check-in/Check-out dates
  - Number of nights
  - Room configuration (adults, children, children ages)

### Backend

- REST API endpoints for hotels, reservations, factures
- MySQL database integration
- All routes currently in `index.ts` (needs MVC restructuring)

## Issues to Fix

### Frontend Issues

1. **React Depth Exceeded Error** - There's a recursive component causing stack overflow
2. **Multiple Rerenders** - Several components trigger unnecessary rerenders
3. **Missing Functionalities** - Some features are incomplete or missing
4. **Performance Issues** - Optimize component rendering and state management

### Backend Issues

1. **Code Organization** - All code is in `index.ts`, needs MVC structure
2. **Database Queries** - Some queries need optimization
3. **Error Handling** - Missing proper error handling in some routes
4. **Transaction Management** - Reservation creation should use database transactions
5. **Missing Validations** - Add input validation and sanitization

## Tasks for Candidates

**Please refer to [TASK_DESCRIPTION.md](./TASK_DESCRIPTION.md) for the complete and detailed task requirements.**

The main tasks include:

1. Complete the project functionality (reservations, bills, CRUD operations)
2. Fix all errors and bugs
3. Optimize performance (frontend and backend)
4. Style the application using Tailwind CSS only
5. Comment all code
6. Implement good design patterns (MVC, proper folder structure)
7. Achieve zero linting and TypeScript errors

See `TASK_DESCRIPTION.md` for the complete checklist and detailed requirements.

## Docker Setup (Recommended)

For easy setup with Docker:

```bash
# Start MySQL and Backend in Docker
docker-compose up -d

# Or start only MySQL (run backend locally)
cd backend
docker-compose up -d
```

See **[DOCKER_SETUP.md](./DOCKER_SETUP.md)** for complete Docker documentation.

## Additional Documentation

- **[DOCKER_SETUP.md](./DOCKER_SETUP.md)** - Complete Docker setup guide
- **[DATABASE_SETUP.md](./DATABASE_SETUP.md)** - Detailed MySQL database setup guide
- **[SETUP_ENV.md](./SETUP_ENV.md)** - Environment variables configuration guide
- **[ROADMAP.md](./ROADMAP.md)** - Complete project roadmap with feature-based architecture
- **[ARCHITECTURE_GUIDE.md](./ARCHITECTURE_GUIDE.md)** - Architecture patterns and design decisions
