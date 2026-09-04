# DoubtConnect Backend 

Essential guide to Spring Boot backend implementation.

---

## 📋 Quick Navigation

- [Project Structure](#project-structure)
- [Key Annotations](#key-annotations)
- [Models & DTOs](#models--dtos)
- [Services & Controllers](#services--controllers)
- [Security](#security)

---

## 📂 Project Structure

```
backend/src/main/java/com/app/doubtconnect/
 # DoubtConnect Backend — Short (code-free)

 Purpose: concise, code-free explanation of how the backend behaves at runtime and where to find implementation details.

 Overview: the backend is a Spring Boot REST API that handles user authentication (JWT), CRUD for doubts and answers, and persistence via Spring Data JPA to MySQL.

 Tech stack: Java 21, Spring Boot (Maven), Spring Data JPA/Hibernate, Spring Security (JWT + BCrypt), MySQL.

 Core components:
 - Controllers (`controller/`): HTTP endpoints and request/response mapping.
 - Services (`service/`): business rules, transactions, DTO mapping.
 - Repositories (`repository/`): JPA data access and derived queries.
 - Models (`model/`): `User`, `Doubt`, `Answer` entities and relationships.
 - Security (`security/`): JWT generation/validation, auth filter, and security rules.
```

 Request flow (summary):
 1. Client request arrives (may include JWT cookie).
 2. CORS filter enforces origin/method/headers and credentials policy.
 3. JWT filter validates token and sets the authenticated principal in the SecurityContext.
 4. Security configuration enforces route permissions (public vs protected).
 5. Controller parses DTO, performs light validation, delegates to a service.
 6. Service executes business logic inside a transaction (if mutating), uses repositories for DB ops, and returns DTOs.
 7. Controller returns HTTP response with status and payload.

 Authentication lifecycle (brief):
 - Login: credentials validated via `UserDetailsService` + BCrypt; on success `JwtService` issues a signed token.
 - Token is delivered as an HTTP-only `jwt` cookie; subsequent requests use this cookie for authentication.
 - Logout: server clears cookie; JWTs are stateless unless server-side revocation is implemented.

 Transactions & error handling:
 - Service methods performing multiple writes use transactions so operations commit or rollback atomically.
 - Services should throw domain-specific exceptions; map them to HTTP errors using a global exception handler.

 Persistence notes:
 - Entities link `User` ↔ `Doubt` ↔ `Answer`. Deleting a doubt typically cascades to its answers if cascade rules are enabled.
 - Be mindful of eager vs lazy fetch settings to avoid unnecessary joins or LazyInitializationExceptions.

 Security & CORS:
 - CORS allows the frontend origin and credentials so the browser can send cookies.
 - CSRF is usually disabled for stateless JWT APIs; review if you add cookie-based stateful flows.

 Where to inspect code:
 - `backend/src/main/java/com/app/doubtconnect/security/` — JWT and security config.
 - `backend/src/main/java/com/app/doubtconnect/controller/` — REST endpoints.
 - `backend/src/main/java/com/app/doubtconnect/service/` — business logic and transactions.
 - `backend/src/main/java/com/app/doubtconnect/repository/` — data access methods.


## 🔐 Security

### JWT Flow
1. **Login**: User sends credentials → Server validates → Generates JWT token → Returns in cookie
2. **Request**: Client sends request with JWT in cookie → JwtAuthFilter validates → Sets SecurityContext
3. **Logout**: Server clears JWT cookie


---

## 📊 Request Flow Example

```
POST /api/doubts/post with JWT cookie
    ↓
CorsFilter: Allow origin? ✓
    ↓
JwtAuthFilter: Extract & validate token → Set SecurityContext
    ↓
DoubtController.postDoubt()
    ↓
DoubtService.postDoubt(): Get current user, create doubt, save
    ↓
DoubtRepository.save()
    ↓
Database: INSERT INTO doubt
    ↓
Return DoubtResponse (201 Created)
```

---

## 🔗 API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | /auth/signup | Register user |
| POST | /auth/login | Login & get JWT |
| POST | /auth/logout | Clear JWT |
| POST | /api/doubts/post | Post doubt |
| GET | /api/doubts/{id} | Get doubt with answers |
| GET | /api/doubts/feed | Get all other users' doubts |
| GET | /api/doubts/me | Get my doubts |
| POST | /api/answer/comment | Post answer |
| GET | /api/answer/comment/{id} | Get answer |
| PUT | /api/answer/comment/{id} | Update answer |
| DELETE | /api/answer/comment/{id} | Delete answer |

---

## 🎯 Key Concepts

**Transactional**: @Transactional ensures all DB operations in a method either all succeed or all rollback

**Dependency Injection**: Constructor injection with @RequiredArgsConstructor makes dependencies explicit

**DTO Pattern**: DTOs separate internal entities from API contracts

**Repository Pattern**: JPA repositories auto-generate SQL from method names

**Security Context**: SecurityContextHolder stores current authenticated user info

**JWT**: Stateless token-based auth (no server sessions)

**Cascade**: Changes to Doubt cascade to Answers (delete doubt = delete answers)

---

**Version**: 0.0.1-SNAPSHOT | **Framework**: Spring Boot 3.4.1 | **Java**: 21
