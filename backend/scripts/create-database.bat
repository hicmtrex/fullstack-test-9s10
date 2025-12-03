@echo off
REM ============================================
REM Create Travel Agency Database Script (Batch)
REM ============================================
REM This script creates the MySQL database for the Travel Agency application
REM Usage: scripts\create-database.bat

set MYSQL_PATH=C:\Program Files\MySQL\MySQL Server 9.4\bin\mysql.exe

echo ============================================
echo Travel Agency Database Setup
echo ============================================
echo.

REM Check if MySQL executable exists
if not exist "%MYSQL_PATH%" (
    echo Error: MySQL not found at %MYSQL_PATH%
    echo Please update the MYSQL_PATH variable in this script with your MySQL installation path.
    pause
    exit /b 1
)

echo Creating database 'travel_agency'...
echo.

REM Prompt for MySQL root password
set /p MYSQL_PASSWORD="Enter MySQL root password (press Enter if no password): "

REM Execute MySQL command
if "%MYSQL_PASSWORD%"=="" (
    "%MYSQL_PATH%" -u root -e "CREATE DATABASE IF NOT EXISTS travel_agency CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
) else (
    "%MYSQL_PATH%" -u root -p%MYSQL_PASSWORD% -e "CREATE DATABASE IF NOT EXISTS travel_agency CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
)

if %ERRORLEVEL% EQU 0 (
    echo.
    echo [SUCCESS] Database 'travel_agency' created successfully!
    echo.
    echo Next steps:
    echo 1. Update your .env file with database credentials
    echo 2. Run 'npm run dev' to start the server
    echo 3. The migrations will run automatically
) else (
    echo.
    echo [ERROR] Failed to create database
    echo.
    echo Troubleshooting:
    echo - Check if MySQL server is running
    echo - Verify your MySQL root password
    echo - Make sure you have permissions to create databases
)

pause

