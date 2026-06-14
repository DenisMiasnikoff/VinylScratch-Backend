import { Router } from 'express';
import { getAllSongs, createSong, deleteSong, getSong } from '../controllers/songController';
import { protect } from '../controllers/authController';
import { validate } from '../middleware/validate';
import { createSongSchema } from '../utils/schemas';

const router = Router();

router.use(protect);

router.route('/')
  .get(getAllSongs)
  .post(validate(createSongSchema), createSong);

router.route('/:id')
  .get(getSong)
  .delete(deleteSong);

export default router;