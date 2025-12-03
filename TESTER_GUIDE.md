# 🚀 Quick Start Guide for Testers

This guide will help you set up and test the Travel Agency Hotel Reservation System in **5 simple steps**.

---

## 📋 Prerequisites

Before starting, make sure you have installed:

- ✅ **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- ✅ **MySQL** (v8.0 or higher) - [Download here](https://dev.mysql.com/downloads/)
- ✅ **Git** (to clone the repository)

---

## 🎯 Step-by-Step Setup

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd fullstack-test-9s10-main
```

---

### Step 2: Set Up the Database

1. **Start MySQL** (make sure MySQL service is running)

2. **Create the database** - Open MySQL command line or MySQL Workbench and run:

```sql
CREATE DATABASE travel_agency CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

3. **Note your MySQL credentials** (username and password) - you'll need them in the next step.

---

### Step 3: Configure Backend

1. **Navigate to backend folder:**

```bash
cd backend
```

2. **Install dependencies:**

```bash
npm install
```

3. **Create environment file:**

   - Copy `.env.example` to `.env`:

   ```bash
   # On Windows (PowerShell)
   Copy-Item .env.example .env

   # On Mac/Linux
   cp .env.example .env
   ```

4. **Edit `.env` file** and update these values with your MySQL credentials:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root                    # Your MySQL username
DB_PASSWORD=your_password       # Your MySQL password
DB_NAME=travel_agency
PORT=3001
```

5. **Start the backend** (this will automatically run migrations and seed data):

```bash
npm run dev
```

✅ **You should see:**

- `Database connection pool created`
- `Server running on port 3001`
- `Database initialized successfully`
- `Seed seed_users.sql executed successfully`

**Keep this terminal open!** The backend needs to keep running.

---

### Step 4: Configure Frontend

1. **Open a NEW terminal window** (keep the backend running)

2. **Navigate to frontend folder:**

```bash
cd frontend
```

3. **Install dependencies:**

```bash
npm install
```

4. **Start the frontend:**

```bash
npm run dev
```

✅ **You should see:**

- `Local: http://localhost:3000`
- `Network: use --host to expose`

---

### Step 5: Test the Application

1. **Open your browser** and go to:

   ```
   http://localhost:3000
   ```

2. **You'll be redirected to the login page**

3. **Log in with these credentials:**

   - **Email:** `admin@agency.com`
   - **Password:** `admin123`

4. **You should now see the Dashboard!** 🎉

---

## 🧪 What to Test

### ✅ Basic Functionality

1. **Login/Logout**

   - [ ] Can log in with provided credentials
   - [ ] Can log out successfully
   - [ ] Cannot access pages without logging in

2. **Dashboard**

   - [ ] Dashboard displays statistics
   - [ ] Numbers are correct

3. **Hotel Search (Moteur Reservation)**

   - [ ] Can search hotels by country/city
   - [ ] Hotel cards display with images
   - [ ] Can see hotel details (price, location)
   - [ ] Can configure rooms (adults, children)
   - [ ] Can create a reservation

4. **Reservations**

   - [ ] Can view list of reservations
   - [ ] Can view reservation details
   - [ ] Can edit a reservation
   - [ ] Can delete a reservation
   - [ ] Confirmation dialog appears before delete

5. **Factures (Bills)**
   - [ ] Can view list of factures
   - [ ] Facture is automatically created when reservation is made
   - [ ] Can update facture status (pending/paid/cancelled)
   - [ ] Can print/view facture details
   - [ ] Can delete a facture

---

## 🐛 Troubleshooting

### Backend won't start

**Problem:** `Error: connect ECONNREFUSED` or database connection error

**Solution:**

- Make sure MySQL is running
- Check your `.env` file has correct database credentials
- Verify database `travel_agency` exists

---

### Frontend won't start

**Problem:** Port 3000 is already in use

**Solution:**

- Close other applications using port 3000
- Or change the port in `frontend/vite.config.ts`

---

### Can't log in

**Problem:** "Invalid email or password"

**Solution:**

- Make sure you ran `npm run dev` in the backend (seeds run automatically on startup)
- Check the backend terminal logs - you should see `Seed seed_users.sql executed successfully`
- If seeds didn't run, restart the backend: stop it (Ctrl+C) and run `npm run dev` again
- **Only if needed:** Run seed manually: `cd backend && npm run seed`
- Verify the user exists in database:
  ```sql
  SELECT * FROM users WHERE email = 'admin@agency.com';
  ```

---

### No hotels showing

**Problem:** Hotel list is empty

**Solution:**

- Make sure seeds ran successfully (check backend terminal logs for `Seed seed_hotels_30.sql executed successfully`)
- If seeds didn't run, restart the backend: stop it (Ctrl+C) and run `npm run dev` again
- **Only if needed:** Run seed manually: `cd backend && npm run seed`
- Check database:
  ```sql
  SELECT COUNT(*) FROM hotels;
  ```
  Should show 30 hotels

---

### Images not loading

**Problem:** Hotel cards show placeholder instead of images

**Solution:**

- This is normal if images fail to load (network issue)
- Images are loaded from Unsplash (external service)
- The placeholder icon is the fallback

---

## 📝 Test Credentials Summary

```
Email:    admin@agency.com
Password: admin123
Role:     admin
```

---

## 🎯 Quick Commands Reference

```bash
# Backend
cd backend
npm install          # Install dependencies
npm run dev          # Start backend (✅ automatically runs migrations + seeds)
npm run seed         # Manually run seeds (only if needed - usually not required)
npm run build        # Build for production

# Frontend
cd frontend
npm install          # Install dependencies
npm run dev          # Start frontend
npm run build        # Build for production
```

**Note:** Seeds run automatically when you start the backend with `npm run dev`. You only need to run `npm run seed` manually if:

- Seeds failed to run on startup
- You want to re-seed the database
- You're troubleshooting database issues

---

## 📞 Need Help?

If you encounter any issues:

1. Check the terminal output for error messages
2. Verify all prerequisites are installed
3. Make sure both backend and frontend are running
4. Check that MySQL is running and accessible
5. Review the troubleshooting section above

---

## ✅ Success Checklist

Before reporting, make sure:

- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Can log in with test credentials
- [ ] Can see dashboard
- [ ] Can search hotels
- [ ] Can create a reservation
- [ ] Can view reservations list
- [ ] Can view factures list

---

**Happy Testing! 🎉**
