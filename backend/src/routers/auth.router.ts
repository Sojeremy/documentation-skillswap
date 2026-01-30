import { Router } from 'express';
import {
  register,
  login,
  logout,
  refreshAccessToken,
  getMe,
} from '../controllers/auth.controller.ts';
import { registerSchema, loginSchema } from '../validation/auth.validation.ts';
import { checkAuth, validate } from '../middlewares/auth.middleware.ts';

export const authRouter = Router();

authRouter.post('/register', validate('body', registerSchema), register);
authRouter.post('/login', validate('body', loginSchema), login);
authRouter.post('/logout', logout);
authRouter.post('/refresh', refreshAccessToken);
authRouter.get('/me', checkAuth, getMe);
