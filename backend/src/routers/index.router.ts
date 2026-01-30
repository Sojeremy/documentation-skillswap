import { Router } from 'express';
import { authRouter } from './auth.router.ts';
import { profileRouteur } from './profile.router.ts';
import { convRouter } from './conv.router.ts';
import { followRouteur } from './follow.router.ts';
import { categoryRouter } from './category.router.ts';
import { skillRouter } from './skill.router.ts';
import { availabilityRouter } from './availability.router.ts';
import { searchRouter } from './search.router.ts';

export const router = Router();

router.use('/auth', authRouter);
router.use('/profiles', profileRouteur);
router.use('/conversations', convRouter);
router.use('/follows', followRouteur);
router.use('/categories', categoryRouter);
router.use('/skills', skillRouter);
router.use('/availabilities', availabilityRouter);
router.use('/search', searchRouter);
