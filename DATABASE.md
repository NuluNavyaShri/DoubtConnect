# Database Schema — DoubtConnect

This document explains the database model used by DoubtConnect: tables, primary keys, foreign keys, and relationships.

Overview
- DBMS: MySQL (configured in `backend/src/main/resources/application.properties`).
- Core entities: `User`, `Doubt`, `Answer`.

Tables

1) `user`
- Purpose: stores account information and credentials.
- Primary key: `username` (String)
- Columns (important):
  - `username` VARCHAR PRIMARY KEY
  - `first_name` VARCHAR NOT NULL
  - `last_name` VARCHAR
  - `password` VARCHAR NOT NULL (BCrypt hashed)
  - `role` VARCHAR (default `ROLE_USER`)

2) `doubt`
- Purpose: stores posted questions (doubts).
- Primary key: `doubt_id` (BIGINT AUTO_INCREMENT)
- Columns (important):
  - `doubt_id` BIGINT PRIMARY KEY AUTO_INCREMENT
  - `title` VARCHAR(200) NOT NULL
  - `description` TEXT NOT NULL
  - `asked_by` VARCHAR NOT NULL — foreign key to `user.username`

3) `answer`
- Purpose: stores answers/comments for doubts.
- Primary key: `answer_id` (BIGINT AUTO_INCREMENT)
- Columns (important):
  - `answer_id` BIGINT PRIMARY KEY AUTO_INCREMENT
  - `content` TEXT NOT NULL
  - `doubt_id` BIGINT NOT NULL — foreign key to `doubt.doubt_id`
  - `answered_by` VARCHAR NOT NULL — foreign key to `user.username`

Relationships & constraints
- `user.username` is referenced by `doubt.asked_by` and `answer.answered_by`.
- `doubt.doubt_id` is referenced by `answer.doubt_id`.
- Cascade behaviour: the JPA model configures `Doubt` → `Answer` as `cascade = CascadeType.ALL` and `orphanRemoval = true`, which means deleting a `Doubt` should remove related `Answer` rows.

Referential integrity (recommended SQL constraints)
- `doubt.asked_by` FOREIGN KEY REFERENCES `user`(`username`) ON DELETE RESTRICT
- `answer.answered_by` FOREIGN KEY REFERENCES `user`(`username`) ON DELETE RESTRICT
- `answer.doubt_id` FOREIGN KEY REFERENCES `doubt`(`doubt_id`) ON DELETE CASCADE

Indexing recommendations
- Primary keys provide clustered indexes.
- Add indexes for common lookup patterns:
  - `doubt(asked_by)` — to fetch a user's doubts (`findByUserUsername`).
  - `answer(doubt_id)` — to fetch answers for a doubt (`findByDoubtDoubtId`).
  - `answer(answered_by)` — to fetch a user's answers.

Fetch strategies & performance notes
- Entities use `FetchType.EAGER` on many-to-one associations (User in Doubt/Answer). This causes joins or extra selects to load related user data. Consider switching to `LAZY` for large collections and only fetch what you need.
- `Doubt` holds a `List<Answer>` with `cascade` and `orphanRemoval`. Loading `Doubt` may load answers depending on fetch configuration — use DTOs in service layer to control payload size.

Sample SQL (illustrative)
```sql
CREATE TABLE user (
  username VARCHAR(255) PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255),
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'ROLE_USER'
);

CREATE TABLE doubt (
  doubt_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  asked_by VARCHAR(255) NOT NULL,
  FOREIGN KEY (asked_by) REFERENCES user(username)
);

CREATE TABLE answer (
  answer_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  content TEXT NOT NULL,
  doubt_id BIGINT NOT NULL,
  answered_by VARCHAR(255) NOT NULL,
  FOREIGN KEY (doubt_id) REFERENCES doubt(doubt_id) ON DELETE CASCADE,
  FOREIGN KEY (answered_by) REFERENCES user(username)
);
```

Migration & seeding notes
- Keep schema migrations in a tool like Flyway or Liquibase for production deployments.
- Use `database/queries.sql` for sample data inserts during development (file currently empty in repo).

Where to inspect code
- Entity definitions: `backend/src/main/java/com/app/doubtconnect/model/`
- Repository query methods: `backend/src/main/java/com/app/doubtconnect/repository/`

Last updated: February 2026
