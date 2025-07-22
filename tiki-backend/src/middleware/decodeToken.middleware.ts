import type { NextFunction, Response } from 'express';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import { MESSAGES } from '~/libs/constants/messages.constant';
import type { AuthRequest } from '~/libs/types/common.types';
import { HttpError } from './errorHandler.middleware';

const decodeTokenMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = { userId: null, roleId: null };
    const error = new HttpError('Missing authorization header', 401);
    return next(error);
  }

  try {
    const token = authHeader.split(' ')[1];

    const decoded = jwt.decode(token) as JwtPayload | null;
    if (!decoded || !decoded.userId) {
      throw new Error('Invalid token payload');
    }
    req.user = {
      userId: decoded.userId,
      roleId: decoded.roleId || null,
    };
    return next();
  } catch (error: any) {
    return next(new HttpError(MESSAGES.INVALID_TOKEN, 401));
  }
};

export { decodeTokenMiddleware };
