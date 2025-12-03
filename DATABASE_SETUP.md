# Database Setup Guide

This guide will help you set up the MySQL database for the Travel Agency application.

## 🚀 Quick Start (Recommended)

**Easiest way**: Use the provided PowerShell script:

```powershell
cd backend
.\scripts\create-database.ps1
```

This will:

- Prompt for your MySQL password
- Create the database automatically
- Show you next steps

For complete automated setup (database + migrations + seeds):

```powershell
cd backend
.\scripts\setup-database.ps1
```

See [backend/scripts/README.md](./backend/scripts/README.md) for all available scripts.

---

## Manual Setup

If you prefer to set up manually, follow the steps below.

## Prerequisites

- MySQL Server installed and running
- MySQL command-line client or a GUI tool (like MySQL Workbench, phpMyAdmin, etc.)

## Step 1: Create the Database

### Option A: Using MySQL Command Line

1. Open your terminal/command prompt
2. Connect to MySQL:

   ```bash
   mysql -u root -p
   ```

   (Enter your MySQL root password when prompted)

3. Create the database:

   ```sql
   CREATE DATABASE travel_agency CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

4. Verify the database was created:

   ```sql
   SHOW DATABASES;
   ```

5. Exit MySQL:
   ```sql
   EXIT;
   ```

### Option B: Using MySQL Workbench

1. Open MySQL Workbench
2. Connect to your MySQL server
3. Click on "Create a new schema" (or use the SQL Editor)
4. Run this SQL:
   ```sql
   CREATE DATABASE travel_agency CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

### Option C: Using phpMyAdmin

1. Open phpMyAdmin in your browser
2. Click on "New" in the left sidebar
3. Enter database name: `travel_agency`
4. Select collation: `utf8mb4_unicode_ci`
5. Click "Create"

## Step 2: Configure Environment Variables

1. Copy the example environment file:

   ```bash
   cd backend
   cp .env.example .env
   ```

2. Edit the `.env` file and update the database credentials:

   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_mysql_password_here
   DB_NAME=travel_agency
   ```

   **Important**: Replace `your_mysql_password_here` with your actual MySQL root password (or leave empty if no password is set).

## Step 3: Run the Application

The database tables will be automatically created when you start the backend server:

```bash
cd backend
npm install
npm run dev
```

The application will:

1. Connect to the database
2. Run migrations to create all tables
3. Seed initial data (sample hotels)

## Step 4: Verify Database Setup

### Check Tables

Connect to MySQL and verify tables were created:

```sql
USE travel_agency;
SHOW TABLES;
```

You should see:

- `hotels`
- `reservations`
- `rooms`
- `factures`

### Check Sample Data

```sql
SELECT * FROM hotels;
```

You should see 5 sample hotels.

## Troubleshooting

### Error: "Access denied for user"

- Check your MySQL username and password in `.env`
- Make sure the MySQL user has proper permissions
- Try connecting manually: `mysql -u root -p`

### Error: "Database does not exist"

- Make sure you created the database (Step 1)
- Check the database name in `.env` matches the created database

### Error: "Connection refused"

- Make sure MySQL server is running
- Check the `DB_HOST` and `DB_PORT` in `.env`
- Verify MySQL is listening on the correct port (default: 3306)

### Error: "Cannot find module 'mysql2'"

- Run `npm install` in the backend directory
- Make sure all dependencies are installed

## Manual Migration (Optional)

If you want to run migrations manually:

1. Connect to MySQL:

   ```bash
   mysql -u root -p travel_agency
   ```

2. Copy and paste the contents of `backend/src/database/migrations/001_initial_schema.sql`

3. Run the seed script:
   ```bash
   mysql -u root -p travel_agency < backend/src/database/seeds/seed_hotels.sql
   ```

## Database Schema Overview

### hotels

- Stores hotel information (name, location, price)

### reservations

- Stores reservation details (dates, total price, status)
- Foreign key to `hotels`

### rooms

- Stores room configuration for each reservation
- Foreign key to `reservations`
- Stores number of adults, children, and children ages

### factures (bills)

- Stores billing information
- Foreign key to `reservations`
- One bill per reservation (unique constraint)

## Next Steps

Once the database is set up:

1. Start the backend server: `npm run dev`
2. Start the frontend server: `cd frontend && npm run dev`
3. The application should be ready to use!

For more information, see the main [README.md](./README.md) file.
