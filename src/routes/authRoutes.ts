import { Router } from 'express';
import { signup, login, logout, protect } from '../controllers/authController';
import { validate } from '../middleware/validate';
import { signupSchema, loginSchema } from '../utils/schemas';

const router = Router();

router.post('/signup', validate(signupSchema), signup);
router.post('/login', validate(loginSchema), login);
router.post('/logout', protect, logout);

export default router;