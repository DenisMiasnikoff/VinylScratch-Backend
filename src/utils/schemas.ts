import { z } from 'zod';

export const signupSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').max(21, 'Username too long'),
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const createSongSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  artist: z.string().max(100, 'Artist name too long').optional(),
  fileUrl: z.string().min(1, 'File URL is required'),
  duration: z.number().optional(),
});

export const createPlaylistSchema = z.object({
  name: z.string().min(1, 'Playlist name is required').max(50, 'Name too long'),
});