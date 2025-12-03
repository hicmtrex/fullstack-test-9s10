# Docker Setup Guide

This guide explains how to run the Travel Agency application using Docker.

## Prerequisites

- Docker Desktop installed (Windows/Mac) or Docker Engine (Linux)
- Docker Compose (usually included with Docker Desktop)

## Quick Start

### Option 1: Full Stack (Backend + MySQL)

Run everything in Docker:

```bash
# From project root
docker-compose up -d
```

This will:

- Start MySQL container
- Build and start backend container
- Automatically run migrations
- Seed initial data

### Option 2: MySQL Only (Backend runs locally)

Run only MySQL in Docker, backend locally:

```bash
# From backend directory
cd backend
docker-compose up -d
```

Then update your `.env` file:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=rootpassword
DB_NAME=travel_agency
```

## Configuration

### Environment Variables

Create a `.env` file in the project root (or use the existing one):

```env
# Database Configuration
DB_USER=app_user
DB_PASSWORD=app_password
DB_NAME=travel_agency
DB_PORT=3306

# Backend Configuration
NODE_ENV=production
BACKEND_PORT=3001

# Frontend Configuration (if using)
FRONTEND_PORT=3000
```

### Docker Compose Services

#### MySQL Service

- **Image**: `mysql:9.4`
- **Port**: `3306` (mapped to host)
- **Volume**: Persistent data storage
- **Health Check**: Monitors MySQL availability
- **Auto-init**: Runs migrations and seeds on first start

#### Backend Service

- **Build**: From `backend/Dockerfile`
- **Port**: `3001` (mapped to host)
- **Depends on**: MySQL (waits for MySQL to be healthy)
- **Health Check**: Monitors API availability

## Commands

### Start Services

```bash
docker-compose up -d
```

### Stop Services

```bash
docker-compose down
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f mysql
```

### Rebuild After Code Changes

```bash
docker-compose up -d --build
```

### Stop and Remove Volumes (Clean Start)

```bash
docker-compose down -v
```

### Access MySQL Container

```bash
docker-compose exec mysql mysql -u root -p
```

### Access Backend Container

```bash
docker-compose exec backend sh
```

## Development Workflow

### Recommended: MySQL in Docker, Backend Local

1. **Start MySQL**:

   ```bash
   cd backend
   docker-compose up -d
   ```

2. **Configure `.env`**:

   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=rootpassword
   DB_NAME=travel_agency
   ```

3. **Run backend locally**:
   ```bash
   npm run dev
   ```

### Full Docker Setup

1. **Build and start**:

   ```bash
   docker-compose up -d --build
   ```

2. **Check status**:

   ```bash
   docker-compose ps
   ```

3. **View logs**:
   ```bash
   docker-compose logs -f
   ```

## Database Initialization

The MySQL container automatically:

1. Creates the database
2. Runs migrations from `backend/src/database/migrations/`
3. Seeds data from `backend/src/database/seeds/`

This happens on first start only.

## Troubleshooting

### MySQL Connection Issues

If you see connection errors:

1. **Check MySQL is healthy**:

   ```bash
   docker-compose ps
   ```

2. **Check MySQL logs**:

   ```bash
   docker-compose logs mysql
   ```

3. **Verify connection from host**:
   ```bash
   mysql -h localhost -P 3306 -u root -p
   ```

### Backend Build Issues

1. **Rebuild without cache**:

   ```bash
   docker-compose build --no-cache backend
   ```

2. **Check build logs**:
   ```bash
   docker-compose build backend
   ```

### Port Already in Use

If port 3306 or 3001 is already in use:

1. **Change ports in docker-compose.yml**:

   ```yaml
   ports:
     - "3307:3306" # Use 3307 instead of 3306
   ```

2. **Update `.env` accordingly**:
   ```env
   DB_PORT=3307
   ```

### Reset Everything

```bash
# Stop and remove containers, networks, and volumes
docker-compose down -v

# Remove images (optional)
docker-compose rm -f

# Start fresh
docker-compose up -d --build
```

## Production Considerations

### Security

1. **Change default passwords** in `.env`
2. **Use secrets management** (Docker secrets, Kubernetes secrets, etc.)
3. **Enable SSL** for MySQL connections
4. **Use non-root user** for MySQL
5. **Limit network exposure**

### Performance

1. **Resource limits** in docker-compose.yml:

   ```yaml
   deploy:
     resources:
       limits:
         cpus: "1"
         memory: 1G
   ```

2. **Connection pooling** (already configured)
3. **Database indexes** (already in migrations)

### Monitoring

1. **Health checks** (already configured)
2. **Log aggregation** (consider ELK stack, Loki, etc.)
3. **Metrics** (Prometheus, Grafana)

## File Structure

```
.
├── docker-compose.yml          # Full stack compose
├── backend/
│   ├── Dockerfile              # Backend container definition
│   ├── .dockerignore           # Files to exclude from build
│   └── docker-compose.yml      # MySQL-only compose
└── .env                        # Environment variables
```

## Next Steps

1. **Start the services**: `docker-compose up -d`
2. **Check health**: `curl http://localhost:3001/health`
3. **Access API**: `http://localhost:3001/api/hotels`
4. **View logs**: `docker-compose logs -f`

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [MySQL Docker Image](https://hub.docker.com/_/mysql)

---

**Ready to use!** Start with `docker-compose up -d` and everything will be set up automatically.
