# Docker Setup Guide

This project includes a complete Docker setup for easy development and deployment.

## Prerequisites

- Docker and Docker Compose installed on your system
- Git (for cloning the repository)

## Quick Start

1. **Clone the repository and navigate to the project directory:**
   ```bash
   git clone <repository-url>
   cd creators-platform
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your actual configuration values
   ```

3. **Start the application:**
   ```bash
   docker-compose up --build
   ```

4. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - MongoDB: localhost:27017

## Development Workflow

The Docker setup includes development-friendly features:

- **Hot reloading** for both client and server
- **Volume mounts** for source code changes
- **Debug ports** exposed for debugging
- **Health checks** to ensure services are running

### Available Services

- **mongo**: MongoDB database with persistent data
- **server**: Express.js backend API server
- **client**: React frontend application

### Useful Commands

```bash
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f [service-name]

# Stop all services
docker-compose down

# Rebuild and restart
docker-compose up --build --force-recreate

# Clean up (removes volumes)
docker-compose down -v
```

## Environment Configuration

The application uses environment variables for configuration. Copy `.env.example` to `.env` and fill in your values:

- **Database**: MongoDB connection settings
- **JWT**: Authentication secrets
- **Cloudinary**: Image upload configuration
- **Ports**: Service port configuration

## Production Deployment

For production deployment:

1. Remove development overrides from `docker-compose.override.yml`
2. Set `NODE_ENV=production` in your environment
3. Use production-optimized Dockerfiles
4. Configure proper secrets management
5. Set up reverse proxy (nginx) for SSL termination

## Troubleshooting

- **Port conflicts**: Change ports in `.env` file
- **Permission issues**: Ensure Docker has access to project directory
- **Build failures**: Clear Docker cache with `docker system prune`
- **Database connection**: Check MongoDB logs with `docker-compose logs mongo`