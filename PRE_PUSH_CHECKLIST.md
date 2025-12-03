# Pre-Push Checklist

## ✅ Before Pushing to Repository

### 1. Code Quality

- [x] **No linting errors** - Run `npm run lint` in both frontend and backend
- [x] **No TypeScript errors** - Run `npm run build` in both frontend and backend
- [x] **No console.log statements** - Remove debug console.log (except in logger utility)
- [x] **No TODO/FIXME comments** - All tasks completed

### 2. Environment Configuration

- [x] **`.env.example` file exists** - Template for environment variables
- [x] **`.env` is in `.gitignore`** - Never commit sensitive data
- [x] **All required env vars documented** - Listed in README and .env.example

### 3. Documentation

- [x] **README.md is up to date** - Includes setup instructions, features, architecture
- [x] **Code is commented** - JSDoc comments on functions and complex logic
- [x] **API documentation** - Postman collection included

### 4. Database

- [x] **Migrations are complete** - All migration files in place
- [x] **Seed files are ready** - Hotels and users seeded
- [x] **Database schema is correct** - Foreign keys, indexes, constraints

### 5. Features & Functionality

- [x] **Authentication works** - Login, logout, protected routes
- [x] **Hotel search works** - Search by country/city, display results
- [x] **Reservations work** - Create, read, update, delete
- [x] **Factures work** - Auto-create, manual create, update status, delete
- [x] **Dashboard works** - Stats display correctly

### 6. UI/UX

- [x] **All pages styled with Tailwind** - No CSS files, only Tailwind
- [x] **Responsive design** - Works on mobile, tablet, desktop
- [x] **Loading states** - Skeletons and spinners
- [x] **Error handling** - Toast notifications for errors/success
- [x] **Images display** - Hotel images show correctly

### 7. Security

- [x] **No secrets in code** - All secrets in .env
- [x] **Input validation** - Client and server-side validation
- [x] **Rate limiting** - Login endpoint protected
- [x] **Authentication middleware** - Protected routes work

### 8. Git

- [x] **`.gitignore` is correct** - node_modules, .env, dist, build ignored
- [x] **No large files** - No unnecessary files committed
- [x] **Meaningful commit messages** - Clear commit history

### 9. Testing (Manual)

- [ ] **Test login flow** - Can log in with seeded user
- [ ] **Test hotel search** - Search works, results display
- [ ] **Test reservation creation** - Can create reservation
- [ ] **Test reservation update** - Can edit reservation
- [ ] **Test facture generation** - Auto and manual creation
- [ ] **Test logout** - Can log out successfully

### 10. Final Checks

- [ ] **Backend starts without errors** - `npm run dev` works
- [ ] **Frontend starts without errors** - `npm run dev` works
- [ ] **Database connects** - No connection errors
- [ ] **All pages load** - No 404 errors
- [ ] **No console errors** - Check browser console

---

## Quick Commands

```bash
# Backend
cd backend
npm run lint
npm run build
npm run dev  # Test that it starts

# Frontend
cd frontend
npm run lint
npm run build
npm run dev  # Test that it starts

# Database
cd backend
npm run seed  # Ensure seeds work
```

---

## What to Push

✅ **DO Push:**

- Source code (`.ts`, `.tsx`, `.sql`)
- Configuration files (`package.json`, `tsconfig.json`, `vite.config.ts`)
- Documentation (`README.md`, `POSTMAN_COLLECTION_README.md`)
- Migration and seed files
- `.env.example` (template only)

❌ **DON'T Push:**

- `.env` (contains secrets)
- `node_modules/` (install with npm)
- `dist/` or `build/` (generated files)
- `.log` files
- IDE config files (unless team uses same IDE)

---

## After Pushing

1. Verify the repository on GitHub/GitLab
2. Test cloning the repo in a fresh directory
3. Follow README setup instructions from scratch
4. Ensure everything works in a clean environment
