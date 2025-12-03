# Environment Variables Setup

## Quick Setup

1. **Create `.env` file in the `backend/` directory**

2. **Copy the following content into your `.env` file:**

```env
# ============================================
# Travel Agency Backend - Environment Variables
# ============================================

# ============================================
# Server Configuration
# ============================================
# Environment: development, production, test
NODE_ENV=development

# Server port (default: 3001)
PORT=3001

# ============================================
# Database Configuration
# ============================================
# MySQL Database Host
DB_HOST=localhost

# MySQL Database Port (default: 3306)
DB_PORT=3306

# MySQL Database Username
DB_USER=root

# MySQL Database Password
# Leave empty if no password is set, or provide your MySQL password
DB_PASSWORD=

# MySQL Database Name
# Make sure this database exists (see DATABASE_SETUP.md)
DB_NAME=travel_agency
```

3. **Update the values** according to your MySQL setup:
   - If your MySQL has a password, set `DB_PASSWORD=your_password`
   - If your MySQL runs on a different port, update `DB_PORT`
   - If you want a different database name, update `DB_NAME`

## Example Configurations

### Local Development (No Password)

```env
NODE_ENV=development
PORT=3001
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=travel_agency
```

### Local Development (With Password)

```env
NODE_ENV=development
PORT=3001
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=mypassword123
DB_NAME=travel_agency
```

### Remote Database

```env
NODE_ENV=development
PORT=3001
DB_HOST=your-db-host.com
DB_PORT=3306
DB_USER=dbuser
DB_PASSWORD=securepassword
DB_NAME=travel_agency
```

## Important Notes

- **Never commit `.env` file to version control** - it contains sensitive information
- The `.env` file is already in `.gitignore`
- Always use `.env.example` as a template (if it exists) or copy from this guide
- Make sure the database exists before starting the server (see [DATABASE_SETUP.md](./DATABASE_SETUP.md))

## Verification

After creating your `.env` file, verify it works:

```bash
cd backend
npm run dev
```

You should see:

- "Database connection pool created"
- "Database initialized successfully"
- "Server running on port 3001"

If you see errors, check:

1. MySQL is running
2. Database credentials are correct
3. Database exists (run the SQL script in `DATABASE_SETUP.md`)
