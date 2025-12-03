# ============================================
# Create Travel Agency Database Script
# ============================================
# This script creates the MySQL database for the Travel Agency application
# Usage: .\scripts\create-database.ps1

$mysqlPath = "C:\Program Files\MySQL\MySQL Server 9.4\bin\mysql.exe"

# Check if MySQL executable exists
if (-Not (Test-Path $mysqlPath)) {
    Write-Host "Error: MySQL not found at $mysqlPath" -ForegroundColor Red
    Write-Host "Please update the mysqlPath variable in this script with your MySQL installation path." -ForegroundColor Yellow
    exit 1
}

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Travel Agency Database Setup" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Prompt for MySQL root password
$securePassword = Read-Host "Enter MySQL root password (press Enter if no password)" -AsSecureString
$password = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword))

# Build MySQL command
$mysqlCommand = "CREATE DATABASE IF NOT EXISTS travel_agency CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

Write-Host "Creating database 'travel_agency'..." -ForegroundColor Yellow

# Execute MySQL command
if ([string]::IsNullOrEmpty($password)) {
    # No password
    $result = & $mysqlPath -u root -e $mysqlCommand 2>&1
} else {
    # With password
    $result = & $mysqlPath -u root -p$password -e $mysqlCommand 2>&1
}

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Database 'travel_agency' created successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Update your .env file with database credentials" -ForegroundColor White
    Write-Host "2. Run npm run dev to start the server" -ForegroundColor White
    Write-Host "3. The migrations will run automatically" -ForegroundColor White
} else {
    Write-Host "✗ Error creating database:" -ForegroundColor Red
    Write-Host $result -ForegroundColor Red
    Write-Host ""
    Write-Host "Troubleshooting:" -ForegroundColor Yellow
    Write-Host "- Check if MySQL server is running" -ForegroundColor White
    Write-Host "- Verify your MySQL root password" -ForegroundColor White
    Write-Host "- Make sure you have permissions to create databases" -ForegroundColor White
    exit 1
}

