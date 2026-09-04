# API Reference — DoubtConnect

Base URL (development): `http://localhost:8081`

Auth (cookies)
- The backend issues an HTTP-only cookie named `jwt` after successful login. All protected requests must be sent with credentials so the browser includes the cookie (e.g., `fetch(..., { credentials: 'include' })`).

Common headers
- `Content-Type: application/json`
- Requests requiring authentication must include cookies; no `Authorization` header is required by default.

---

## Authentication

POST /auth/signup
- Purpose: register a new user
- Request JSON:
```json
{
  "username": "user@example.com",
  "password": "strongPassword",
  "firstName": "John",
  "lastName": "Doe"
}
```
- Response: 201 Created
```json
{ "message": "Signup successful" }
```

POST /auth/login
- Purpose: authenticate and receive JWT cookie
- Request JSON:
```json
{
  "username": "user@example.com",
  "password": "strongPassword"
}
```
- Response: 200 OK (sets `Set-Cookie: jwt=<token>; HttpOnly`)
```json
{ "message": "Login successful" }
```

POST /auth/logout
- Purpose: clear auth cookie
- Request: include credentials
- Response: 200 OK
```json
{ "message": "Logged out successfully" }
```

---

## Doubt endpoints

POST /api/doubts/post
- Auth: required
- Purpose: create a new doubt
- Request JSON (DoubtDTO):
```json
{
  "title": "How to use Java Streams?",
  "description": "Example description"
}
```
- Response: 201 Created
```json
{
  "doubtId": 1,
  "title": "How to use Java Streams?",
  "description": "Example description",
  "askedBy": "user@example.com",
  "answers": []
}
```

GET /api/doubts/feed
- Auth: required
- Purpose: get all doubts not created by current user (feed)
- Response: 200 OK — array of DoubtResponse

GET /api/doubts/{id}
- Auth: required
- Purpose: get a specific doubt and its answers
- Response: 200 OK — DoubtResponse including answers

GET /api/doubts/me
- Auth: required
- Purpose: get current user's doubts
- Response: 200 OK — array of DoubtResponse

---

## Answer endpoints

POST /api/answer/comment
- Auth: required
- Purpose: post an answer to a doubt
- Request JSON (AnswerDTO):
```json
{
  "doubtId": 1,
  "content": "Java Streams provide a functional approach..."
}
```
- Response: 201 Created — AnswerResponse

GET /api/answer/comment/{id}
- Auth: required
- Purpose: get an answer by id
- Response: 200 OK — AnswerResponse

PUT /api/answer/comment/{id}
- Auth: required
- Purpose: update an answer's content
- Request JSON (AnswerDTO):
```json
{ "content": "Updated content..." }
```
- Response: 200 OK — updated AnswerResponse

DELETE /api/answer/comment/{id}
- Auth: required
- Purpose: delete an answer
- Response: 200 OK — deletion confirmation or deleted AnswerResponse

GET /api/answer/allComments
- Auth: required
- Purpose: list all answers across platform
- Response: 200 OK — array of AnswerResponse

GET /api/answer/comments/me
- Auth: required
- Purpose: get current user's answers
- Response: 200 OK — array of AnswerResponse

GET /api/answer/comments/{doubtId}
- Auth: required
- Purpose: get all answers for given doubt id
- Response: 200 OK — array of AnswerResponse

---

## Error responses
- Common error structure (example):
```json
{
  "timestamp": "2026-02-11T12:00:00Z",
  "status": 404,
  "error": "Not Found",
  "message": "Doubt not found",
  "path": "/api/doubts/999"
}
```
- 401 Unauthorized: missing or invalid JWT
- 403 Forbidden: insufficient role/authority
- 400 Bad Request: invalid payload
- 404 Not Found: resource missing

---

## Notes & integration tips
- Always call backend endpoints with credentials included so the `jwt` cookie is sent by the browser.
- For initial auth state on page load, call a session endpoint (e.g., `GET /auth/me`) or rely on a 401/200 from a lightweight `/auth/status` endpoint to determine `isAuthenticated`.
- Use centralized API wrapper (`src/services/api.js`) to set base URL and attach `credentials: 'include'`.

Where to find implementation
- Controllers: `backend/src/main/java/com/app/doubtconnect/controller/`
- DTOs: `backend/src/main/java/com/app/doubtconnect/dto/`

Last updated: February 2026
