import type { Request, Response, NextFunction } from 'express';
import { ref, uploadBytes, getDownloadURL, type StorageReference } from 'firebase/storage';
import { HttpError } from './errorHandler.middleware';
import sharp from 'sharp';
import uploadMulter from '~/configs/multer.config';
import storageFirebase from '~/configs/firebase.config';

// Extend Request to include file and url properties
interface FileRequest extends Request {
  file: Express.Multer.File;
  url: string;
}

const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/svg+xml'];
const maxImageSize = 1024 * 1024 * 1; // 1MB

const uploadFile = async (req: FileRequest, res: Response, next: NextFunction): Promise<void> => {
  uploadMulter.single('avatar')(req, res, async (err: unknown) => {
    if (err) {
      return next(err);
    }

    if (!req.file) {
      return next(new HttpError('No file uploaded', 400));
    }

    const { mimetype, originalname, buffer } = req.file;

    if (!allowedImageTypes.includes(mimetype)) {
      return next(new HttpError('Invalid image type. Only JPEG, PNG, GIF, and SVG are allowed', 400));
    }

    if (buffer.length > maxImageSize) {
      return next(new HttpError('Image size exceeds the allowed limit', 400));
    }

    // Resize image using Sharp
    const resizedBuffer = await sharp(buffer)
      .resize({ width: 64, height: 64, fit: 'cover', position: 'center' })
      .toBuffer();

    const metadata = {
      contentType: mimetype,
      name: originalname,
    };

    const fileName = originalname;
    const date = new Date().toISOString().split('T')[0];
    const time = new Date().getTime();

    const storageRef: StorageReference = ref(storageFirebase, `images/${date}-${time}-${fileName}`);

    try {
      await uploadBytes(storageRef, resizedBuffer, metadata);
      const url = await getDownloadURL(storageRef);

      req.url = url;

      next();
    } catch (error) {
      res.status(400).json({
        error: (error as Error).message,
      });
    }
  });
};

export default uploadFile;
