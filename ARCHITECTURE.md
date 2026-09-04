# DoubtConnect - System Architecture

Comprehensive documentation of the DoubtConnect architecture, including system design, component interactions, data flow, and frontend-backend communication patterns.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Architectural Layers](#architectural-layers)
3. [Frontend Architecture](#frontend-architecture)
4. [Backend Architecture](#backend-architecture)
5. [Data Flow](#data-flow)
6. [API Communication](#api-communication)
7. [Authentication Flow](#authentication-flow)
8. [Database Design](#database-design)
9. [Request/Response Cycle](#requestresponse-cycle)
10. [Technology Interactions](#technology-interactions)
11. [Security Architecture](#security-architecture)

---

## 🏗️ Overview

DoubtConnect follows a **three-tier client-server architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────────┐
│                        PRESENTATION LAYER                       │
│                    React Frontend (Port 5173)                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  UI Components │ State Management │ HTTP Client         │  │
│  └──────────────────────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────────────────────────┘
                       │ HTTP/REST (JWT Token)
                       │ JSON (Request/Response)
┌──────────────────────▼──────────────────────────────────────────┐
│                    APPLICATION LAYER                            │
│                Spring Boot Backend (Port 8081)                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  Controllers  │  Services  │  Repositories │  Security │    │
│  └────────────────────────────────────────────────────────┘    │
└──────────────────────┬──────────────────────────────────────────┘
                       │ JDBC/SQL
                       │ Transactional Operations
┌──────────────────────▼──────────────────────────────────────────┐
│                      DATA LAYER                                 │
│         MySQL Database (Port 3306)                              │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  users | doubts | answers                              │    │
│  └────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Architectural Layers

### 1. **Presentation Layer (Frontend)**
- **Framework**: React 19.2.0
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **Responsibilities**:
  - User interface rendering
  - User input handling
  - State management
  - HTTP requests to backend
  - Display API responses

### 2. **Business Logic Layer (Backend)**
- **Framework**: Spring Boot 3.4.1
- **Language**: Java 21
- **Architecture Pattern**: MVC (Model-View-Controller)
- **Responsibilities**:
  - Request validation
  - Business logic processing
  - Authentication & Authorization
  - Data transformation
  - API response creation

### 3. **Data Access Layer**
- **ORM**: Spring Data JPA with Hibernate
- **Responsibilities**:
  - Database queries
  - CRUD operations
  - Transaction management
  - Relationship mapping

### 4. **Database Layer**
- **DBMS**: MySQL 8.0
- **Responsibilities**:
  - Data persistence
  - Data consistency
  - Relationship enforcement

---

## 🎨 Frontend Architecture

### Component Structure

```
App.jsx
├── Authentication Components
│   ├── SignupForm
│   ├── LoginForm
│   └── LogoutButton
├── Doubt Components
│   ├── DoubtFeed
│   ├── DoubtDetail
│   ├── PostDoubt
│   └── MyDoubts
└── Answer Components
    ├── AnswerList
    ├── PostAnswer
    ├── EditAnswer
    └── DeleteAnswer
```

### State Management

```
Frontend State:
├── Authentication
│   ├── isAuthenticated (boolean)
│   ├── authToken (JWT)
│   ├── currentUser (object)
│   └── userRole (string)
├── Doubts
│   ├── doubts[] (list)
│   ├── selectedDoubt (object)
│   ├── myDoubts[] (list)
│   └── doubtLoading (boolean)
└── Answers
    ├── answers[] (list)
    ├── selectedAnswer (object)
    └── answerLoading (boolean)
```

### HTTP Client Configuration

```javascript
// Frontend API Base Configuration
const API_BASE = 'http://localhost:8081';

// Request Interceptor
- Add Authorization header with JWT token
- Content-Type: application/json

// Response Interceptor
- Handle 401 Unauthorized (redirect to login)
- Handle 403 Forbidden (permission error)
- Parse JSON response
```

---

## 🖥️ Backend Architecture

### Layered Architecture Pattern

```
┌─────────────────────────────────────────────────────┐
│              REST Controllers                        │
│  (AuthController, DoubtController, AnswerController)│
└────────────────────┬────────────────────────────────┘
                     │ Calls
┌────────────────────▼────────────────────────────────┐
│           Service Layer (Business Logic)            │
│  (AuthService, DoubtService, AnswerService)        │
└────────────────────┬────────────────────────────────┘
                     │ Uses
┌────────────────────▼────────────────────────────────┐
│        Repository Layer (Data Access)               │
│  (UserRepository, DoubtRepository, AnswerRepository)│
└────────────────────┬────────────────────────────────┘
                     │ Queries
┌────────────────────▼────────────────────────────────┐
│         Spring Data JPA / Hibernate                 │
│              (ORM Mapping)                          │
└────────────────────┬────────────────────────────────┘
                     │ SQL
┌────────────────────▼────────────────────────────────┐
│              MySQL Database                         │
└─────────────────────────────────────────────────────┘
```

### Controllers

**AuthController** (`/auth`)
```
├── POST /signup
│   └── Delegates → AuthService.signup()
├── POST /login
│   └── Delegates → AuthService.login()
└── POST /logout
    └── Delegates → AuthService.logout()
```

**DoubtController** (`/api/doubts`)
```
├── POST /post
│   └── Delegates → DoubtService.postDoubt()
├── GET /{id}
│   └── Delegates → DoubtService.getDoubt()
├── GET /feed
│   └── Delegates → DoubtService.getFeed()
└── GET /me
    └── Delegates → DoubtService.getMyDoubts()
```

**AnswerController** (`/api/answer`)
```
├── POST /comment
│   └── Delegates → AnswerService.postComment()
├── GET /comment/{id}
│   └── Delegates → AnswerService.getComment()
├── PUT /comment/{id}
│   └── Delegates → AnswerService.updateComment()
└── DELETE /comment/{id}
    └── Delegates → AnswerService.deleteComment()
```

### Service Layer

**AuthService**
- `signup(SignupDTO)` - Create new user
- `login(LoginDTO, HttpResponse)` - Authenticate user, generate JWT
- `logout(HttpResponse)` - Clear session/token

**DoubtService**
- `postDoubt(DoubtDTO)` - Create doubt
- `getDoubt(Long)` - Fetch single doubt with answers
- `getFeed()` - Get all doubts
- `getMyDoubts()` - Get authenticated user's doubts

**AnswerService**
- `postComment(AnswerDTO)` - Create answer
- `getComment(Long)` - Fetch answer by ID
- `updateComment(Long, AnswerDTO)` - Update answer
- `deleteComment(Long)` - Delete answer
- `getAllComments()` - Get all answers
- `getCommentsMe()` - Get authenticated user's answers

### Repository Layer

**UserRepository** (extends JpaRepository)
- `findByUsername(String)` - Find user by username
- `existsByUsername(String)` - Check user existence
- `save(User)` - Create/update user

**DoubtRepository** (extends JpaRepository)
- `findAll()` - Get all doubts
- `findById(Long)` - Get doubt by ID
- `findByUser(User)` - Get user's doubts
- `save(Doubt)` - Create/update doubt
- `deleteById(Long)` - Delete doubt

**AnswerRepository** (extends JpaRepository)
- `findById(Long)` - Get answer by ID
- `findByDoubt(Doubt)` - Get answers for a doubt
- `findByUser(User)` - Get user's answers
- `save(Answer)` - Create/update answer
- `deleteById(Long)` - Delete answer

---

## 🔄 Data Flow

### 1. User Registration Flow

```
┌──────────────────────────────────────────────────────────────┐
│ Frontend: SignupForm.jsx                                     │
└─────────────────────┬──────────────────────────────────────┐
                      │ POST /auth/signup                     │
                      │ {username, password, firstName, ...}  │
┌─────────────────────▼──────────────────────────────────────┐
│ Backend: AuthController.signup()                             │
│  1. Receive SignupDTO                                        │
│  2. Call AuthService.signup()                                │
└─────────────────────┬──────────────────────────────────────┐
                      │
┌─────────────────────▼──────────────────────────────────────┐
│ Backend: AuthService.signup()                                │
│  1. Validate input (email format, password strength)         │
│  2. Check if user exists → UserRepository.existsByUsername() │
│  3. Hash password using BCryptPasswordEncoder                │
│  4. Create User entity                                       │
│  5. Save user → UserRepository.save()                        │
└─────────────────────┬──────────────────────────────────────┐
                      │ SQL INSERT
┌─────────────────────▼──────────────────────────────────────┐
│ Database: INSERT INTO user VALUES (...)                      │
└─────────────────────┬──────────────────────────────────────┐
                      │
┌─────────────────────▼──────────────────────────────────────┐
│ Backend: Return AuthResponse                                 │
│ {message: "Signup successful"}                               │
└─────────────────────┬──────────────────────────────────────┐
                      │ HTTP 201 Created
┌─────────────────────▼──────────────────────────────────────┐
│ Frontend: Display success message                            │
│ Redirect to login page                                       │
└──────────────────────────────────────────────────────────────┘
```

### 2. User Login & Token Generation Flow

```
┌──────────────────────────────────────────────────────────────┐
│ Frontend: LoginForm.jsx                                      │
└─────────────────────┬──────────────────────────────────────┐
                      │ POST /auth/login                     │
                      │ {username, password}                 │
┌─────────────────────▼──────────────────────────────────────┐
│ Backend: AuthController.login()                              │
│  1. Receive LoginDTO                                         │
│  2. Call AuthService.login()                                 │
└─────────────────────┬──────────────────────────────────────┐
                      │
┌─────────────────────▼──────────────────────────────────────┐
│ Backend: AuthService.login()                                 │
│  1. Load user → UserRepository.findByUsername()              │
│  2. Verify password using BCryptPasswordEncoder              │
│  3. If valid:                                                │
│     a. Call JwtService.generateToken(username)               │
│     b. Add token to response header/body                     │
│  4. If invalid: throw AuthenticationException                │
└─────────────────────┬──────────────────────────────────────┐
                      │
┌─────────────────────▼──────────────────────────────────────┐
│ Backend: JwtService.generateToken()                          │
│  1. Create claims (empty for now)                            │
│  2. Set subject = username                                   │
│  3. Set issuedAt = now                                       │
│  4. Set expiration = now + 24 hours                          │
│  5. Sign with HS256 algorithm                                │
│  6. Return JWT token string                                  │
└─────────────────────┬──────────────────────────────────────┐
                      │
┌─────────────────────▼──────────────────────────────────────┐
│ Backend: Return AuthResponse                                 │
│ {token: "eyJhbGc...", message: "Login successful"}           │
└─────────────────────┬──────────────────────────────────────┐
                      │ HTTP 200 OK
┌─────────────────────▼──────────────────────────────────────┐
│ Frontend: Store JWT token                                    │
│  1. Save token in localStorage/sessionStorage                │
│  2. Update state: isAuthenticated = true                     │
│  3. Redirect to dashboard/home                               │
└──────────────────────────────────────────────────────────────┘
```

### 3. Protected API Request Flow (with JWT)

```
┌──────────────────────────────────────────────────────────────┐
│ Frontend: Fetch doubts (GetFeed.jsx)                         │
└─────────────────────┬──────────────────────────────────────┐
                      │ GET /api/doubts/feed                 │
                      │ Header: Authorization: Bearer <JWT>  │
┌─────────────────────▼──────────────────────────────────────┐
│ Backend: Request reaches DispatcherServlet                   │
└─────────────────────┬──────────────────────────────────────┐
                      │ Route to Security Filter Chain
┌─────────────────────▼──────────────────────────────────────┐
│ Backend: JwtAuthFilter                                       │
│  1. Extract JWT from Authorization header                    │
│  2. Call JwtService.extractUsername(token)                   │
│  3. Call JwtService.isTokenValid(token)                      │
│  4. If valid:                                                │
│     a. Load UserDetails from UserInfoService                │
│     b. Create Authentication object                          │
│     c. Set in SecurityContext                                │
│  5. If invalid: throw AuthenticationException                │
└─────────────────────┬──────────────────────────────────────┐
                      │ Continue to Controller
┌─────────────────────▼──────────────────────────────────────┐
│ Backend: DoubtController.getFeed()                           │
│  1. Call DoubtService.getFeed()                              │
└─────────────────────┬──────────────────────────────────────┐
                      │
┌─────────────────────▼──────────────────────────────────────┐
│ Backend: DoubtService.getFeed()                              │
│  1. Call DoubtRepository.findAll()                           │
└─────────────────────┬──────────────────────────────────────┐
                      │ SQL Query
┌─────────────────────▼──────────────────────────────────────┐
│ Database: SELECT * FROM doubt                                │
│ [Load Doubt entities with User relationships]                │
└─────────────────────┬──────────────────────────────────────┐
                      │ Return List<Doubt>
┌─────────────────────▼──────────────────────────────────────┐
│ Backend: Convert to DTO List<DoubtResponse>                 │
│  1. Map each Doubt → DoubtResponse                           │
│  2. Include asker info, answer count, etc.                   │
└─────────────────────┬──────────────────────────────────────┐
                      │ HTTP 200 OK
┌─────────────────────▼──────────────────────────────────────┐
│ Frontend: Receive response JSON                              │
│  [{doubtId, title, description, askedBy, answers}, ...]     │
│  1. Parse JSON                                               │
│  2. Update state: doubts = response                          │
│  3. Re-render UI with doubt list                             │
└──────────────────────────────────────────────────────────────┘
```

### 4. Post Doubt Flow

```
┌──────────────────────────────────────────────────────────────┐
│ Frontend: PostDoubt.jsx                                      │
└─────────────────────┬──────────────────────────────────────┐
                      │ POST /api/doubts/post                │
                      │ Header: Authorization: Bearer <JWT>  │
                      │ Body: {title, description}           │
┌─────────────────────▼──────────────────────────────────────┐
│ Backend: JWT validation → DoubtController.postDoubt()       │
└─────────────────────┬──────────────────────────────────────┐
                      │
┌─────────────────────▼──────────────────────────────────────┐
│ Backend: DoubtService.postDoubt(DoubtDTO)                   │
│  1. Get current authenticated user from SecurityContext     │
│  2. Create Doubt entity                                     │
│  3. Set user = current user                                 │
│  4. Call DoubtRepository.save(doubt)                        │
└─────────────────────┬──────────────────────────────────────┐
                      │ SQL INSERT
┌─────────────────────▼──────────────────────────────────────┐
│ Database: INSERT INTO doubt VALUES (...)                     │
│ Returns: doubt entity with generated doubtId                │
└─────────────────────┬──────────────────────────────────────┐
                      │
┌─────────────────────▼──────────────────────────────────────┐
│ Backend: Convert to DoubtResponse DTO                       │
│ Return HTTP 201 Created                                     │
└─────────────────────┬──────────────────────────────────────┐
                      │ JSON Response with doubt details
┌─────────────────────▼──────────────────────────────────────┐
│ Frontend: Success notification                              │
│  1. Show success toast/alert                                │
│  2. Redirect to new doubt or refresh feed                   │
└──────────────────────────────────────────────────────────────┘
```

### 5. Post Answer Flow

```
┌──────────────────────────────────────────────────────────────┐
│ Frontend: AnswerForm.jsx                                     │
└─────────────────────┬──────────────────────────────────────┐
                      │ POST /api/answer/comment             │
                      │ Header: Authorization: Bearer <JWT>  │
                      │ Body: {doubtId, content}             │
┌─────────────────────▼──────────────────────────────────────┐
│ Backend: AnswerController.postComment()                      │
└─────────────────────┬──────────────────────────────────────┐
                      │
┌─────────────────────▼──────────────────────────────────────┐
│ Backend: AnswerService.postComment(AnswerDTO)              │
│  1. Get current authenticated user                          │
│  2. Fetch Doubt by doubtId → DoubtRepository.findById()     │
│  3. Create Answer entity                                    │
│  4. Set doubt = fetched doubt                               │
│  5. Set user = current user                                 │
│  6. Call AnswerRepository.save(answer)                      │
└─────────────────────┬──────────────────────────────────────┐
                      │ SQL INSERT
┌─────────────────────▼──────────────────────────────────────┐
│ Database: INSERT INTO answer VALUES (...)                    │
│ Returns: answer entity with generated answerId              │
└─────────────────────┬──────────────────────────────────────┐
                      │
┌─────────────────────▼──────────────────────────────────────┐
│ Backend: Convert to AnswerResponse DTO                      │
│ Return HTTP 201 Created                                     │
└─────────────────────┬──────────────────────────────────────┐
                      │ JSON Response
┌─────────────────────▼──────────────────────────────────────┐
│ Frontend: Add answer to UI                                  │
│  1. Show success message                                    │
│  2. Append answer to answers list                           │
│  3. Clear form                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 🔌 API Communication

### Request Format

All requests follow REST conventions with JSON payload:

```http
POST /api/endpoint
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "field1": "value1",
  "field2": "value2"
}
```

### Response Format

All responses return JSON with appropriate HTTP status codes:

```json
{
  "data": {...} or [...],
  "message": "Success/Error description",
  "timestamp": "2024-02-10T10:30:00Z",
  "status": 200
}
```

### Error Handling

```
400 Bad Request → Invalid input validation
401 Unauthorized → Missing/invalid JWT token
403 Forbidden → Insufficient permissions
404 Not Found → Resource doesn't exist
500 Internal Server Error → Server error
```

### CORS & Security Headers

```javascript
// Frontend requests to backend include
Headers: {
  "Authorization": "Bearer <jwt_token>",
  "Content-Type": "application/json",
  "Origin": "http://localhost:5173"
}

// Backend responds with CORS headers
Headers: {
  "Access-Control-Allow-Origin": "http://localhost:5173",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Credentials": "true"
}
```

---

## 🔐 Authentication Flow

### JWT Token Lifecycle

```
1. GENERATION (Login)
   ├── User submits credentials
   ├── Backend verifies password
   ├── JwtService creates token with:
   │   ├── Subject (username)
   │   ├── Issued At (current time)
   │   └── Expiration (24 hours later)
   └── Token returned to frontend

2. STORAGE (Frontend)
   ├── localStorage.setItem('token', jwt)
   └── Used in all subsequent requests

3. VALIDATION (Protected Requests)
   ├── Request arrives with Authorization header
   ├── JwtAuthFilter extracts token
   ├── JwtService validates token:
   │   ├── Check signature
   │   ├── Check expiration
   │   └── Extract username
   └── Create SecurityContext with user

4. EXPIRATION
   ├── Token expires after 24 hours
   ├── Frontend detects 401 response
   ├── User redirected to login
   └── New token generated on re-login
```

### Security Filter Chain

```
HTTP Request
    │
    ▼
┌─────────────────────────────────┐
│ CorsFilter                       │
│ (Allow cross-origin requests)   │
└────────────┬────────────────────┘
             │
    ▼
┌─────────────────────────────────┐
│ JwtAuthFilter                    │
│ (Validate JWT token)            │
│ (Set SecurityContext)           │
└────────────┬────────────────────┘
             │
    ▼
┌─────────────────────────────────┐
│ AuthorizationFilter             │
│ (Check permissions)             │
└────────────┬────────────────────┘
             │
    ▼
┌─────────────────────────────────┐
│ Controller                       │
│ (Process business logic)        │
└────────────┬────────────────────┘
             │
    ▼
   HTTP Response
```

---

## 🗄️ Database Design

### Entity-Relationship Diagram

```
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│    User      │         │    Doubt     │         │    Answer    │
├──────────────┤         ├──────────────┤         ├──────────────┤
│ username (PK)│◄────────│ doubt_id(PK) │◄────────│ answer_id(PK)│
│ firstName    │  (1:M)  │ title        │  (1:M)  │ content      │
│ lastName     │         │ description  │         │              │
│ password     │         │ asked_by(FK) │         │ doubt_id(FK) │
│ role         │         │ asked_by(FK) │         │ answered_by  │
└──────────────┘         └──────────────┘         └──────────────┘
     (N)                       (M)                       (M)
      │                         │                         │
      └─────────────────────────┴─────────────────────────┘
                    User has
              (multiple Doubts)
              (multiple Answers)
```

### Tables & Relationships

**users** table
```sql
username VARCHAR(255) PRIMARY KEY
first_name VARCHAR(255) NOT NULL
last_name VARCHAR(255)
password VARCHAR(255) NOT NULL
role VARCHAR(50) DEFAULT 'ROLE_USER'
```

**doubts** table
```sql
doubt_id BIGINT PRIMARY KEY AUTO_INCREMENT
title VARCHAR(200) NOT NULL
description LONGTEXT NOT NULL
asked_by VARCHAR(255) NOT NULL → FOREIGN KEY (users.username)
created_at TIMESTAMP (implicit)
```

**answers** table
```sql
answer_id BIGINT PRIMARY KEY AUTO_INCREMENT
content LONGTEXT NOT NULL
doubt_id BIGINT NOT NULL → FOREIGN KEY (doubts.doubt_id) [CASCADE DELETE]
answered_by VARCHAR(255) NOT NULL → FOREIGN KEY (users.username)
created_at TIMESTAMP (implicit)
```

### Data Cascade Behavior

```
When Doubt is deleted:
  └── All associated Answers are deleted (CASCADE DELETE)
     └── User still exists

When User is deleted:
  ├── Their Doubts remain (orphaned)
  └── Their Answers remain (orphaned)
```

---

## 🔄 Request/Response Cycle

### Complete Lifecycle Example: "Get Doubt Details with Answers"

```
STEP 1: Frontend sends HTTP request
┌──────────────────────────────────────────────┐
│ GET /api/doubts/1                            │
│ Host: localhost:8081                         │
│ Authorization: Bearer eyJhbGc...             │
│ Content-Type: application/json               │
└──────────────────────────────────────────────┘
                    │
                    │ Network
                    ▼
STEP 2: Backend receives request at DispatcherServlet
┌──────────────────────────────────────────────┐
│ Vite Dev Server Port: 5173                   │
│ Spring Boot Server Port: 8081                │
└──────────────────────────────────────────────┘
                    │
                    ▼
STEP 3: Security Filter Chain
┌──────────────────────────────────────────────┐
│ 1. CorsFilter                                │
│    ├── Check origin: http://localhost:5173  │
│    └── Allow: Yes (in allowedOrigins list)  │
├──────────────────────────────────────────────┤
│ 2. JwtAuthFilter                             │
│    ├── Extract token from header             │
│    ├── Call JwtService.extractUsername()    │
│    ├── Call JwtService.isTokenValid()       │
│    ├── Load UserDetails                     │
│    └── Set SecurityContext                  │
├──────────────────────────────────────────────┤
│ 3. AuthorizationFilter                       │
│    ├── Check endpoint: /api/doubts/1        │
│    ├── Required role: ROLE_USER              │
│    ├── User has role: Yes                    │
│    └── Allow: Yes                            │
└──────────────────────────────────────────────┘
                    │
                    ▼
STEP 4: Route to DoubtController.getDoubt(1)
┌──────────────────────────────────────────────┐
│ @GetMapping("/{id}")                         │
│ public ResponseEntity<DoubtResponse> getDoubt│
│ (@PathVariable Long id) {                    │
│   return ResponseEntity.ok(                  │
│     doubtService.getDoubt(id)                │
│   );                                         │
│ }                                            │
└──────────────────────────────────────────────┘
                    │
                    ▼
STEP 5: Call DoubtService.getDoubt(1)
┌──────────────────────────────────────────────┐
│ 1. Call DoubtRepository.findById(1)         │
│ 2. Check: Doubt exists? No → throw 404      │
│ 3. Doubt exists → fetch entity               │
│ 4. Hibernate loads Doubt with:               │
│    ├── User (asked_by) - FetchType.EAGER    │
│    └── Answers - FetchType.LAZY (on access) │
│ 5. Convert Doubt → DoubtResponse DTO        │
│    ├── doubt_id → doubtId                   │
│    ├── title → title                        │
│    ├── description → description            │
│    ├── user.username → askedBy              │
│    ├── answers → answers[]                  │
│    │   ├── answer_id → answerId             │
│    │   ├── content → content                │
│    │   └── user.username → answeredBy       │
│    └── return DoubtResponse object           │
└──────────────────────────────────────────────┘
                    │
                    ▼
STEP 6: Database Query Execution
┌──────────────────────────────────────────────┐
│ SELECT * FROM doubt WHERE doubt_id = 1      │
│                                              │
│ Result:                                      │
│ ┌────────────────────────────────────────┐ │
│ │doubt_id: 1                             │ │
│ │title: "How to use Java Streams?"       │ │
│ │description: "I'm having trouble..."    │ │
│ │asked_by: "user@example.com"            │ │
│ └────────────────────────────────────────┘ │
│                                              │
│ SELECT * FROM user WHERE username = ...    │
│ (Fetch User eagerly)                       │
│                                              │
│ SELECT * FROM answer WHERE doubt_id = 1    │
│ (Fetch Answers lazily)                     │
└──────────────────────────────────────────────┘
                    │
                    ▼
STEP 7: Backend constructs response
┌──────────────────────────────────────────────┐
│ HTTP/1.1 200 OK                              │
│ Content-Type: application/json               │
│ Access-Control-Allow-Origin: localhost:5173  │
│                                              │
│ {                                            │
│   "doubtId": 1,                              │
│   "title": "How to use Java Streams?",       │
│   "description": "I'm having trouble...",    │
│   "askedBy": "user@example.com",             │
│   "answers": [                               │
│     {                                        │
│       "answerId": 1,                         │
│       "content": "Streams are...",           │
│       "answeredBy": "expert@example.com"     │
│     }                                        │
│   ]                                          │
│ }                                            │
└──────────────────────────────────────────────┘
                    │
                    │ Network
                    ▼
STEP 8: Frontend receives response
┌──────────────────────────────────────────────┐
│ fetch('/api/doubts/1', {                    │
│   headers: {                                │
│     'Authorization': 'Bearer <token>'       │
│   }                                         │
│ })                                          │
│ .then(response => response.json())          │
│ .then(data => {                             │
│   // data = doubtResponse object             │
│ })                                          │
└──────────────────────────────────────────────┘
                    │
                    ▼
STEP 9: Update React state
┌──────────────────────────────────────────────┐
│ useState(() => {                            │
│   const [selectedDoubt, setSelectedDoubt] =  │
│     useState(data)                           │
│ })                                          │
└──────────────────────────────────────────────┘
                    │
                    ▼
STEP 10: Re-render component
┌──────────────────────────────────────────────┐
│ <div>                                       │
│   <h1>{selectedDoubt.title}</h1>           │
│   <p>{selectedDoubt.description}</p>       │
│   <p>By {selectedDoubt.askedBy}</p>        │
│   <section>                                 │
│     {selectedDoubt.answers.map(ans =>      │
│       <Answer key={ans.id} {...ans} />     │
│     )}                                      │
│   </section>                                │
│ </div>                                      │
└──────────────────────────────────────────────┘
                    │
                    ▼
STEP 11: User sees rendered UI
┌──────────────────────────────────────────────┐
│  ┌─ DoubtConnect ───────────────────────┐   │
│  │                                       │   │
│  │ How to use Java Streams?              │   │
│  │                                       │   │
│  │ I'm having trouble understanding      │   │
│  │ Java Streams...                       │   │
│  │                                       │   │
│  │ By user@example.com                   │   │
│  │                                       │   │
│  │ ─────── Answers (1) ────────           │   │
│  │                                       │   │
│  │ Streams are a powerful abstraction... │   │
│  │ By expert@example.com                 │   │
│  │                                       │   │
│  └─────────────────────────────────────┘   │
└──────────────────────────────────────────────┘
```

---

## 🔧 Technology Interactions

### Frontend ↔ Backend Communication

```
Frontend (React)
├── Vite (Build & Dev Server)
│   ├── Hot Module Replacement (HMR)
│   └── Fast refresh on file changes
│
├── TailwindCSS (Styling)
│   └── Utility-first CSS framework
│
├── HTTP Client (Fetch API / Axios)
│   ├── POST requests → Create operations
│   ├── GET requests → Read operations
│   ├── PUT requests → Update operations
│   ├── DELETE requests → Delete operations
│   └── Headers: Authorization, Content-Type
│
└── State Management
    ├── React Hooks (useState, useEffect)
    ├── Local state for form data
    └── JWT token in localStorage

         ┌─────────────────────────┐
         │ HTTP/REST JSON (Port 8081)
         └─────────────────────────┘

Backend (Spring Boot)
├── DispatcherServlet
│   └── Routes requests to controllers
│
├── Security Filters
│   ├── CorsFilter
│   └── JwtAuthFilter
│
├── Controllers (REST Endpoints)
│   ├── Parse JSON request body
│   ├── Call appropriate services
│   └── Return JSON response
│
├── Services (Business Logic)
│   ├── Validate data
│   ├── Process requests
│   └── Delegate to repositories
│
├── Repositories (Data Access)
│   ├── JPA queries
│   ├── Entity mapping
│   └── Transaction handling
│
├── Hibernate/JPA (ORM)
│   ├── Map entities to tables
│   ├── Auto-generate SQL
│   └── Manage relationships
│
└── MySQL Driver (JDBC)
    └── Execute SQL commands

         ┌─────────────────────────┐
         │ SQL (Port 3306)
         └─────────────────────────┘

Database (MySQL)
├── Users Table
│   └── Store user credentials
│
├── Doubts Table
│   ├── Store questions/doubts
│   └── Foreign key to Users
│
└── Answers Table
    ├── Store responses
    ├── Foreign key to Doubts
    └── Foreign key to Users
```

### Spring Boot Internal Flow

```
HTTP Request
    │
    ▼
┌─────────────────────────────────┐
│ DispatcherServlet              │
│ (Central request handler)       │
└────────────┬────────────────────┘
             │
    ▼
┌─────────────────────────────────┐
│ HandlerMapping                  │
│ (Map URL to controller)         │
└────────────┬────────────────────┘
             │
    ▼
┌─────────────────────────────────┐
│ Controller Method               │
│ (Handle request logic)          │
└────────────┬────────────────────┘
             │
    ▼
┌─────────────────────────────────┐
│ Service Layer                   │
│ (Business logic processing)     │
└────────────┬────────────────────┘
             │
    ▼
┌─────────────────────────────────┐
│ Repository Layer                │
│ (Data access via JPA)           │
└────────────┬────────────────────┘
             │
    ▼
┌─────────────────────────────────┐
│ Hibernate/EntityManager         │
│ (ORM translation)               │
└────────────┬────────────────────┘
             │
    ▼
┌─────────────────────────────────┐
│ JDBC Connection Pool            │
│ (Database connections)          │
└────────────┬────────────────────┘
             │
    ▼
┌─────────────────────────────────┐
│ MySQL Database                  │
│ (SQL execution)                 │
└────────────┬────────────────────┘
             │
    ▼
┌─────────────────────────────────┐
│ ViewResolver / ResponseHandler  │
│ (Convert to JSON)               │
└────────────┬────────────────────┘
             │
    ▼
HTTP Response (JSON)
```

---

## 🛡️ Security Architecture

### Authentication & Authorization Flow

```
┌─────────────────────────────────────────────────────────────┐
│                  AUTHENTICATION                              │
│           (Who are you? User identification)                 │
└─────────────────┬───────────────────────────────────────────┘
                  │
        ┌─────────▼──────────┐
        │ User submits       │
        │ Credentials        │
        │ (username,         │
        │  password)         │
        └─────────┬──────────┘
                  │
        ┌─────────▼──────────────────────────────────┐
        │ AuthService.login()                       │
        ├───────────────────────────────────────────┤
        │ 1. Fetch user from database               │
        │ 2. Compare password with BCrypt hash      │
        │ 3. If match: generate JWT                 │
        │ 4. If no match: throw exception           │
        └─────────┬──────────────────────────────────┘
                  │
        ┌─────────▼──────────────────────────────────┐
        │ JwtService.generateToken()                │
        ├───────────────────────────────────────────┤
        │ Creates token with:                       │
        │ - Algorithm: HS256 (HMAC SHA-256)         │
        │ - Secret: Stored in JwtService            │
        │ - Subject: username                       │
        │ - Expiration: 24 hours                    │
        │ - Signed with secret key                  │
        └─────────┬──────────────────────────────────┘
                  │
        ┌─────────▼──────────────────────────────────┐
        │ Return JWT to Frontend                    │
        │ "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"    │
        └──────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│               AUTHORIZATION                                  │
│    (What can you do? Permission verification)                │
└─────────────────┬───────────────────────────────────────────┘
                  │
        ┌─────────▼──────────┐
        │ Protected request  │
        │ with JWT token     │
        └─────────┬──────────┘
                  │
        ┌─────────▼──────────────────────────────────┐
        │ JwtAuthFilter                             │
        ├───────────────────────────────────────────┤
        │ 1. Extract JWT from Authorization header  │
        │ 2. Validate token signature               │
        │ 3. Check token expiration                 │
        │ 4. Extract username from token            │
        │ 5. Load UserDetails from database         │
        │ 6. Create Authentication object           │
        │ 7. Set in SecurityContext                 │
        └─────────┬──────────────────────────────────┘
                  │
        ┌─────────▼──────────────────────────────────┐
        │ SecurityConfig.securityFilterChain()      │
        ├───────────────────────────────────────────┤
        │ Check URL against auth rules:             │
        │                                           │
        │ - Public: /auth/signup, /auth/login       │
        │   → permitAll()                           │
        │                                           │
        │ - Protected: /api/**                      │
        │   → hasAuthority("ROLE_USER")             │
        │                                           │
        │ If user has ROLE_USER → Allow            │
        │ If user lacks role → Deny (403)          │
        └─────────┬──────────────────────────────────┘
                  │
        ┌─────────▼──────────────────────────────────┐
        │ Controller Method Execution                │
        │ (If authorization successful)              │
        └──────────────────────────────────────────┘
```

### Password Security

```
User Registration:
    │
    ├─ User submits plaintext password
    │
    ▼
BCryptPasswordEncoder.encode(plaintext)
    │
    ├─ Generate random salt
    ├─ Apply BCrypt algorithm with salt
    └─ Return hashed password
    │
    ▼
Store hash in database (NOT plaintext!)

User Login:
    │
    ├─ User submits plaintext password
    │
    ▼
Fetch hashed password from database
    │
    ▼
BCryptPasswordEncoder.matches(plaintext, hash)
    │
    ├─ Apply BCrypt to plaintext with extracted salt
    ├─ Compare result with stored hash
    ├─ If match → Authentication success
    └─ If no match → Authentication failure
```

### CORS Security

```
Frontend at: http://localhost:5173
Backend at: http://localhost:8081

Request from Frontend:
    │
    ├─ Origin: http://localhost:5173
    │
    ▼
CorsFilter checks:
    │
    ├─ Is origin in allowedOrigins?
    │   └─ http://localhost:5173 ✓ ALLOWED
    │
    ├─ Is method in allowedMethods?
    │   └─ POST, GET, PUT, DELETE ✓ ALLOWED
    │
    └─ Are headers allowed?
        └─ Authorization, Content-Type ✓ ALLOWED

Response includes:
    │
    ├─ Access-Control-Allow-Origin: http://localhost:5173
    ├─ Access-Control-Allow-Methods: GET, POST, PUT, DELETE
    ├─ Access-Control-Allow-Credentials: true
    │
    └─ Browser allows response to be read by frontend
```

---

## 📊 Performance Considerations

### Lazy vs Eager Loading

```
User → Doubts (Relationship)

@ManyToOne(fetch = FetchType.EAGER)
├─ When User is loaded
├─ Doubt is immediately fetched
└─ Good for: Simple relationships, small data

Answer → Doubt (Relationship)

@OneToMany(mappedBy = "doubt", fetch = FetchType.LAZY)
├─ When Doubt is loaded
├─ Answers are NOT fetched immediately
├─ Accessed only when explicitly called
└─ Good for: Potentially large collections

Benefit: Avoid N+1 query problem
```

### Database Optimization Opportunities

```
Current State:
├─ No query optimization
├─ No caching layer
├─ No pagination on feed
└─ Fetches all doubts every time

Recommended Improvements:
├─ Add pagination: @Pageable
├─ Add caching: @Cacheable
├─ Add database indexes
├─ Implement query batching
└─ Add query projection for read-only queries
```

---

## 🔄 Deployment Architecture

### Development Environment
```
Developer Machine:
├─ Frontend: npm run dev (Port 5173)
├─ Backend: mvnw spring-boot:run (Port 8081)
└─ Database: MySQL local instance (Port 3306)
```

### Production Environment (Recommended)
```
┌─────────────────────────────┐
│   Nginx / Load Balancer      │
│   (Reverse proxy, SSL)       │
└────────────┬────────────────┘
             │
    ┌────────┴────────┐
    │                 │
    ▼                 ▼
┌──────────────┐  ┌──────────────┐
│ Spring Boot  │  │ Spring Boot  │
│ Instance 1   │  │ Instance 2   │
│ (Port 8081)  │  │ (Port 8082)  │
└──────┬───────┘  └───────┬──────┘
       │                  │
       └────────┬─────────┘
                │
                ▼
        ┌────────────────┐
        │ MySQL Database │
        │ (Replication)  │
        └────────────────┘

Frontend:
├─ Built with: npm run build
├─ Deployed on: CDN / Static server
└─ Served with HTTPS
```

---

## 🚀 Architecture Evolution

### Current (Version 0.0.1)
- Basic CRUD operations
- JWT authentication
- Monolithic backend
- Direct database queries

### Future Enhancements
```
├─ Microservices (Auth, Doubt, Answer services)
├─ Message Queue (RabbitMQ, Kafka)
├─ Caching Layer (Redis)
├─ Elasticsearch for search
├─ File storage (S3 for images)
├─ Real-time features (WebSockets)
├─ GraphQL API alternative
├─ API versioning
└─ Comprehensive logging & monitoring
```

---

## 📚 References

- [Spring Boot Architecture](https://spring.io/projects/spring-boot)
- [JWT Best Practices](https://tools.ietf.org/html/rfc7519)
- [REST API Design](https://restfulapi.net/)
- [React Component Architecture](https://react.dev/learn/thinking-in-react)
- [MySQL Optimization](https://dev.mysql.com/doc/)

---

**Document Version**: 1.0  
**Last Updated**: February 2026  
**Architecture Pattern**: Three-Tier Client-Server  
**Status**: Current & Active
