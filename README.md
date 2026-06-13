# VinylScratch Backend

REST API for VinylScratch — a music platform where users upload songs, create playlists, and manage favorites.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express
- **Language:** TypeScript
- **Database:** PostgreSQL (hosted on Neon)
- **ORM:** Prisma
- **Auth:** JWT with httpOnly cookies
- **Validation:** Zod
- **Security:** bcrypt, rate limiting, CORS

## Features

- JWT authentication with httpOnly cookies
- User registration and login
- Song upload and management
- Playlist creation and management
- Favorites system
- Input validation with Zod
- Rate limiting on auth and global routes

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database (or Neon account)

### Installation

```bash
git clone https://github.com/DenisMiasnikoff/VinylScratch-Backend.git
cd VinylScratch-Backend
npm install
```

### Environment Variables

Create a `.env` file:

```env
DATABASE_URL="your_postgresql_connection_string"
JWT_SECRET="your_jwt_secret"
JWT_EXPIRES_IN="90d"
NODE_ENV="development"
ALLOWED_ORIGIN="http://localhost:3000"
```

### Database Setup

```bash
npx prisma migrate dev
```

### Run Development Server

```bash
npm run dev
```

Server runs on `http://localhost:5000`

## API Endpoints

### Auth
| Method | Endpoint | Description | Protected |
|--------|----------|-------------|-----------|
| POST | /api/v1/auth/signup | Register new user | No |
| POST | /api/v1/auth/login | Login | No |
| POST | /api/v1/auth/logout | Logout | Yes |

### Songs
| Method | Endpoint | Description | Protected |
|--------|----------|-------------|-----------|
| GET | /api/v1/songs | Get all user songs | Yes |
| POST | /api/v1/songs | Upload a song | Yes |
| DELETE | /api/v1/songs/:id | Delete a song | Yes |

### Playlists
| Method | Endpoint | Description | Protected |
|--------|----------|-------------|-----------|
| GET | /api/v1/playlists | Get all playlists | Yes |
| POST | /api/v1/playlists | Create playlist | Yes |
| PATCH | /api/v1/playlists/:id/songs | Add song to playlist | Yes |
| DELETE | /api/v1/playlists/:id/songs/:songId | Remove song | Yes |

### Favorites
| Method | Endpoint | Description | Protected |
|--------|----------|-------------|-----------|
| GET | /api/v1/favorites | Get favorites | Yes |
| POST | /api/v1/favorites/:songId | Add to favorites | Yes |
| DELETE | /api/v1/favorites/:songId | Remove from favorites | Yes |

## Database Schema

- **User** — authentication and profile
- **Song** — uploaded audio files
- **Playlist** — user created playlists
- **PlaylistSong** — many-to-many relation
- **Favorite** — user favorited songs

## License

MIT