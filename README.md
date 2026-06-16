# 🎵 VinylScratch — Backend

REST API for VinylScratch, a music library app. Handles authentication, songs, playlists, and favorites, backed by PostgreSQL via Prisma.

**Live API:** https://vinylscratch-backend.onrender.com
**Frontend repo:** https://github.com/DenisMiasnikoff/VinylScratch-Frontend
**Live app:** https://vinylscratch-frontend.netlify.app

> ⏱️ Hosted on a free tier that sleeps after inactivity — the first request may take ~50 seconds to wake the service.

---

## Features

- **JWT authentication** via secure, httpOnly cookies (with cross-origin support for a separately-hosted frontend)
- **Password hashing** with bcrypt
- **Input validation** with Zod
- **Rate limiting** — global and stricter auth-specific limits
- **Ownership enforcement** — users can only access and modify their own resources
- **Cascading deletes** — removing a user or song cleans up related records automatically

## Tech stack

- **Node.js** + **Express 5**
- **TypeScript**
- **PostgreSQL** (hosted on Neon)
- **Prisma** ORM
- **JWT** for auth, **bcrypt** for password hashing
- **Zod** for validation

## Data model

```
User ──┬─< Song ──┬─< PlaylistSong >── Playlist >── User
       │          └─< Favorite >── User
       ├─< Playlist
       └─< Favorite
```

- A **User** has many songs, playlists, and favorites.
- A **Song** belongs to a user and can appear in many playlists and favorites.
- **PlaylistSong** and **Favorite** are join tables with composite primary keys.
- All relations cascade on delete.

## API reference

Base URL: `/api/v1`
All routes except auth require a valid `jwt` cookie. Responses follow a consistent envelope: `{ "status": "success" | "fail", "data"?: {...}, "message"?: "..." }`.

### Auth — `/api/v1/auth`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/signup` | Create an account; sets auth cookie |
| `POST` | `/login` | Log in; sets auth cookie |
| `POST` | `/logout` | Clear the auth cookie |

### Songs — `/api/v1/songs`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | List the current user's songs |
| `POST` | `/` | Add a song (`title`, `fileUrl`, optional `artist`/`duration`) |
| `GET` | `/:id` | Get a single song |
| `DELETE` | `/:id` | Delete a song (owner only) |

### Playlists — `/api/v1/playlists`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | List playlists with their songs |
| `POST` | `/` | Create a playlist (`name`) |
| `DELETE` | `/:id` | Delete a playlist (owner only) |
| `PATCH` | `/:id/songs` | Add a song to a playlist (`songId`) |
| `DELETE` | `/:id/songs/:songId` | Remove a song from a playlist |

### Favorites — `/api/v1/favorites`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | List favorited songs |
| `POST` | `/:songId` | Add a song to favorites |
| `DELETE` | `/:songId` | Remove a song from favorites |

## Running locally

```bash
# 1. Install dependencies
npm install

# 2. Create .env (see below)

# 3. Apply database migrations
npx prisma migrate dev

# 4. Start the dev server
npm run dev
```

The API runs on `http://localhost:5000`.

### Environment variables

| Variable | Description | Example |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host/db?sslmode=require` |
| `JWT_SECRET` | Secret for signing tokens | `a-long-random-string` |
| `JWT_EXPIRES_IN` | Token lifetime | `90d` |
| `ALLOWED_ORIGIN` | Frontend origin for CORS | `http://localhost:3000` |
| `NODE_ENV` | `development` or `production` | `development` |
| `PORT` | Port to listen on (host may inject this) | `5000` |

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start with hot reload (nodemon + ts-node) |
| `npm run build` | Generate Prisma client, run migrations, compile TypeScript |
| `npm start` | Run the compiled server from `dist/` |

## Deployment notes

Deployed on **Render** with a **Neon** PostgreSQL database. A few things that matter in production:

- **`NODE_ENV=production`** must be set — auth cookies switch to `SameSite=None; Secure` so they work across the frontend (Netlify) and backend (Render) domains.
- **`app.set('trust proxy', 1)`** is enabled so Express recognizes the HTTPS connection behind Render's proxy, which secure cookies depend on.
- **`ALLOWED_ORIGIN`** must exactly match the deployed frontend URL for CORS.
- TypeScript build dependencies live in `dependencies` (not `devDependencies`) so the production install can compile the project.

---

Built by [Denis Miasnikov](https://github.com/DenisMiasnikoff).
