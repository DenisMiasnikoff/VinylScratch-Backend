import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const getFavorites = async (req: Request, res: Response): Promise<void> => {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: req.user.id },
      include: { song: true },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({ status: 'success', data: { favorites } });
  } catch (err) {
    const error = err as Error;
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

export const addFavorite = async (req: Request, res: Response): Promise<void> => {
  try {
    const songId = req.params.songId as string;

    const song = await prisma.song.findUnique({
      where: { id: songId }
    });

    if (!song) {
      res.status(404).json({ status: 'fail', message: 'Song not found' });
      return;
    }

    const existing = await prisma.favorite.findUnique({
      where: {
        userId_songId: { userId: req.user.id, songId }
      }
    });

    if (existing) {
      res.status(400).json({ status: 'fail', message: 'Song already in favorites' });
      return;
    }

    const favorite = await prisma.favorite.create({
      data: { userId: req.user.id, songId }
    });

    res.status(201).json({ status: 'success', data: { favorite } });
  } catch (err) {
    const error = err as Error;
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

export const removeFavorite = async (req: Request, res: Response): Promise<void> => {
  try {
    const songId = req.params.songId as string;

    await prisma.favorite.delete({
      where: {
        userId_songId: { userId: req.user.id, songId }
      }
    });

    res.status(204).send();
  } catch (err) {
    const error = err as Error;
    res.status(400).json({ status: 'fail', message: error.message });
  }
};