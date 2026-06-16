import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/authRoutes';
import songRoutes from './routes/songRoutes';
import playlistRoutes from "./routes/playlistRoutes";
import favoriteRoutes from "./routes/favoriteRoutes";
const app = express();
app.set('trust proxy', 1);
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { status: 'fail', message: 'Too many requests, please try again later.' }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { status: 'fail', message: 'Too many login attempts, please try again later.' }
});

app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

app.use(express.json());
app.use(cookieParser());
app.use(globalLimiter);

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ status: 'success', message: 'VinylScratch API' });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/songs', songRoutes);
app.use('/api/v1/playlists', playlistRoutes);
app.use('/api/v1/favorites', favoriteRoutes);

export default app;