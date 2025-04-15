# Docker Documentation

This document explains how Docker is implemented and used in the Centaforce Nuxt application.

## Overview

The application uses Docker for containerization, ensuring consistent development and production environments across different machines and deployment targets. The Docker setup includes:

- A multi-stage Dockerfile for optimized builds
- Docker Compose for orchestrating development and production services
- Environment-specific configurations

## Docker Configuration

## Development Workflow

### Starting Development Environment

To start the development environment using Docker:

```bash
# Build and start the development container
docker-compose up fdr-development

# Or run in detached mode
docker-compose up -d fdr-development
```

The development container:

- Maps your local files to the container
- Exposes port 3000
- Runs the Nuxt development server with hot reloading

### Building for Production

To build and run the production-ready container:

```bash
# Build and start the production container
docker-compose up fdr-production

# Or run in detached mode
docker-compose up -d fdr-production
```

The production container:

- Uses the optimized build output
- Runs with minimal dependencies
- Exposes the application on port 3001

## Environment Variables

Environment variables are passed to the Docker containers through:

1. The `.env` file (copied into the container)
2. Environment variables defined in the `docker-compose.yml`

Important environment variables include:

- `NODE_ENV`: Determines the running mode (development/production)
- `API_URL`: The base URL for API requests

## Docker Commands

Common Docker commands for this project:

```bash
# Build all services
docker-compose build

# Build a specific service
docker-compose build fdr-development

# Start all services
docker-compose up

# Start a specific service
docker-compose up fdr-development

# Start in detached mode
docker-compose up -d

# Stop all services
docker-compose down

# View container logs
docker-compose logs -f fdr-development

# Execute commands in the container
docker-compose exec fdr-development yarn install
```

### Docker Cleanup Operations

Over time, Docker can consume substantial disk space with unused containers, images, volumes, and networks. Here are commands to clean up Docker resources:

#### Stopping and Removing Containers

```bash
# Stop all running containers
docker stop $(docker ps -a -q)

# Remove all containers
docker rm $(docker ps -a -q)

# Remove a specific container
docker rm [container_id_or_name]

# Stop and remove containers defined in docker-compose.yml
docker-compose down
```

#### Managing Volumes

```bash
# List all volumes
docker volume ls

# Remove a specific volume
docker volume rm [volume_name]

# Remove all unused volumes
docker volume prune

# Remove volumes when stopping containers with docker-compose
docker-compose down -v
```

#### Cleaning Images

```bash
# Remove a specific image
docker rmi [image_id_or_name]

# Remove all unused images
docker image prune

# Remove all unused images, not just dangling ones
docker image prune -a
```

#### Complete System Cleanup

```bash
# Remove all unused containers, networks, images, and volumes
docker system prune

# Include volumes in the cleanup
docker system prune --volumes

# Deep clean (including non-dangling images)
docker system prune -a --volumes
```

#### Project-Specific Cleanup

For this project specifically, you can clean up with:

```bash
# Remove all project containers and networks
docker-compose down

# Remove all project containers, networks, and volumes
docker-compose down -v

# Remove all project containers, networks, volumes, and images
docker-compose down -v --rmi all
```

## Best Practices

1. **Use .dockerignore**: The project includes a `.dockerignore` file to exclude unnecessary files from the Docker context:

   ```
   node_modules
   npm-debug.log
   .DS_Store
   .nuxt
   output
   dist
   ```

2. **Multi-stage builds**: Uses multi-stage builds to keep production images small

3. **Development vs. Production**: Maintains separate configurations for development and production environments

4. **Volume Mounting**: Development configuration mounts local files for live editing

5. **Environment Variables**: Separate environment variables for different environments
