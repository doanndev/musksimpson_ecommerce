import type { Request, Response } from 'express';
import { MESSAGES } from '~/libs/constants/messages.constant';
import { response } from '~/libs/utils/response.util';
import PaymentService from '~/services/payment.service';

class PaymentController {
  async createPayPalPayment(req: Request, res: Response): Promise<void> {
    try {
      const { payment, approvalUrl } = await PaymentService.createPayPalPayment(req.body);
      response.success(res, { payment, approvalUrl }, MESSAGES.PAYMENT_CREATED);
    } catch (error: any) {
      console.log({ error });
      console.error('Create PayPal Payment Error:', error.message);
      response.badRequest(res, null, error.message || MESSAGES.PAYMENT_FAILED);
    }
  }

  async capturePayPalPayment(req: Request, res: Response): Promise<void> {
    try {
      const orderId = req.params.orderId as string;
      if (!orderId) {
        response.badRequest(res, MESSAGES.ORDER_ID_REQUIRED);
        return;
      }
      const payment = await PaymentService.capturePayPalPayment(orderId);
      response.success(res, payment, MESSAGES.PAYMENT_COMPLETED);
    } catch (error: any) {
      console.error('Capture PayPal Payment Error:', error.message);
      response.badRequest(res, error.message || MESSAGES.PAYMENT_FAILED);
    }
  }

  async cancelPayPalPayment(req: Request, res: Response): Promise<void> {
    try {
      // Redirect or handle cancel logic
      response.success(res, null, MESSAGES.PAYMENT_CANCELLED);
    } catch (error: any) {
      console.error('Cancel PayPal Payment Error:', error.message);
      response.badRequest(res, error.message || MESSAGES.PAYMENT_FAILED);
    }
  }
}

export default new PaymentController();
