# Database Setup Scripts - Created ✅

## Summary

I've created several scripts to help you set up the MySQL database easily using your MySQL installation at `C:\Program Files\MySQL\MySQL Server 9.4\bin`.

## Created Scripts

### 1. **`backend/scripts/create-database.ps1`** ⭐ (Recommended)

PowerShell script with interactive prompts.

**Features:**

- ✅ Checks if MySQL exists at the specified path
- ✅ Prompts for MySQL root password securely
- ✅ Creates the database with proper character set
- ✅ Clear success/error messages
- ✅ Shows next steps after completion

**Usage:**

```powershell
cd backend
.\scripts\create-database.ps1
```

### 2. **`backend/scripts/create-database.bat`**

Windows batch file for easy double-click execution.

**Features:**

- ✅ Simple batch file execution
- ✅ Prompts for password
- ✅ Works on all Windows versions

**Usage:**

```cmd
cd backend
scripts\create-database.bat
```

### 3. **`backend/scripts/setup-database.ps1`** 🚀 (Complete Setup)

Complete automated setup script.

**Features:**

- ✅ Creates the database
- ✅ Runs all migrations (creates tables)
- ✅ Seeds initial data (sample hotels)
- ✅ Comprehensive error handling
- ✅ Step-by-step progress display

**Usage:**

```powershell
cd backend
.\scripts\setup-database.ps1
```

### 4. **`backend/scripts/create-database.sql`** (Updated)

SQL script that can be used with MySQL command line or GUI tools.

**Usage:**

```cmd
"C:\Program Files\MySQL\MySQL Server 9.4\bin\mysql.exe" -u root -p < backend\scripts\create-database.sql
```

### 5. **`backend/scripts/README.md`**

Complete documentation for all scripts.

## Quick Start

### Easiest Method (Recommended):

1. **Open PowerShell** in the `backend` directory
2. **Run the script**:
   ```powershell
   .\scripts\create-database.ps1
   ```
3. **Enter your MySQL root password** when prompted
4. **Done!** The database will be created

### Complete Automated Setup:

1. **Open PowerShell** in the `backend` directory
2. **Run the complete setup**:
   ```powershell
   .\scripts\setup-database.ps1
   ```
3. **Enter your MySQL root password** when prompted
4. **Done!** Database, tables, and sample data will all be created

## Script Configuration

All scripts are configured to use:

- **MySQL Path**: `C:\Program Files\MySQL\MySQL Server 9.4\bin\mysql.exe`
- **Database Name**: `travel_agency`
- **Character Set**: `utf8mb4`
- **Collation**: `utf8mb4_unicode_ci`

### If Your MySQL is in a Different Location:

Edit the scripts and update the MySQL path:

**PowerShell scripts** (`create-database.ps1` or `setup-database.ps1`):

```powershell
$mysqlPath = "C:\Your\MySQL\Path\bin\mysql.exe"
```

**Batch file** (`create-database.bat`):

```batch
set MYSQL_PATH=C:\Your\MySQL\Path\bin\mysql.exe
```

## What Happens Next?

After running any of the scripts:

1. ✅ Database `travel_agency` is created
2. ✅ You can now start the server:
   ```powershell
   npm run dev
   ```
3. ✅ The server will automatically:
   - Connect to the database
   - Run migrations (create tables)
   - Seed sample data (if not already done)

## Troubleshooting

### Script says "MySQL not found"

- Check if MySQL Server 9.4 is installed
- Update the MySQL path in the script
- Make sure MySQL Server service is running

### "Access denied" error

- Check your MySQL root password
- Make sure MySQL server is running
- Verify you have permissions to create databases

### "Database already exists"

- This is normal if you've run the script before
- The database will be reused
- You can continue with the setup

## Files Created

- ✅ `backend/scripts/create-database.ps1` - PowerShell script
- ✅ `backend/scripts/create-database.bat` - Batch file
- ✅ `backend/scripts/setup-database.ps1` - Complete setup script
- ✅ `backend/scripts/create-database.sql` - SQL script (updated)
- ✅ `backend/scripts/README.md` - Complete documentation
- ✅ `DATABASE_SETUP.md` - Updated with script references

## Next Steps

1. **Run one of the scripts** to create the database
2. **Update your `.env` file** with database credentials:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=travel_agency
   ```
3. **Start the server**:
   ```powershell
   npm run dev
   ```

Everything is ready! 🚀
