# Docker Quick Start Guide

## 🚀 Quick Start (3 Steps)

### 1. Create Environment File

```bash
# Copy the example
cp .env.docker.example .env
```

Or create `.env` with:

```env
DB_USER=root
DB_PASSWORD=rootpassword
DB_NAME=travel_agency
DB_PORT=3306
BACKEND_PORT=3001
```

### 2. Start Services

```bash
docker-compose up -d
```

### 3. Verify

```bash
# Check services are running
docker-compose ps

# Check backend health
curl http://localhost:3001/health

# Test API
curl http://localhost:3001/api/hotels
```

## 🎯 Common Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild after code changes
docker-compose up -d --build

# Reset everything (removes data!)
docker-compose down -v
```

## 📋 What Gets Created

- **MySQL Database**: `travel_agency` (auto-created)
- **Tables**: Auto-created from migrations
- **Sample Data**: Auto-seeded (5 hotels)
- **Backend API**: Running on `http://localhost:3001`

## 🔧 Troubleshooting

### Port Already in Use

Change ports in `.env`:

```env
DB_PORT=3307
BACKEND_PORT=3002
```

### Database Connection Issues

Check MySQL logs:

```bash
docker-compose logs mysql
```

### Rebuild Backend

```bash
docker-compose up -d --build backend
```

## 📚 Full Documentation

See [DOCKER_SETUP.md](./DOCKER_SETUP.md) for complete documentation.

---

**That's it!** Your application is now running in Docker. 🎉
