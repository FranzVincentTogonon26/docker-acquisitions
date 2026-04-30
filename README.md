# Docker Acquisitions App

A Node.js application using Express, Neon Database, and Drizzle ORM, containerized for development and production environments.

## Prerequisites

- Docker and Docker Compose
- Node.js (for local development and scripts)
- Neon account with a database project

## Setup

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd docker-acquisitions
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables:

   ### Development

   Copy and update `.env.development`:

   ```bash
   cp .env.development .env.development.example  # If you have a template
   # Edit .env.development with your Neon API credentials
   ```

   ### Production

   Copy and update `.env.production`:

   ```bash
   cp .env.production .env.production.example  # If you have a template
   # Edit .env.production with your production Neon database URL and secrets
   ```

## Development Environment

The development setup uses **Neon Local** to run a local PostgreSQL proxy that creates ephemeral branches for development and testing.

### Starting Development Environment

```bash
./scripts/dev.sh
```

This script will:

- Check for `.env.development`
- Start Neon Local proxy in Docker
- Run database migrations
- Start the application with hot reload

The app will be available at `http://localhost:3000`.

Database connection: `postgresql://neon:npg@neon-local:5432/neondb`

### Stopping Development Environment

```bash
docker compose -f docker-compose.dev.yml down
```

## Production Environment

The production setup connects directly to your **Neon Cloud Database**.

### Starting Production Environment

```bash
./scripts/prod.sh
```

This script will:

- Check for `.env.production`
- Run database migrations against the cloud database
- Start the production container

The app will be available at `http://localhost:3000`.

### Stopping Production Environment

```bash
docker compose -f docker-compose.prod.yml down
```

## Environment Variables

### DATABASE_URL Switching

- **Development**: `NEON_DATABASE_URL=postgresql://neon:npg@neon-local:5432/neondb`
- **Production**: `NEON_DATABASE_URL=postgresql://[your-neon-cloud-url]`

The application automatically detects the environment and configures Neon accordingly:

- For local/Neon Local URLs, it uses HTTP fetch endpoint
- For cloud URLs, it uses secure connections

### Required Variables

- `PORT`: Application port (default: 3000)
- `NODE_ENV`: Environment (development/production)
- `NEON_DATABASE_URL`: Database connection string
- `JWT_SECRET`: Secret for JWT tokens
- `ARCJET_key`: Arcjet security key

## Docker Configuration

### Dockerfile

Multi-stage build:

- `base`: Node.js 18 Alpine with dependencies
- `development`: Includes dev dependencies, runs with `npm run dev`
- `production`: Optimized for production, runs with `npm start`

### Docker Compose Files

- `docker-compose.dev.yml`: Runs app + Neon Local proxy
- `docker-compose.prod.yml`: Runs app only (connects to cloud DB)

## Database Management

### Migrations

Run migrations with Drizzle:

```bash
# Development (after starting Neon Local)
export NEON_DATABASE_URL=postgresql://neon:npg@localhost:5432/neondb
npm run db:migrate

# Production
set -a && source .env.production && set +a
npm run db:migrate
```

### Schema Generation

```bash
npm run db:generate
```

### Database Studio

```bash
npm run db:studio
```

## Health Checks

The application includes health endpoints:

- `GET /health`: Basic health check
- `GET /`: Application status

Docker containers include health checks for automatic restarts.

## Logging

- Development: Console logging
- Production: File logging to `./logs/`

## Security

- Helmet for security headers
- CORS enabled
- Arcjet for additional security
- Non-root user in production containers

## Troubleshooting

### Common Issues

1. **Docker not running**: Ensure Docker Desktop is started
2. **Port conflicts**: Check if ports 3000 and 5432 are available
3. **Environment files missing**: Ensure `.env.development` or `.env.production` exist
4. **Database connection**: Verify Neon credentials and network connectivity

### Logs

View application logs:

```bash
docker logs acquisitions-app-dev  # Development
docker logs acquisitions-app-prod  # Production
```

View Neon Local logs:

```bash
docker logs acquisitions-neon-local
```

## Deployment

For production deployment:

1. Set up your Neon cloud database
2. Configure `.env.production` with production secrets
3. Run `./scripts/prod.sh` on your server
4. Set up reverse proxy (nginx, etc.) for port 3000

## Contributing

1. Use the development environment for feature development
2. Run tests and linting: `npm run lint`
3. Format code: `npm run format`
4. Commit changes following conventional commits
