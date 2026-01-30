import type { Request, Response, NextFunction } from 'express';
import { FileValidationError, HttpError } from '../lib/error.ts';
import z from 'zod';
import jwt from 'jsonwebtoken';
import { prettifyZodError } from '../lib/formatZodError.ts';
import { Prisma } from '../models/index.ts';
import multer from 'multer';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  // If we throw our custom HttpError(ex: 404 NOT FOUND)
  if (err instanceof HttpError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  // If error is sent from jsonwebtoken -> error 401 UNAUTHORIZED
  if (err instanceof jwt.TokenExpiredError) {
    res.status(401).json({ error: `Expired JWT token` });
    return;
  }
  if (err instanceof jwt.JsonWebTokenError) {
    res.status(401).json({ error: `JWT error: ${err.message}` });
    return;
  }

  // If error is related to validation -> error 422 UNPROCESSABLE ENTITY
  if (err instanceof z.ZodError) {
    res.status(422).json({ error: prettifyZodError(err.issues) });
    return;
  }
  // Prisma errors handling
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // P2025: record not found
    if (err.code === 'P2025') {
      res.status(404).json({ error: 'Resource not found' });
      return;
    }

    // P2002: unique constraint
    if (err.code === 'P2002') {
      res.status(409).json({ error: 'Conflict: resource already exists' });
      return;
    }

    // P2003: foreign key constraint
    if (err.code === 'P2003') {
      res.status(409).json({ error: 'Conflict: invalid relation' });
      return;
    }

    console.error('Prisma known error:', err.code, err.message);
    res.status(400).json({ error: 'Database request error' });
    return;
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    // Foreign key constraint, missing field, invalid type, etc.
    console.error('Prisma validation error:', err.message);
    res.status(400).json({ error: 'Invalid database query' });
    return;
  }

  if (err instanceof Prisma.PrismaClientInitializationError) {
    // Unavailable DB, wrong DATABASE_URL, etc.
    console.error('Prisma init error:', err.message);
    res.status(503).json({ error: 'Database unavailable' });
    return;
  }

  // Multer errors handling
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      res.status(413).json({
        error: 'Fichier trop volumineux. Taille maximale : 5MB',
      });
      return;
    }
    res.status(400).json({ error: "Erreur lors de l'upload du fichier" });
    return;
  }

  if (err instanceof FileValidationError) {
    res.status(400).json({ error: err.message });
    return;
  }

  console.error(err);

  // Unexpected error --> error 500 INTERNAL SERVER ERROR
  res.status(500).json({ error: 'Unexpected server error' });
};
