import express from 'express';
import cors from 'cors';
import path from 'path';
import { config } from '../config.ts';
import { router as apiRouter } from './routers/index.router.ts';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middlewares/error.middleware.ts';
import { addResponseMethodsMiddleware } from './middlewares/response.middleware.ts';

export const app = express();

app.use(
  cors({
    origin: config.allowedOrigin,
    credentials: true,
  }),
);

app.use(express.json());

app.use(cookieParser());

app.use(addResponseMethodsMiddleware);

// Serve static files (used for avatars)
app.use('/avatars', express.static(path.join(process.cwd(), 'public/avatars')));

app.get('/api/v1/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/v1', apiRouter);

app.use(errorHandler);
