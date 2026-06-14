import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const getAllPlaylists = async (req: Request, res: Response): Promise<void> => {
  try {
    const playlists = await prisma.playlist.findMany({
      where: { userId: req.user.id },
      include: {
        songs: {
          include: { song: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({ status: 'success', data: { playlists } });
  } catch (err) {
    const error = err as Error;
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

export const createPlaylist = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name } = req.body;

    const playlist = await prisma.playlist.create({
      data: { name, userId: req.user.id }
    });

    res.status(201).json({ status: 'success', data: { playlist } });
  } catch (err) {
    const error = err as Error;
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

export const deletePlaylist = async (req: Request, res: Response): Promise<void> => {
  try {
    const playlist = await prisma.playlist.findUnique({
      where: { id: req.params.id as string }
    });

    if (!playlist) {
      res.status(404).json({ status: 'fail', message: 'Playlist not found' });
      return;
    }

    if (playlist.userId !== req.user.id) {
      res.status(403).json({ status: 'fail', message: 'You can only delete your own playlists' });
      return;
    }

    await prisma.playlist.delete({ where: { id: req.params.id as string } });

    res.status(204).send();
  } catch (err) {
    const error = err as Error;
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

export const addSongToPlaylist = async (req: Request, res: Response): Promise<void> => {
  try {
    const { songId } = req.body;
    const playlistId = req.params.id as string;

    const playlist = await prisma.playlist.findUnique({
      where: { id: playlistId }
    });

    if (!playlist) {
      res.status(404).json({ status: 'fail', message: 'Playlist not found' });
      return;
    }

    if (playlist.userId !== req.user.id) {
      res.status(403).json({ status: 'fail', message: 'Access denied' });
      return;
    }

    const playlistSong = await prisma.playlistSong.create({
      data: { playlistId, songId }
    });

    res.status(201).json({ status: 'success', data: { playlistSong } });
  } catch (err) {
    const error = err as Error;
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

export const removeSongFromPlaylist = async (req: Request, res: Response): Promise<void> => {
  try {
    const playlistId = req.params.id as string;
    const songId = req.params.songId as string;

    await prisma.playlistSong.delete({
      where: {
        playlistId_songId: { playlistId, songId }
      }
    });

    res.status(204).send();
  } catch (err) {
    const error = err as Error;
    res.status(400).json({ status: 'fail', message: error.message });
  }
};