import { Router } from 'express';
import { PermissionEnum } from 'prisma/generated/client';
import PaymentController from '~/controllers/payment.controller';
import { checkLogin } from '~/middleware/checkLogin.middleware';
import { checkPermission } from '~/middleware/checkPermission.middleware';

const paymentRouter = Router();

paymentRouter.post('/paypal', checkLogin, PaymentController.createPayPalPayment);

paymentRouter.get('/paypal/capture/:orderId', checkLogin, PaymentController.capturePayPalPayment);

paymentRouter.get('/paypal/cancel', checkLogin, PaymentController.cancelPayPalPayment);

paymentRouter.post(
  '/admin/paypal',
  checkLogin,
  checkPermission(PermissionEnum.MANAGE_ORDERS),
  PaymentController.createPayPalPayment
);

paymentRouter.get(
  '/admin/paypal/capture',
  checkLogin,
  checkPermission(PermissionEnum.MANAGE_ORDERS),
  PaymentController.capturePayPalPayment
);

export default paymentRouter;
