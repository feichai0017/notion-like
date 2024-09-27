# Notion-like Application

This is a Notion-like application built with Go, using Gin as the web framework and GORM as the ORM.

## Architecture

The application follows a typical layered architecture:

1. API Layer (internal/api)
   - Handles HTTP requests and responses
   - Uses Gin for routing and middleware

2. Service Layer (internal/services)
   - Implements business logic
   - Interacts with the database and external services

3. Data Access Layer (internal/db)
   - Uses GORM to interact with the PostgreSQL database

4. Storage Layer (internal/storage)
   - Handles file storage using MinIO
   - Implements synchronization with AWS S3

## Key Components

- Authentication: JWT-based authentication
- Database: PostgreSQL
- ORM: GORM
- Web Framework: Gin
- Object Storage: MinIO (with AWS S3 sync)

## Project Structure
├── Server/
|
├── cmd/
│   └── server.go
│   └── migrate.go
├── configs/
│   └── config.go
├── internal/
│   ├── api/
│   │   └── api.go
│   │   └── routes.go
│   ├── config/
│   │   └── config.go
│   ├── db/
│   │   └── db.go
│   │   └── models.go
│   │   └── migrations.go
│   ├── services/
│   │   └── user_service.go
│   ├── storage/
│   │   └── s3.go
│   │   └── minio.go
│   └── utils/
│       └── jwt.go
│       └── password.go
├── pkg/
│   └── utils/
│       └── jwt.go
│       └── password.go

## Setup and Running

1. Clone the repository
2. Set up the .env file with necessary configurations
3. Run database migrations
4. Build and run the application:
   ```
   go build -o server
   ./server
   ```

## API Documentation

The API documentation is available in the `API.md` file.
