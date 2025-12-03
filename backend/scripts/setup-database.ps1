# ============================================
# Complete Database Setup Script
# ============================================
# This script:
# 1. Creates the database
# 2. Runs migrations
# 3. Seeds initial data
# Usage: .\scripts\setup-database.ps1

param(
    [string]$MySQLPath = "C:\Program Files\MySQL\MySQL Server 9.4\bin\mysql.exe",
    [string]$DatabaseName = "travel_agency",
    [string]$RootUser = "root",
    [string]$RootPassword = ""
)

# Colors for output
function Write-Success { param($message) Write-Host $message -ForegroundColor Green }
function Write-Error { param($message) Write-Host $message -ForegroundColor Red }
function Write-Info { param($message) Write-Host $message -ForegroundColor Cyan }
function Write-Warning { param($message) Write-Host $message -ForegroundColor Yellow }

Write-Info "============================================"
Write-Info "Travel Agency Complete Database Setup"
Write-Info "============================================"
Write-Host ""

# Check if MySQL executable exists
if (-Not (Test-Path $MySQLPath)) {
    Write-Error "Error: MySQL not found at $MySQLPath"
    Write-Warning "Please update the MySQLPath parameter or update the script with your MySQL installation path."
    exit 1
}

# Prompt for password if not provided
if ([string]::IsNullOrEmpty($RootPassword)) {
    $securePassword = Read-Host "Enter MySQL root password (press Enter if no password)" -AsSecureString
    if ($securePassword.Length -gt 0) {
        $RootPassword = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword))
    }
}

# Build MySQL connection string
$mysqlArgs = @()
if (-Not [string]::IsNullOrEmpty($RootPassword)) {
    $mysqlArgs = @("-u", $RootUser, "-p$RootPassword")
} else {
    $mysqlArgs = @("-u", $RootUser)
}

# Step 1: Create database
Write-Info "Step 1: Creating database '$DatabaseName'..."
$createDbCommand = "CREATE DATABASE IF NOT EXISTS $DatabaseName CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

try {
    $result = & $MySQLPath $mysqlArgs -e $createDbCommand 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Success "✓ Database '$DatabaseName' created successfully!"
    } else {
        Write-Error "✗ Failed to create database: $result"
        exit 1
    }
} catch {
    Write-Error "✗ Error creating database: $_"
    exit 1
}

Write-Host ""

# Step 2: Run migrations
Write-Info "Step 2: Running database migrations..."
$migrationFile = Join-Path $PSScriptRoot "..\src\database\migrations\001_initial_schema.sql"

if (Test-Path $migrationFile) {
    try {
        $migrationSQL = Get-Content $migrationFile -Raw
        $result = $migrationSQL | & $MySQLPath $mysqlArgs $DatabaseName 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Success "✓ Migrations completed successfully!"
        } else {
            Write-Warning "⚠ Migration warnings (this might be normal if tables already exist):"
            Write-Host $result
        }
    } catch {
        Write-Error "✗ Error running migrations: $_"
        exit 1
    }
} else {
    Write-Warning "⚠ Migration file not found at: $migrationFile"
    Write-Info "You can run migrations manually or they will run automatically when you start the server."
}

Write-Host ""

# Step 3: Seed data
Write-Info "Step 3: Seeding initial data..."
$seedFile = Join-Path $PSScriptRoot "..\src\database\seeds\seed_hotels.sql"

if (Test-Path $seedFile) {
    try {
        $seedSQL = Get-Content $seedFile -Raw
        $result = $seedSQL | & $MySQLPath $mysqlArgs $DatabaseName 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Success "✓ Database seeded successfully!"
        } else {
            Write-Warning "⚠ Seeding warnings (this might be normal if data already exists):"
            Write-Host $result
        }
    } catch {
        Write-Error "✗ Error seeding database: $_"
        exit 1
    }
} else {
    Write-Warning "⚠ Seed file not found at: $seedFile"
}

Write-Host ""
Write-Info "============================================"
Write-Success "Database setup completed!"
Write-Info "============================================"
Write-Host ""
Write-Info "Next steps:"
Write-Host "1. Make sure your .env file is configured with:" -ForegroundColor White
Write-Host "   DB_HOST=localhost" -ForegroundColor Gray
Write-Host "   DB_USER=root" -ForegroundColor Gray
Write-Host "   DB_PASSWORD=<your_password>" -ForegroundColor Gray
Write-Host "   DB_NAME=travel_agency" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Run npm run dev to start the server" -ForegroundColor White
Write-Host ""

