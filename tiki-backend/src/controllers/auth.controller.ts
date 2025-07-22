import type { Request, Response } from 'express';
import { MESSAGES } from '~/libs/constants/messages.constant';
import type { AuthRequest } from '~/libs/types/common.types';
import { response } from '~/libs/utils/response.util';
import AuthService from '~/services/auth.service';

class AuthController {
  async login(req: Request, res: Response) {
    try {
      const result = await AuthService.login(req.body);
      // if (result.twoFactorRequired) {
      //   response.success(
      //     res,
      //     { twoFactorRequired: true },
      //     MESSAGES.TWO_FACTOR_REQUIRED,
      //   )
      // }
      response.success(res, result, MESSAGES.LOGIN_SUCCESS);
    } catch (error: any) {
      response.badRequest(res, error);
    }
  }

  async socialLogin(req: Request, res: Response) {
    try {
      const result = await AuthService.socialLogin(req.body);
      response.success(res, result, MESSAGES.LOGIN_SUCCESS);
    } catch (error: any) {
      response.badRequest(res, error);
    }
  }

  async refreshToken(req: AuthRequest, res: Response) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        response.badRequest(res, new Error(MESSAGES.REFRESH_TOKEN_REQUIRED));
      }

      const { userId } = req.user!;

      const result = await AuthService.refreshToken(userId!, refreshToken);
      response.success(res, result, MESSAGES.TOKEN_REFRESHED);
    } catch (error: any) {
      if (error.message === MESSAGES.SESSION_EXPIRED || error.message === MESSAGES.ACCOUNT_DOES_NOT_EXIST) {
        response.unauthorized(res, error);
      }
      response.error(res, error);
    }
  }

  async register(req: Request, res: Response) {
    try {
      const result = await AuthService.register(req.body);
      response.success(res, result, MESSAGES.EMAIL_SENT);
    } catch (error: any) {
      response.badRequest(res, error);
    }
  }

  async logout(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { userId } = req.user!;
      const { refreshToken } = req.body;

      if (!refreshToken) {
        response.badRequest(res, new Error(MESSAGES.REFRESH_TOKEN_REQUIRED));
      }

      await AuthService.logout(userId!, refreshToken);
      res.clearCookie('token');
      response.success(res, {}, MESSAGES.LOGOUT_SUCCESS);
    } catch (error: any) {
      response.badRequest(res, error);
    }
  }

  async logoutAllDevices(req: AuthRequest, res: Response) {
    try {
      const { userId } = req.user!;
      await AuthService.logoutAllDevices(userId!);
      response.success(res, MESSAGES.LOGOUT_ALL_SUCCESS);
    } catch (error: any) {
      response.badRequest(res, error);
    }
  }

  async forgotPassword(req: Request, res: Response) {
    try {
      const result = await AuthService.forgotPassword(req.body);
      response.success(res, result, MESSAGES.EMAIL_SENT);
    } catch (error: any) {
      console.log({ error });
      response.badRequest(res, error);
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const { userId, token } = req.params;
      const result = await AuthService.resetPassword(userId, token, req.body);
      response.success(res, result, MESSAGES.PASSWORD_UPDATED);
    } catch (error: any) {
      response[error.message === MESSAGES.INVALID_TOKEN ? 'unauthorized' : 'notFound'](res, error);
    }
  }

  async verifyToken(req: Request, res: Response) {
    try {
      const { userId, token } = req.params;
      const result = await AuthService.verifyToken(userId, token);

      response.success(res, result, 'Token is valid');
    } catch (error: any) {
      response.unauthorized(res, error);
    }
  }

  async enableTwoFactor(req: Request, res: Response) {
    try {
      const { userId } = req.body;
      const result = await AuthService.enableTwoFactor(userId);
      response.success(res, result, MESSAGES.TWO_FACTOR_ENABLED);
    } catch (error: any) {
      response.notFound(res, error);
    }
  }

  async verifyTwoFactor(req: Request, res: Response) {
    try {
      const result = await AuthService.verifyTwoFactor(req.body);
      response.success(res, result, MESSAGES.TWO_FACTOR_VERIFIED);
    } catch (error: any) {
      response.badRequest(res, error);
    }
  }
}

export default new AuthController();
