# Database Setup Scripts

This folder contains scripts to help you set up the MySQL database for the Travel Agency application.

## Available Scripts

### 1. `create-database.ps1` (PowerShell - Recommended)

Interactive PowerShell script that creates the database.

**Usage:**

```powershell
cd backend
.\scripts\create-database.ps1
```

**Features:**

- Prompts for MySQL root password
- Checks if MySQL is installed
- Provides clear success/error messages
- Shows next steps after completion

### 2. `create-database.bat` (Batch File)

Windows batch file that creates the database.

**Usage:**

```cmd
cd backend
scripts\create-database.bat
```

**Features:**

- Simple double-click execution
- Prompts for MySQL root password
- Works on all Windows versions

### 3. `setup-database.ps1` (Complete Setup)

Complete database setup script that:

1. Creates the database
2. Runs migrations (creates tables)
3. Seeds initial data (sample hotels)

**Usage:**

```powershell
cd backend
.\scripts\setup-database.ps1
```

**Features:**

- Complete automated setup
- Runs all migrations
- Seeds sample data
- Comprehensive error handling

### 4. `create-database.sql` (SQL Script)

Raw SQL script that can be used with MySQL command line or GUI tools.

**Usage with MySQL Command Line:**

```cmd
"C:\Program Files\MySQL\MySQL Server 9.4\bin\mysql.exe" -u root -p < scripts\create-database.sql
```

**Usage with MySQL Workbench:**

1. Open MySQL Workbench
2. Connect to your MySQL server
3. Open `scripts/create-database.sql`
4. Execute the script

## Prerequisites

1. **MySQL Server 9.4** installed at:

   ```
   C:\Program Files\MySQL\MySQL Server 9.4\bin\mysql.exe
   ```

2. **MySQL Server Running**: Make sure MySQL service is running

3. **MySQL Root Access**: You need the root password (or no password if root has no password)

## Updating MySQL Path

If your MySQL is installed in a different location, update the scripts:

### For PowerShell scripts:

Edit `create-database.ps1` or `setup-database.ps1` and change:

```powershell
$mysqlPath = "C:\Program Files\MySQL\MySQL Server 9.4\bin\mysql.exe"
```

### For Batch file:

Edit `create-database.bat` and change:

```batch
set MYSQL_PATH=C:\Program Files\MySQL\MySQL Server 9.4\bin\mysql.exe
```

## Quick Start

### Option 1: Quick Database Creation (Recommended)

```powershell
cd backend
.\scripts\create-database.ps1
```

Then start the server - migrations will run automatically:

```powershell
npm run dev
```

### Option 2: Complete Automated Setup

```powershell
cd backend
.\scripts\setup-database.ps1
```

This creates the database, runs migrations, and seeds data all at once.

## Troubleshooting

### Error: "MySQL not found"

- Check if MySQL is installed
- Update the MySQL path in the script
- Make sure MySQL Server service is running

### Error: "Access denied"

- Check your MySQL root password
- Make sure MySQL server is running
- Verify you have permissions to create databases

### Error: "Database already exists"

- This is normal if you've run the script before
- The database will be reused
- You can continue with the setup

## After Running Scripts

1. **Update `.env` file** in the `backend/` directory:

   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password_here
   DB_NAME=travel_agency
   ```

2. **Start the server**:

   ```powershell
   npm run dev
   ```

3. **Verify setup**: The server will automatically:
   - Connect to the database
   - Run migrations (if not already run)
   - Seed sample data (if not already seeded)

## Manual Setup (Alternative)

If you prefer to set up manually:

1. **Connect to MySQL**:

   ```cmd
   "C:\Program Files\MySQL\MySQL Server 9.4\bin\mysql.exe" -u root -p
   ```

2. **Create database**:

   ```sql
   CREATE DATABASE travel_agency CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   EXIT;
   ```

3. **Start the server** - migrations will run automatically:
   ```powershell
   npm run dev
   ```

## Notes

- All scripts use `IF NOT EXISTS` so they're safe to run multiple times
- The database uses `utf8mb4` character set for full Unicode support
- Scripts are designed for Windows with MySQL Server 9.4
- For other MySQL versions, update the path in the scripts
