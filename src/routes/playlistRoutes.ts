import { Router } from 'express';
import {
  getAllPlaylists,
  createPlaylist,
  deletePlaylist,
  addSongToPlaylist,
  removeSongFromPlaylist
} from '../controllers/playlistController';
import { protect } from '../controllers/authController';
import { validate } from '../middleware/validate';
import { createPlaylistSchema } from '../utils/schemas';

const router = Router();

router.use(protect);

router.route('/')
  .get(getAllPlaylists)
  .post(validate(createPlaylistSchema), createPlaylist);

router.route('/:id')
  .delete(deletePlaylist);

router.route('/:id/songs')
  .post(addSongToPlaylist);

router.route('/:id/songs/:songId')
  .delete(removeSongFromPlaylist);

export default router;