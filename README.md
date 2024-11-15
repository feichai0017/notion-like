# <img src="https://github.com/lucide-icons/lucide/blob/main/icons/book-open-check.svg" width="32" height="32" alt="Notion-like App Logo"> Notion-like Application

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Go Report Card](https://goreportcard.com/badge/github.com/yourusername/notion-like-app)](https://goreportcard.com/report/github.com/yourusername/notion-like-app)
[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![Go](https://img.shields.io/badge/Go-1.23+-00ADD8.svg)](https://golang.org)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![GitHub issues](https://img.shields.io/github/issues/feichai0017/notion-like.svg)](https://github.com/feichai0017/notion-like/issues)
[![GitHub stars](https://img.shields.io/github/stars/feichai0017/notion-like.svg)](https://github.com/feichai0017/notion-like/stargazers)


A powerful and flexible Notion-like application for document management, task organization, and collaborative work. Built with Go and React, this application offers a seamless experience for creating, editing, and organizing your digital workspace.

## Features

- Document Management: Create, edit, and organize documents with rich text formatting
- Task Management: Create to-do lists, set reminders, and track your progress
- Collaborative Workspace: Share and collaborate on documents in real-time
- Cloud Sync: Seamlessly sync your data across devices
- File Attachments: Upload and attach files to your documents
- Dark Mode: Toggle between light and dark themes for comfortable viewing
- Customizable Templates: Use pre-defined templates or create your own
- Search Functionality: Quickly find your documents and tasks
- Version History: Track changes and revert to previous versions of your documents
- API Integration: Connect with other tools and services through our API

## Demo

![Application Demo](/demo.gif)

## Architecture

The application follows a modern, scalable architecture:

### Frontend

- React for the user interface
- Next.js for server-side rendering and routing
- Tailwind CSS for styling
- State management with React Context API and hooks

### Backend

- Go programming language
- Gin web framework for routing and middleware
- GORM as the ORM for database interactions
- PostgreSQL for data storage
- MinIO for object storage (with AWS S3 sync)
- JWT for authentication

## Project Structure
<pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
notion-like-app/
├── Server/
│   ├── cmd/
│   │   └── server/
│   │       └── main.go
│   ├── internal/
│   │   ├── api/
│   │   │   ├── handlers/
│   │   │   │   ├── documents.go
│   │   │   │   ├── todos.go
│   │   │   │   └── users.go
│   │   │   ├── middlewares/
│   │   │   │   └── auth.go
│   │   │   └── routes.go
│   │   ├── config/
│   │   │   └── config.go
│   │   ├── db/
│   │   │   └── db.go
│   │   ├── models/
│   │   │   ├── document.go
│   │   │   ├── todo.go
│   │   │   └── user.go
│   │   ├── services/
│   │   │   ├── document_service.go
│   │   │   ├── todo_service.go
│   │   │   └── user_service.go
│   │   └── storage/
│   │       ├── minio.go
│   │       └── s3.go
│   ├── pkg/
│   │   └── utils/
│   │       ├── jwt.go
│   │       └── password.go
│   ├── migrations/
│   │   └── table.sql
│   ├── .gitignore
│   ├── API.MD
│   ├── CHANGES.MD
│   ├── README.md
│   ├── go.mod
│   └── go.sum
├── Client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── utils/
│   │   ├── App.js
│   │   └── index.js
│   ├── .gitignore
│   ├── package.json
│   └── README.md
├── .gitignore
└── README.md
</pre>
## Setup and Running

1. Clone the repository
2. Set up the .env file with necessary configurations
3. Run database migrations:
   go run cmd/migrate.go
   Copy4. Start the backend server:
   go build -o server cmd/server.go
   ./server
   Copy5. Install frontend dependencies:
   cd frontend && npm install
   Copy6. Start the frontend development server:
   npm run dev
   Copy
## API Documentation

The API documentation is available in the `API.md` file. It provides detailed information about the available endpoints, request/response formats, and authentication requirements.

## Contributing

We welcome contributions to improve the application. Please read our `CONTRIBUTING.md` file for guidelines on how to submit pull requests, report issues, and suggest enhancements.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

© 2024 Notion-like Application. All rights reserved.
