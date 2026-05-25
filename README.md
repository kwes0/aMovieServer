# aMovieServer API

> A RESTful backend server built to manage users, movies, and personal watchlists.  
> Built for learning — exploring Node.js, Prisma ORM, and Supabase in a real-world server architecture.

---

## Overview

aMovieServer API is a backend server that handles user registration, a shared movie database, and personal watchlists. A key design decision is that a **movie creator is also a user** — there is no separate admin model. 
---

## Tech Stack

| Technology | Version / Tool | Role |
|---|---|---|
| Node.js | v20+ | Runtime & REST API server |
| Express | v4 | HTTP routing & middleware |
| Prisma | ORM | Schema definition, migrations & type-safe queries |
| Supabase | PostgreSQL | Hosted database & auth provider |

---

## Architecture

The project follows a layered architecture to keep concerns separated:

```
aMovieServer-api/
├── prisma/
│   ├── schema.prisma         # Data models & relations
│   └── migrations/           # Auto-generated migration files
├── src/
│   ├── config/               # prisma client config and database connection
│   ├── routes/               # Express route definitions
│   ├── controllers/          # Business logic per resource
│   ├── middleware/           # Auth guards & error handling
│   ├── routes/               # API route definition
│   ├── validators/           # Database entry schema checks
│   └── index.js              # App entry point
├── .env                      # Environment variables (git-ignored)
└── package.json
└── prisma.config.ts

```

---

## Data Models

### User
- Stores credentials and profile information
- Has a one-to-many relationship with Watchlist entries

### Movie
- Represents a film entry in the shared database
- Added by a `User` with the `isCreator` role
- Linked to users via the Watchlist join model

### Watchlist
- Join table linking a `User` to their saved `Movies`
- Allows a user to add or remove movies from their personal list
- Timestamps track when each entry was added

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/register` | Register a new user (also registers them as a potential creator) |
| `POST` | `/auth/login` | Authenticate and return a session token |
| `GET` | `/movies` | Fetch all movies in the database |
| `POST` | `/movies` | Create a new movie (creator only) |
| `GET` | `/movies/:id` | Get details of a specific movie |
| `POST` | `/watchlist` | Add a movie to the authenticated user's watchlist |
| `GET` | `/watchlist` | Retrieve the current user's watchlist |
| `DELETE` | `/watchlist/:id` | Remove a movie from the watchlist |

---

## Getting Started

### Prerequisites
- Node.js v20 or higher
- A Supabase project with a PostgreSQL database
- npm or yarn

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/kwes0/aMovieServer.git
cd aMovieServer

# 2. Install dependencies
yarn add

# 3. Configure environment variables

# Fill in your Supabase DATABASE_URL and JWT_SECRET

# 4. Run Prisma migrations
yarn prisma migrate dev

# 5. Start the server
yarn run dev
```

### Environment Variables

```bash

DATABASE_URL=

DIRECT_URL=

NODE_ENV=

JWT_SECRET=

JWT_EXPIRES_IN=
```

---

## Lessons Learned

| Area | What I Learned |
|---|---|
| Prisma ORM | Schema-first design, running migrations, and using Prisma Client for type-safe DB access |
| Supabase | Connecting a hosted PostgreSQL instance and leveraging Supabase Auth for user management |
| Relational Modelling | Designing one-to-many and many-to-many relationships (users, movies, watchlists) |
| REST API Design | Structuring clean routes, separating controllers from routes, and handling errors consistently |
| Role-Based Logic | Differentiating between a regular user and a creator within the same User model |
| Environment Config | Managing secrets safely with `.env` files and never committing credentials |

---

## Possible Future Improvements

- Add pagination to the `/movies` endpoint for large datasets
- Introduce movie categories or genres and allow filtering
- Implement refresh tokens for better auth session management
- Add unit and integration tests with Jest and Supertest
- Containerise the app with Docker for consistent local development

---

*Built for learning purposes — Node.js • Prisma • Supabase*