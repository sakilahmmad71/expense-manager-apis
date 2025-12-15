# Containerized Docker Architecture

## Overview

This project implements a **Containerized Docker Architecture** where each
service is deployed in isolated containers and accessed via localhost during
development and your configured domain in production.

## Architecture Pattern

### Access Points

- **Production API**: `http://your-server-ip:3000` or `https://your-domain.com`
  (with nginx/reverse proxy)
- **Development API**: `http://localhost:3000` (local development)
- **Frontend**: `http://localhost:5173` (local development)

### Components

```
┌─────────────────────────────────────────────────────────────┐
│                     Internet/Users                          │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
        ┌──────────────────────────────────┐
        │   Nginx Reverse Proxy (Optional) │
        │   - SSL/TLS Termination          │
        │   - Load Balancing               │
        │   - Rate Limiting                │
        │   - Request Routing              │
        └──────────────┬───────────────────┘
                       │
        ┌──────────────┴──────────────┐
        │                             │
        ▼                             ▼
┌───────────────┐            ┌───────────────┐
│  Production   │            │  Development  │
│  Container    │            │   Container   │
│               │            │               │
│ api:3000      │            │ api:3000      │
└───────┬───────┘            └───────┬───────┘
        │                            │
        ▼                            ▼
┌───────────────┐            ┌───────────────┐
│  PostgreSQL   │            │  PostgreSQL   │
│  (Production) │            │ (Development) │
└───────────────┘            └───────────────┘
```

## Environment Configuration

### Development

- **Purpose**: Local development with hot reload
- **Access**: http://localhost:3000
- **Features**:
  - Direct API access (no nginx)
  - Hot reload enabled
  - Source code mounted as volumes
  - Fast iteration cycle
  - PostgreSQL on localhost:5432

### Production

- **Purpose**: Live production environment
- **Access**: http://your-server-ip:3000 or https://your-domain.com (with
  reverse proxy)
- **Features**:
  - Optimized production build
  - Optional SSL/TLS encryption (via nginx/reverse proxy)
  - Rate limiting and security headers
  - Database connection pooling
  - Health checks and monitoring
  - Resource limits and memory optimization

## Docker Compose Files

### docker-compose.development.yml

- API container with hot reload (nodemon)
- PostgreSQL database
- Direct port exposure (3000)
- Volume mounts for source code
- Debug port exposed (9229)

### docker-compose.production.yml

- API container (production build)
- PostgreSQL database with performance tuning
- Resource limits (memory and CPU)
- Health checks enabled
- **Note**: Ports can be exposed or kept internal depending on your reverse
  proxy setup

## Nginx Configuration (Optional)

If you choose to use nginx as a reverse proxy:

### Basic Configuration

- Upstream: `localhost:3000` or `api:3000` (if in same Docker network)
- Server name: Your domain or server IP
- Port: 80 for HTTP, 443 for HTTPS
- SSL certificates: Use Let's Encrypt or your SSL provider
- Rate limiting recommended for production
- CORS headers configuration

## Network Isolation

Each environment has its own Docker network:

- `expense-manager-network-development`
- `expense-manager-network-production`

This ensures complete isolation between environments.

## Volume Management

### Development

- `expense-manager-postgres-volume-development`: Database data
- `expense-manager-api-node-modules-development`: Node modules (performance)
- Host mounts: `./src`, `./prisma`, `./logs`

### Production

- `expense-manager-postgres-production-volume`: Database data
- Host mounts: `./logs`

## Port Allocation

| Environment | API Port | DB Port | Debug Port |
| ----------- | -------- | ------- | ---------- |
| Development | 3000     | 5432    | 9229       |
| Production  | 3000\*   | 5432\*  | -          |

**Note**: Production ports can be kept internal (not exposed) if using a reverse
proxy. The `*` indicates optional port exposure.

## Deployment Strategy

### Development

```bash
make dev
```

Access at: http://localhost:3000

### Production

1. Update production environment variables:

   ```bash
   nano .env.production
   ```

   - Set strong `POSTGRES_PASSWORD`
   - Generate secure `JWT_SECRET` with: `openssl rand -hex 32`
   - Configure `CORS_ORIGIN` to your frontend URL

2. Build and start production containers:

   ```bash
   make prod
   ```

3. (Optional) Set up nginx reverse proxy:
   - Install nginx on host server
   - Configure upstream to `localhost:3000`
   - Set up SSL certificates (Let's Encrypt recommended)
   - Configure your domain DNS to point to server IP
   - Enable rate limiting and security headers

## Environment Variables

Each environment has its own `.env` file:

- `.env.development`
- `.env.production`

### Key Variables

- `DATABASE_URL`: PostgreSQL connection string
  - Development: `postgresql://expenseuser:expensepass@localhost:5432/expensedb`
  - Production: `postgresql://expenseuser:YOUR_PASSWORD@postgres:5432/expensedb`

- `JWT_SECRET`: Secret key for JWT token signing
  - Development: Can use any value
  - Production: Generate with `openssl rand -hex 32`

- `JWT_EXPIRES_IN`: Token expiration time (e.g., `7d`, `24h`)

- `CORS_ORIGIN`: Allowed frontend origins
  - Development: `http://localhost:5173`
  - Production: `https://your-frontend-domain.com` or
    `http://your-server-ip:5173`

- `NODE_ENV`: Environment mode
  - Development: `development`
  - Production: `production`

- `LOG_LEVEL`: Logging verbosity
  - Development: `debug`
  - Production: `info`

## Benefits of This Architecture

1. **Environment Isolation**: Each environment runs independently with separate
   networks and volumes
2. **Scalability**: Easy to scale horizontally with multiple API containers
3. **Security**: Network isolation and container-based security
4. **Flexibility**: Easy to deploy on any server with Docker support
5. **Portability**: Consistent behavior across different environments and
   servers
6. **Development Speed**: Direct API access in development for fast iteration
7. **Resource Control**: Memory and CPU limits prevent resource exhaustion

## Best Practices

1. **Never expose database ports** to the internet in production
2. **Use SSL/TLS** for all production traffic (via reverse proxy)
3. **Keep environment variables** secure and never commit sensitive values to
   git
4. **Generate strong secrets** for production (use `openssl rand -hex 32`)
5. **Monitor health endpoints** (`/api/v1/health`) regularly
6. **Use named volumes** for data persistence
7. **Implement rate limiting** if using a reverse proxy
8. **Configure CORS** properly for your frontend domain
9. **Enable resource limits** (memory and CPU) in production
10. **Implement proper logging** and monitor container logs
11. **Backup your PostgreSQL data** regularly
12. **Keep Docker images updated** for security patches
