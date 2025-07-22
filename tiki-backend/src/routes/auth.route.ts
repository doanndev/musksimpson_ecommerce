import { Router } from 'express';
import { verifyTokenMiddleware } from '~/middleware/verifyToken.middleware';
import AuthController from '~/controllers/auth.controller';
import { decodeTokenMiddleware } from '~/middleware/decodeToken.middleware';

const authRouter = Router();

authRouter.post(
  '/login',
  //  loginRateLimiter,
  AuthController.login
);
authRouter.post(
  '/social-login',
  //  loginRateLimiter,
  AuthController.socialLogin
);
authRouter.post('/register', AuthController.register);
authRouter.post('/logout', verifyTokenMiddleware, AuthController.logout);
authRouter.post('/logout-all', verifyTokenMiddleware, AuthController.logoutAllDevices);
authRouter.post('/refresh-token', decodeTokenMiddleware, AuthController.refreshToken);
authRouter.post(
  '/forgot-password',
  // forgotPasswordRateLimiter,
  AuthController.forgotPassword
);
authRouter.post('/reset-password/:userId/:token', AuthController.resetPassword);
authRouter.get('/verify-token/:userId/:token', AuthController.verifyToken);

authRouter.post('/enable-2fa', verifyTokenMiddleware, AuthController.enableTwoFactor);
authRouter.post('/verify-2fa', AuthController.verifyTwoFactor);

export default authRouter;
