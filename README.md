# DoubtConnect

DoubtConnect is a community Q&A platform where learners post doubts (questions) and others provide answers. This repository contains a Java Spring Boot backend, a React + Vite frontend, and SQL schema files for a MySQL database.

---

## Project overview & problem statement

Many learning platforms need a lightweight, open Q&A service where users can post questions, track answers, and interact securely. DoubtConnect provides a simple, opinionated reference implementation for:
- User registration, authentication, and session management
- Posting and browsing doubts (questions)
- Adding, updating, and deleting answers
- Role-based request protection via JWT

This repo is intended for learning, small deployments, and as a starting point for larger systems.

---

## Features

- User signup and login (JWT-based authentication)
- Create / read / update / delete doubts
- Post, update and delete answers
- View a feed of others' doubts and view personal doubts/answers
- Secure APIs with Spring Security and BCrypt password hashing
- CORS configured for local frontend dev

---

## Tech stack

- Frontend: React 19 + Vite, Tailwind CSS
- Backend: Spring Boot (Java 21), Spring Data JPA, Spring Security, JJWT, Lombok
- Database: MySQL
- Build & tooling: Maven (backend), npm + Vite (frontend), ESLint

---

## System architecture (high level)

Three-tier architecture:

- Frontend (React + Vite): Single-page app, presents UI and calls backend APIs.
- Backend (Spring Boot): REST API exposing authentication and CRUD endpoints; stateless JWT-based authentication.
- Database (MySQL): Persists `User`, `Doubt`, and `Answer` entities.

Authentication flow:

1. Client posts credentials to `/auth/login`.
2. Backend authenticates with `UserDetailsService` and `PasswordEncoder`.
3. Backend generates a signed JWT (`JwtService`) and sends it as an HTTP-only `jwt` cookie.
4. For protected requests, `JwtAuthFilter` validates the cookie and populates `SecurityContext`.

---

## Folder structure

Top-level important files/folders:

- `backend/` — Spring Boot application
  - `src/main/java/com/app/doubtconnect/controller/` — `AuthController`, `DoubtController`, `AnswerController`
  - `src/main/java/com/app/doubtconnect/service/` — business logic classes
  - `src/main/java/com/app/doubtconnect/repository/` — JPA repositories
  - `src/main/java/com/app/doubtconnect/model/` — JPA entities (`User`, `Doubt`, `Answer`)
  - `src/main/java/com/app/doubtconnect/security/` — `JwtService`, `JwtAuthFilter`, `SecurityConfig`, `CorsConfig`, `UserInfoService`
  - `src/main/resources/application.properties` — configuration (DB URL, credentials, port)

- `frontend/` — React single page app (Vite)
  - `src/` — `main.jsx`, `App.jsx`, styles
  - `package.json`, `vite.config.js` — frontend config

- `database/` — `schema.sql`, `queries.sql`

See these folders for full implementation.

---

## Backend architecture (controller → service → repository)

- Controllers: Accept HTTP requests, parse DTOs, return ResponseEntity. Keep controllers thin.
- Services: Contain transactional business logic (`@Transactional`). Services:
  - Validate domain rules
  - Load authenticated user from `SecurityContext` as needed
  - Coordinate repository reads/writes
  - Map entities to response DTOs
- Repositories: `JpaRepository` interfaces with method-derivation queries for common lookups (e.g., find by username, find doubts by user).

Key security components:

- `JwtService` — generate/validate JWT tokens
- `JwtAuthFilter` — extract token from cookie, validate and set authentication
- `SecurityConfig` — HTTP security rules, stateless sessions, authentication provider, password encoder
- `CorsConfig` — allow frontend origin and credentials (for cookie use)

---

## Frontend architecture

- Components: `App.jsx` is the entrypoint; recommend structuring into `src/components/`, `src/pages/`, `src/layouts/`, `src/hooks/`, `src/services/`.
- Routing: currently no router present; add `react-router-dom` for routes: `/login`, `/feed`, `/doubt/:id`, `/profile`.
- State management: use React Context for auth, and React Query or SWR for server state (feed, doubts, answers). Keep local UI state in component-level state.
- API integration: centralize calls in `src/services/api.js`, always use requests with credentials (`credentials: 'include'` or `axios.withCredentials = true`) because backend sends an HTTP-only cookie.

---

## Database design

Core tables and relationships (see `database/schema.sql`):

- `user` (primary key: `username`)
  - `first_name`, `last_name`, `password` (BCrypt-hashed), `role`
- `doubt` (primary key: `doubt_id`)
  - `title`, `description`, `asked_by` (FK → `user.username`)
- `answer` (primary key: `answer_id`)
  - `content`, `doubt_id` (FK → `doubt.doubt_id` ON DELETE CASCADE), `answered_by` (FK → `user.username`)

Relationships:

- One `User` → many `Doubt`
- One `User` → many `Answer`
- One `Doubt` → many `Answer` (cascade delete recommended)

---

## REST API (summary)

Base URL: `http://localhost:8081`

Authentication:
- POST `/auth/signup` — register (SignupDTO)
- POST `/auth/login` — login (LoginDTO) -> sets `jwt` cookie
- POST `/auth/logout` — clears cookie

Doubts:
- POST `/api/doubts/post` — create doubt (DoubtDTO)
- GET `/api/doubts/feed` — feed (others' doubts)
- GET `/api/doubts/{id}` — get specific doubt with answers
- GET `/api/doubts/me` — get current user's doubts

Answers:
- POST `/api/answer/comment` — create answer (AnswerDTO)
- GET `/api/answer/comment/{id}` — get answer by id
- PUT `/api/answer/comment/{id}` — update answer
- DELETE `/api/answer/comment/{id}` — delete answer
- GET `/api/answer/allComments` — list all answers
- GET `/api/answer/comments/me` — current user's answers

Responses use DTOs that map entities to simplified payloads (see `dto/` folder).

---

## Authentication & security

- Passwords hashed with BCrypt via `PasswordEncoder`.
- JWT tokens are generated with `JwtService` and signed; token lifetime is configurable in code.
- Tokens are sent to the client as an HTTP-only cookie named `jwt` (prevents JS access). For development, CORS is configured to allow the frontend origin and credentials.
- `JwtAuthFilter` runs before protected endpoints and populates the `SecurityContext` when token is valid.
- Security rules are defined in `SecurityConfig` — public endpoints (`/auth/signup`, `/auth/login`, `/public/**`) are permitted; `/api/**` routes require `ROLE_USER`.

Security notes:

- For production, ensure the cookie uses `Secure` (HTTPS) and proper `SameSite` settings.
- Consider server-side token revocation (blacklist) if immediate logout revocation is required.

---

## Exception handling

- Services should throw domain-specific exceptions (e.g., `ResourceNotFoundException`, `BadRequestException`) and controllers should map them to appropriate HTTP statuses.
- Add a global exception handler (`@RestControllerAdvice`) to translate exceptions to JSON error responses with consistent structure (message, code, timestamp).

---

## How to run locally

Prerequisites:
- Java 21, Maven
- Node.js 18+, npm
- MySQL 8+ (run locally or in Docker)

Backend

1. Configure database in `backend/src/main/resources/application.properties` (default uses `jdbc:mysql://localhost:3306/DoubtConnect`, username/password `root`/`root`).
2. Create database and run schema:

```sql
CREATE DATABASE DoubtConnect;
-- then run `database/schema.sql` to create tables
```

3. Build and run backend:

```powershell
cd backend
./mvnw clean install
./mvnw spring-boot:run
```

Frontend

```bash
cd frontend
npm install
npm run dev
```

Open frontend at `http://localhost:5173` and backend at `http://localhost:8081`.

Notes: frontend must send requests with credentials enabled so the `jwt` cookie is included.

---

## Deployment (overview)

- Build backend artifact (`mvn package`) and deploy the jar to a JVM host or container.
- Build frontend (`npm run build`) and serve static files via CDN or web server (Nginx) with proper CORS settings pointing to backend domain.
- Use environment variables for DB credentials and JWT secrets; do not commit secrets.
- Recommended: containerize with Docker and use Docker Compose or Kubernetes for production, add an entry for a managed database, and use HTTPS with a valid TLS certificate.

Example (Docker-compose outline):
- backend service: build from `backend/`, expose port 8081
- frontend service: build static site or serve via Nginx on port 80
- db service: MySQL image with mounted volume

---

## Testing strategy

- Backend unit tests: test service layer with mocked repositories.
- Backend integration tests: run with embedded DB or Testcontainers to exercise controller endpoints.
- Frontend unit tests: Jest + React Testing Library for components.
- End-to-end tests: Cypress or Playwright to cover login, posting doubts, answers flow.

---

## Future enhancements

- Add pagination and filtering to feeds
- Add attachments/images for doubts/answers
- Add roles and admin dashboards
- Add notifications and email integration
- Add server-side token revocation / refresh tokens
- Implement rate limiting and moderation tools

---

## Where to read the code

- Backend main: [backend/src/main/java/com/app/doubtconnect/](backend/src/main/java/com/app/doubtconnect/)
- Frontend: [frontend/src/](frontend/src/)
- Database schema: [database/schema.sql](database/schema.sql)
- Docs: [docs/backend.md](docs/backend.md) and [docs/frontend.md](docs/frontend.md)

---

If you want, I can:
- Commit these changes and create a small `docs/endpoints.md` with example requests/responses.
- Scaffold `frontend/src/services/api.js` and an `AuthContext` for the frontend.

Last updated: February 2026
# DoubtConnect

A modern full-stack **Q&A Platform** where users can post their doubts/questions and receive answers from the community. Built with Java Spring Boot, React, and MySQL.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Features](#features)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Security](#security)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

DoubtConnect is a collaborative platform designed to connect learners and experts. Users can:
- **Post doubts** (questions) on any topic
- **Browse community feed** of all questions
- **Provide answers** to help others
- **Manage their content** - view, update, or delete their posts

The platform promotes knowledge sharing and community-driven problem-solving.

---

## 🛠️ Tech Stack

### Backend
- **Framework**: Spring Boot 3.4.1
- **Language**: Java 21
- **Build Tool**: Maven
- **Authentication**: JWT (JJWT 0.11.5)
- **ORM**: Spring Data JPA with Hibernate
- **Database**: MySQL
- **Security**: Spring Security with BCrypt password encoding
- **Additional**: Lombok for boilerplate reduction

### Frontend
- **Framework**: React 19.2.0
- **Build Tool**: Vite 7.3.1
- **Styling**: TailwindCSS 4.1.18
- **Linting**: ESLint 9.39.1
- **Module System**: ES Modules

### Database
- **DBMS**: MySQL
- **Connection**: jdbc:mysql://localhost:3306/DoubtConnect
- **User**: root / root

---

## 🏗️ Architecture

```
┌─────────────────────┐
│   React Frontend    │
│   (Port 5173)       │
└──────────┬──────────┘
           │ HTTP/REST
           ▼
┌─────────────────────┐
│   Spring Boot API   │
│   (Port 8081)       │
│  - Controllers      │
│  - Services         │
│  - JWT Auth         │
└──────────┬──────────┘
           │ JDBC
           ▼
┌─────────────────────┐
│   MySQL Database    │
│   (Port 3306)       │
└─────────────────────┘
```

**Architecture Type**: Three-tier architecture (Client-Server-Database)

**Authentication Flow**:
1. User signs up/logs in via `/auth/login`
2. Backend validates credentials and returns JWT token
3. Frontend stores token and includes it in subsequent requests
4. Backend validates token using `JwtAuthFilter`
5. Protected endpoints require valid JWT with `ROLE_USER` authority

---

## ✨ Features

### User Management
- ✅ User registration (signup)
- ✅ User login with JWT token generation
- ✅ User logout
- ✅ Password encryption with BCrypt
- ✅ Role-based access control (ROLE_USER)

### Doubt Management
- ✅ Post new doubts with title and description
- ✅ View all doubts (community feed)
- ✅ View specific doubt by ID
- ✅ Get user's own doubts
- ✅ Batch post multiple doubts

### Answer Management
- ✅ Post answers to doubts
- ✅ View specific answer by ID
- ✅ Update answers
- ✅ Delete answers
- ✅ Get all answers across platform
- ✅ Get user's own answers
- ✅ Cascade delete (answers deleted when doubt is deleted)

### Security Features
- ✅ JWT token-based authentication
- ✅ Stateless session management
- ✅ CORS configuration for frontend-backend communication
- ✅ CSRF protection disabled for REST API
- ✅ Method-level security
- ✅ Password hashing with BCrypt

---

## 📂 Project Structure

```
DoubtConnect/
├── backend/
│   ├── pom.xml                    # Maven dependencies
│   ├── mvnw / mvnw.cmd           # Maven wrapper
│   ├── src/main/
│   │   ├── java/com/app/doubtconnect/
│   │   │   ├── DoubtConnectApplication.java     # Main entry point
│   │   │   ├── controller/                      # REST API endpoints
│   │   │   │   ├── AuthController.java
│   │   │   │   ├── DoubtController.java
│   │   │   │   └── AnswerController.java
│   │   │   ├── service/                         # Business logic
│   │   │   │   ├── AuthService.java
│   │   │   │   ├── DoubtService.java
│   │   │   │   └── AnswerService.java
│   │   │   ├── model/                           # Entity classes
│   │   │   │   ├── User.java
│   │   │   │   ├── Doubt.java
│   │   │   │   └── Answer.java
│   │   │   ├── repository/                      # Data access
│   │   │   │   ├── UserRepository.java
│   │   │   │   ├── DoubtRepository.java
│   │   │   │   └── AnswerRepository.java
│   │   │   ├── dto/                             # Data Transfer Objects
│   │   │   │   ├── SignupDTO.java
│   │   │   │   ├── LoginDTO.java
│   │   │   │   ├── AuthResponse.java
│   │   │   │   ├── DoubtDTO.java
│   │   │   │   ├── DoubtResponse.java
│   │   │   │   ├── AnswerDTO.java
│   │   │   │   └── AnswerResponse.java
│   │   │   └── security/                        # Security configs
│   │   │       ├── SecurityConfig.java
│   │   │       ├── CorsConfig.java
│   │   │       ├── JwtService.java
│   │   │       ├── JwtAuthFilter.java
│   │   │       ├── UserInfoService.java
│   │   │       └── UserInfoDetails.java
│   │   └── resources/
│   │       └── application.properties
│   └── src/test/
│       └── java/.../DoubtConnectApplicationTests.java
├── frontend/
│   ├── package.json               # NPM dependencies
│   ├── vite.config.js            # Vite configuration
│   ├── eslint.config.js          # ESLint rules
│   ├── index.html                # HTML entry point
│   └── src/
│       ├── main.jsx              # React entry point
│       ├── App.jsx               # Main component
│       └── main.css              # Global styles
├── database/
│   ├── schema.sql                # Database schema
│   └── queries.sql               # Sample queries
├── README.md                      # This file
├── teamwork.txt                   # Project notes
└── things.txt                     # Development tracking
```

---

## 🚀 Setup Instructions

### Prerequisites
- Java 21+
- Node.js 18+
- MySQL 8.0+
- Git

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd DoubtConnect/backend
   ```

2. **Create MySQL Database**
   ```sql
   CREATE DATABASE DoubtConnect;
   ```

3. **Configure Database Connection**
   - Edit `src/main/resources/application.properties`
   - Update database credentials if needed:
     ```properties
     spring.datasource.url=jdbc:mysql://localhost:3306/DoubtConnect
     spring.datasource.username=root
     spring.datasource.password=root
     ```

4. **Build the Backend**
   ```bash
   ./mvnw clean install
   ```

5. **Run the Backend Server**
   ```bash
   ./mvnw spring-boot:run
   ```
   Server starts on `http://localhost:8081`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```
   Frontend runs on `http://localhost:5173`

4. **Build for Production**
   ```bash
   npm run build
   ```

### Verification

- Backend API: `http://localhost:8081/auth/login` (should return 400 without credentials)
- Frontend: `http://localhost:5173`

---

## 🔌 API Documentation

### Base URL
```
http://localhost:8081
```

### Authentication Endpoints

#### Sign Up
```http
POST /auth/signup
Content-Type: application/json

{
  "username": "user@example.com",
  "password": "securePassword",
  "firstName": "John",
  "lastName": "Doe"
}

Response: 201 Created
{
  "message": "Signup successful"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "username": "user@example.com",
  "password": "securePassword"
}

Response: 200 OK
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Login successful"
}
```

#### Logout
```http
POST /auth/logout
Authorization: Bearer <JWT_TOKEN>

Response: 200 OK
{
  "message": "Logged out successfully"
}
```

### Doubt Endpoints

#### Post a Doubt
```http
POST /api/doubts/post
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "title": "How to use Java Streams?",
  "description": "I'm having trouble understanding Java Streams. Can someone explain?"
}

Response: 201 Created
{
  "doubtId": 1,
  "title": "How to use Java Streams?",
  "description": "I'm having trouble understanding Java Streams. Can someone explain?",
  "askedBy": "user@example.com",
  "answers": []
}
```

#### Get All Doubts (Feed)
```http
GET /api/doubts/feed
Authorization: Bearer <JWT_TOKEN>

Response: 200 OK
[
  {
    "doubtId": 1,
    "title": "How to use Java Streams?",
    "description": "...",
    "askedBy": "user@example.com",
    "answers": []
  }
]
```

#### Get Specific Doubt
```http
GET /api/doubts/{id}
Authorization: Bearer <JWT_TOKEN>

Response: 200 OK
{
  "doubtId": 1,
  "title": "How to use Java Streams?",
  "description": "...",
  "askedBy": "user@example.com",
  "answers": [
    {
      "answerId": 1,
      "content": "Streams are...",
      "answeredBy": "expert@example.com"
    }
  ]
}
```

#### Get My Doubts
```http
GET /api/doubts/me
Authorization: Bearer <JWT_TOKEN>

Response: 200 OK
[
  {
    "doubtId": 1,
    "title": "...",
    "description": "...",
    "askedBy": "user@example.com",
    "answers": []
  }
]
```

### Answer Endpoints

#### Post an Answer
```http
POST /api/answer/comment
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "doubtId": 1,
  "content": "Java Streams provide a functional approach to processing collections..."
}

Response: 201 Created
{
  "answerId": 1,
  "content": "Java Streams provide...",
  "doubtId": 1,
  "answeredBy": "expert@example.com"
}
```

#### Get Specific Answer
```http
GET /api/answer/comment/{id}
Authorization: Bearer <JWT_TOKEN>

Response: 200 OK
{
  "answerId": 1,
  "content": "Java Streams provide...",
  "doubtId": 1,
  "answeredBy": "expert@example.com"
}
```

#### Update Answer
```http
PUT /api/answer/comment/{id}
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "content": "Updated answer content..."
}

Response: 200 OK
{
  "answerId": 1,
  "content": "Updated answer content...",
  "doubtId": 1,
  "answeredBy": "expert@example.com"
}
```

#### Delete Answer
```http
DELETE /api/answer/comment/{id}
Authorization: Bearer <JWT_TOKEN>

Response: 200 OK
{
  "message": "Answer deleted successfully"
}
```

#### Get All Answers
```http
GET /api/answer/allComments
Authorization: Bearer <JWT_TOKEN>

Response: 200 OK
[
  {
    "answerId": 1,
    "content": "...",
    "doubtId": 1,
    "answeredBy": "user@example.com"
  }
]
```

#### Get My Answers
```http
GET /api/answer/comments/me
Authorization: Bearer <JWT_TOKEN>

Response: 200 OK
[
  {
    "answerId": 1,
    "content": "...",
    "doubtId": 1,
    "answeredBy": "user@example.com"
  }
]
```

---

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE user (
  username VARCHAR(255) PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255),
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'ROLE_USER'
);
```

### Doubts Table
```sql
CREATE TABLE doubt (
  doubt_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(200) NOT NULL,
  description LONGTEXT NOT NULL,
  asked_by VARCHAR(255) NOT NULL,
  FOREIGN KEY (asked_by) REFERENCES user(username)
);
```

### Answers Table
```sql
CREATE TABLE answer (
  answer_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  content LONGTEXT NOT NULL,
  doubt_id BIGINT NOT NULL,
  answered_by VARCHAR(255) NOT NULL,
  FOREIGN KEY (doubt_id) REFERENCES doubt(doubt_id) ON DELETE CASCADE,
  FOREIGN KEY (answered_by) REFERENCES user(username)
);
```

### Entity Relationships
```
User (1) ──── (M) Doubt
User (1) ──── (M) Answer
Doubt (1) ──── (M) Answer (Cascade Delete)
```

---

## 🔐 Security

### Authentication
- **Type**: JWT (JSON Web Token)
- **Algorithm**: HS256 (HMAC with SHA-256)
- **Expiration**: 24 hours
- **Secret Key**: Stored in [JwtService](backend/src/main/java/com/app/doubtconnect/security/JwtService.java)

### Authorization
- **Public Endpoints**: `/auth/signup`, `/auth/login`, `/auth/logout`
- **Protected Endpoints**: `/api/**`, `/auth/user/**` (require `ROLE_USER`)
- **Session Policy**: Stateless (no server-side sessions)

### CORS Configuration
- **Allowed Origin**: `http://localhost:5173`
- **Allowed Methods**: GET, POST, PUT, DELETE, OPTIONS
- **Credentials**: Enabled

### Password Security
- **Encoding**: BCrypt with salt
- **Configuration**: BCryptPasswordEncoder bean in SecurityConfig

### Additional Security Features
- CSRF protection disabled for REST API (stateless architecture)
- Method-level security enabled
- JWT filter validates every request to protected endpoints

---

## 💻 Development

### Running Tests
```bash
cd backend
./mvnw test
```

### Code Quality
- Frontend: ESLint
  ```bash
  cd frontend
  npm run lint
  ```

### Hot Reload
- **Backend**: Spring Boot DevTools (auto-restart on file changes)
- **Frontend**: Vite HMR (Hot Module Replacement)

### Debugging
- **Backend**: Add breakpoints in IDE and run with debug mode
- **Frontend**: Use browser DevTools (F12)

---

## 📝 Contributing

1. **Fork the repository**
   ```bash
   git clone <your-fork-url>
   cd DoubtConnect
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow the existing code structure
   - Add appropriate comments
   - Update README if needed

4. **Commit your changes**
   ```bash
   git commit -m "Add feature: description"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Describe your changes
   - Reference any related issues

---

## 📄 License

This project is open source and available under the MIT License.

---

## 📧 Support

For issues, questions, or suggestions, please open an issue on the GitHub repository.

---

## 🎓 Learning Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Security](https://spring.io/projects/spring-security)
- [JWT Introduction](https://jwt.io/introduction)
- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev/guide/)
- [MySQL Documentation](https://dev.mysql.com/doc/)

---

**Last Updated**: February 2026  
**Version**: 0.0.1-SNAPSHOT
