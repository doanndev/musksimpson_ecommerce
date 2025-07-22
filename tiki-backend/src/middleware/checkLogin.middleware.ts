import type { NextFunction, Response } from 'express';
import { MESSAGES } from '~/libs/constants/messages.constant';
import type { AuthRequest } from '~/libs/types/common.types';
import { runWithRequestContext, setRequestUser } from '~/libs/utils/requestContext.util';
import { HttpError } from './errorHandler.middleware';
import { verifyTokenMiddleware } from './verifyToken.middleware';

const checkLogin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    verifyTokenMiddleware(req, res, () => {
      if (!req.user || !req.user.userId) {
        return next(new HttpError(MESSAGES.NOT_LOGGED_IN, 401));
      }

      runWithRequestContext(() => {
        setRequestUser(req.user);
        next();
      });
    });
  } catch (error) {
    next(error);
  }
};
export { checkLogin };
