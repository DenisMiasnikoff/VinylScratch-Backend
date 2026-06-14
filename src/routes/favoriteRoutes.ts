import { Router } from 'express';
import { getFavorites, addFavorite, removeFavorite } from '../controllers/favoriteController';
import { protect } from '../controllers/authController';

const router = Router();

router.use(protect);

router.get('/', getFavorites);
router.post('/:songId', addFavorite);
router.delete('/:songId', removeFavorite);

export default router;