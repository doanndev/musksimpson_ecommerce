import type { NextFunction, Response } from 'express';
import { MESSAGES } from '~/libs/constants/messages.constant';
import type { AuthRequest } from '~/libs/types/common.types';
import { verifyToken } from '~/libs/utils/jwt.util';
import { HttpError } from './errorHandler.middleware';

const verifyTokenMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = { userId: null, roleId: null };
    const error = new HttpError('Unauthorized!!', 401);
    return next(error);
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    req.user = decoded;
    return next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      const error = new HttpError(MESSAGES.TOKEN_EXPIRED, 401);
      return next(error);
    }
    return next(new HttpError(MESSAGES.INVALID_TOKEN, 401));
  }
};

export { verifyTokenMiddleware };
