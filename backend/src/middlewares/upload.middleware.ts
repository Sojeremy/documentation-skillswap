// ============================================================================
// MULTER MIDDLEWARE - Avatar upload configuration
// ============================================================================

import multer from 'multer';
import path from 'path';
import type { Request } from 'express';
import { FileValidationError } from '../lib/error.ts';

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Store avatars in public/avatars directory
    cb(null, 'public/avatars');
  },
  filename: (req, file, cb) => {
    // Generate unique filename: userId-timestamp.extension
    const userId = (req as Request & { userId: number }).userId;
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `avatar-${userId}-${timestamp}${ext}`);
  },
});

// File filter - only allow images
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new FileValidationError(
        'Format de fichier invalide. Seuls les formats JPEG, JPG et PNG sont acceptés.',
      ),
    );
  }
};

// Configure multer
export const uploadAvatar = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
});
