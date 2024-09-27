# API Documentation

## Authentication

### Register
- **POST** `/api/register`
- **Body**: `{ "username": "string", "email": "string", "password": "string" }`
- **Response**: `{ "message": "User registered successfully" }`

### Login
- **POST** `/api/login`
- **Body**: `{ "username": "string", "password": "string" }`
- **Response**: `{ "token": "JWT_TOKEN" }`

## Documents

### Get All Documents
- **GET** `/api/documents`
- **Headers**: `Authorization: Bearer JWT_TOKEN`
- **Response**: `[{ "id": "int", "title": "string", "object_storage_key": "string" }]`

### Get Document
- **GET** `/api/documents/:id`
- **Headers**: `Authorization: Bearer JWT_TOKEN`
- **Response**: `{ "id": "int", "title": "string", "object_storage_key": "string", "content": "string" }`

### Create Document
- **POST** `/api/documents`
- **Headers**: `Authorization: Bearer JWT_TOKEN`
- **Body**: `{ "title": "string", "content": "string" }`
- **Response**: `{ "id": "int", "title": "string", "object_storage_key": "string" }`

### Update Document
- **PUT** `/api/documents/:id`
- **Headers**: `Authorization: Bearer JWT_TOKEN`
- **Body**: `{ "title": "string", "content": "string" }`
- **Response**: `{ "id": "int", "title": "string", "object_storage_key": "string" }`

### Delete Document
- **DELETE** `/api/documents/:id`
- **Headers**: `Authorization: Bearer JWT_TOKEN`
- **Response**: `{ "message": "Document deleted successfully" }`

## Todo Items

### Get All Todos
- **GET** `/api/todos`
- **Headers**: `Authorization: Bearer JWT_TOKEN`
- **Response**: `[{ "id": "int", "content": "string", "is_completed": "boolean" }]`

### Get Todo
- **GET** `/api/todos/:id`
- **Headers**: `Authorization: Bearer JWT_TOKEN`
- **Response**: `{ "id": "int", "content": "string", "is_completed": "boolean" }`

### Create Todo
- **POST** `/api/todos`
- **Headers**: `Authorization: Bearer JWT_TOKEN`
- **Body**: `{ "content": "string" }`
- **Response**: `{ "id": "int", "content": "string", "is_completed": "boolean" }`

### Update Todo
- **PUT** `/api/todos/:id`
- **Headers**: `Authorization: Bearer JWT_TOKEN`
- **Body**: `{ "content": "string", "is_completed": "boolean" }`
- **Response**: `{ "id": "int", "content": "string", "is_completed": "boolean" }`

### Delete Todo
- **DELETE** `/api/todos/:id`
- **Headers**: `Authorization: Bearer JWT_TOKEN`
- **Response**: `{ "message": "Todo deleted successfully" }`