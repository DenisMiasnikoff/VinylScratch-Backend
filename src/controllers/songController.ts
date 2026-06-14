import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const getAllSongs = async (req: Request, res: Response): Promise<void> => {
  try {
    const songs = await prisma.song.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({ status: 'success', data: { songs } });
  } catch (err) {
    const error = err as Error;
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

export const createSong = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, artist, fileUrl, duration } = req.body;

    const song = await prisma.song.create({
      data: {
        title,
        artist,
        fileUrl,
        duration,
        userId: req.user.id
      }
    });

    res.status(201).json({ status: 'success', data: { song } });
  } catch (err) {
    const error = err as Error;
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

export const deleteSong = async (req: Request, res: Response): Promise<void> => {
  try {
    const song = await prisma.song.findUnique({
      where: { id: req.params.id as string }
    });

    if (!song) {
      res.status(404).json({ status: 'fail', message: 'Song not found' });
      return;
    }

    if (song.userId !== req.user.id) {
      res.status(403).json({ status: 'fail', message: 'You can only delete your own songs' });
      return;
    }

    await prisma.song.delete({ where: { id: req.params.id as string} });

    res.status(204).send();
  } catch (err) {
    const error = err as Error;
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

export const getSong = async (req: Request, res: Response): Promise<void> => {
  try {
    const song = await prisma.song.findUnique({
      where: { id: req.params.id as string }
    });

    if (!song) {
      res.status(404).json({ status: 'fail', message: 'Song not found' });
      return;
    }

    if (song.userId !== req.user.id) {
      res.status(403).json({ status: 'fail', message: 'Access denied' });
      return;
    }

    res.status(200).json({ status: 'success', data: { song } });
  } catch (err) {
    const error = err as Error;
    res.status(400).json({ status: 'fail', message: error.message });
  }
};