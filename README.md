# Task Management Application

This is a full-stack task management application built with Angular (frontend) and .NET Core (backend), using MariaDB as the database.

## Requirements

- .NET SDK 8.0
- Docker and Docker Compose
- Node.js (v16 or later)
- Angular CLI (v17 or later)
- npm (v8 or later)

## Project Structure

### Frontend (`/frontend`)
- Angular application running on port 4200
- Key directories:
  - `/src`: Source code for the Angular application
  - `/public`: Public assets
  - `/dist`: Build output
- Configuration files:
  - `angular.json`: Angular CLI configuration
  - `tsconfig.json`: TypeScript configuration
  - `package.json`: Node.js dependencies

### Backend (`/backend`)
- .NET Core API running on port 5001
- Key directories:
  - `/TaskApi`: Main API project
    - `/Controllers`: API endpoints
    - `/Models`: Data models
    - `/Migrations`: Database migrations
  - `/docker`: Docker configuration files

## Docker Setup

The application uses Docker Compose for containerization with separate configurations for frontend and backend.

### Frontend Docker Setup

```bash
cd frontend
docker-compose up --build
```

This will:
- Build and run the Angular application in a container
- Map port 4200 to the host
- Mount the source code for live development
- Connect to the task-management-network

### Backend Docker Setup

```bash
cd backend/docker
docker-compose up --build
```

This will:
- Start the .NET Core API container
- Start a MariaDB container
- Set up the following:
  - API running on port 5001
  - Database running on port 3306
  - Persistent volume for MariaDB data
  - Health checks for the database
  - Network connectivity between services

### Environment Variables

#### Frontend
- `NODE_ENV`: Set to development by default

#### Backend
- `ASPNETCORE_ENVIRONMENT`: Development
- `ASPNETCORE_URLS`: http://+:5001
- Database connection string is configured automatically

#### Database
- Database Name: taskdb
- User: taskuser
- Password: taskpass
- Root Password: rootpass

## Getting Started

1. Start the frontend application:
```bash
cd frontend
docker-compose up --build
```
The Frontend must be started first in order to create the network


2. Start the backend services:
```bash
cd backend/docker
docker-compose up --build
```

3. Access the application:
- Frontend: http://localhost:4200
- Backend API: http://localhost:5001

## Development

The Docker setup includes volume mounts for both frontend and backend, enabling live reload during development. Any changes made to the source code will be reflected in the running containers. 