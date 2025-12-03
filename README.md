## Travel Agency Hotel Reservation System

Full‑stack hotel reservation system (React + Node/Express + MySQL) implementing all requirements from `TASK_DESCRIPTION.md`:
hotel search, reservation management, automatic and manual bill generation, dashboards, and a Tailwind CSS UI.

### 🚀 Quick Start for Testers

**New to this project?** See **[TESTER_GUIDE.md](./TESTER_GUIDE.md)** for a simple step-by-step setup guide.

**Quick login credentials:**

- Email: `admin@agency.com`
- Password: `admin123`

---

### Project Structure

- `frontend/` – React, TypeScript, Vite, React Query, Tailwind CSS
- `backend/` – Node.js, Express, TypeScript, MySQL2, Zod, MVC + repository + services

---

## How to Run the Project

### 1. Backend (API)

1. From repo root:

```bash
cd backend
npm install
```

2. Create database (MySQL):

```sql
CREATE DATABASE travel_agency CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

3. Configure environment variables – create `.env` from `.env.example`:

```bash
cp .env.example .env
```

Set at least:

- `DB_HOST=localhost`
- `DB_PORT=3306`
- `DB_USER=your_user`
- `DB_PASSWORD=your_password`
- `DB_NAME=travel_agency`
- `PORT=3001`

4. Start the backend (migrations and seeds run automatically):

```bash
npm run dev
```

**Note:** Migrations and seeds run automatically when the backend starts. You don't need to run them manually unless you're troubleshooting.

API base URL (from the frontend): `http://localhost:3000/api` (proxied by Vite to `http://localhost:3001`).

### Test Credentials

After seeding, you can log in with:

- **Email:** `admin@agency.com`
- **Password:** `admin123`
- **Role:** `admin`

### 2. Frontend (Web App)

1. In another terminal, from repo root:

```bash
cd frontend
npm install
npm run dev
```

2. Open the app in the browser:

```text
http://localhost:3000
```

Both frontend and backend builds pass with `npm run build` in each folder.

---

## Main Features (End‑to‑End Flows)

### Hotel Search & Reservation Flow

- Search hotels by **country** (dropdown select) and **city** in `MoteurReservation`.
- Configure **rooms** (adults, children, children ages).
- Create reservations with **validated dates** (no past check‑in, checkout after check‑in).
- **Automatic bill (facture) generation** on successful reservation creation.
- Per‑card loading state for “Reserve Now” buttons and user‑friendly toast notifications.

### Reservation Management

- List reservations with pagination.
- View reservation details (including rooms and pricing).
- **Edit reservation**:
  - Change check‑in / check‑out dates.
  - Modify room configuration.
  - Recalculate total price when dates change.
  - **Update associated facture total amount** if it exists.
- **Delete reservation**:
  - Uses DB foreign keys with `ON DELETE CASCADE` to remove rooms and factures.
  - Protected by confirmation dialog in the UI.

### Bill (Facture) Management

- List factures with pagination and status filters.
- **Automatic facture** creation on reservation create.
- **Manual facture** generation from reservation details if no bill exists.
- Update facture status (**pending / paid / cancelled**) from the UI.
- Delete facture with confirmation, with proper validation.
- Printable facture view (`PrintFacture`) with hotel and reservation details,
  styled for printing.

### Missing Features from Spec – Implemented

- Global **error handling UI** with Tailwind toasts (success/error/warning/info).
- Success and error notifications for all key operations (reservations, factures, dashboard).
- Loading states and skeletons for pages and tables.
- Client‑side form validation and robust server‑side validation (Zod).
- Confirmation dialogs for destructive actions (delete reservation/facture).
- Data automatically refreshed after create / update / delete via React Query.

---

## Architecture Overview

### Backend

- **MVC + Feature‑based structure**
  - `features/hotels`, `features/reservations`, `features/factures`, `features/dashboard`
  - Each feature has **routes**, **controllers**, **services**, **repositories**, **validators**, **types**.
- **Repositories** encapsulate all DB access (MySQL2 + connection pooling).
- **Services** implement business logic:
  - Reservation creation in a **transaction** (reservation + rooms + facture).
  - Date and room validation, price calculation, facture synchronization on update.
- **Validators** (Zod) enforce request schemas and date rules.
- **Middleware**:
  - `validator` – request validation with structured error responses.
  - `errorHandler` – centralized error handling.
- **Database**
  - `001_initial_schema.sql` with proper foreign keys, indexes, and constraints:
    - `reservations.hotel_id → hotels.id` (`ON DELETE RESTRICT`).
    - `rooms.reservation_id → reservations.id` (`ON DELETE CASCADE`).
    - `factures.reservation_id → reservations.id` (`ON DELETE CASCADE`, unique per reservation).

### Frontend

- **Feature‑based React app**:
  - `features/hotels`, `features/reservations`, `features/factures`, `features/dashboard`.
  - `shared` for reusable UI components, hooks, utils, and providers.
- **State & Data**
  - React Query for all API calls (caching, refetching, loading/error state).
  - Custom hooks: `useHotels`, `useHotelSearch`, `useReservations`, `useFactures`, `useDashboardStats`.
- **Notifications**
  - `NotificationProvider` + `useNotification` + `ToastContainer` for global toasts.
- **UI & Layout**
  - Tailwind CSS only: modern layout, side menu, responsive tables and cards.
  - `MoteurReservation`, `Reservations`, `Factures`, and `Dashboard` pages.
  - Skeletons and spinners for loading states.

---

## API & Postman Collection

- All endpoints are documented and grouped in `postman_collection.json`.
- Usage guide: see `POSTMAN_COLLECTION_README.md`.
- Key endpoints:
  - `GET /api/hotels` – list hotels.
  - `GET /api/reservations`, `POST /api/reservations`, `PUT /api/reservations/:id`, `DELETE /api/reservations/:id`.
  - `GET /api/factures`, `POST /api/factures`, `PATCH /api/factures/:id/status`, `DELETE /api/factures/:id`.
  - `GET /api/dashboard/stats` – aggregated stats for dashboard cards.

---

## TASK_DESCRIPTION Checklist (High‑Level)

This implementation covers the requirements from `TASK_DESCRIPTION.md`:

- **1. Complete Project Functionality**

  - [x] Full hotel search → reservation → bill flow (automatic + manual bills).
  - [x] Reservation update & delete (with cascade handling and confirmation dialogs).
  - [x] Bill management: print, delete, status updates (pending/paid/cancelled).

- **2. Fix Errors and Bugs**

  - [x] Fixed frontend issues (render loops, date handling, state/performance problems).
  - [x] Fixed backend issues (transactions, validation, timezone, error handling).
  - [x] Ensured data integrity with foreign keys and constraints.

- **3. Optimize Performance**

  - [x] React.memo, useMemo, useCallback, debounced search.
  - [x] MySQL connection pooling and indexed queries.

- **4. Tailwind Styling**

  - [x] All pages and components styled using Tailwind only, responsive layouts,
        consistent design system, hover states, skeletons, and toasts.

- **5. Comment All Code**

  - [x] JSDoc and inline comments for services, repositories, controllers, hooks, and utilities.

- **6. Design Patterns**

  - [x] MVC + feature‑based architecture, repository pattern, validation middleware,
        centralized error handling, and typed services.

- **7. Zero Linting & TypeScript Errors**
  - [x] `npm run build` succeeds in both `backend` and `frontend` with no TypeScript errors.

For the detailed original specification, see `TASK_DESCRIPTION.md`.
