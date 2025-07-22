import instance, { getSuccessResponse } from '../axios';
import type { PaymentCreateInput, PaymentResponse } from './type';

export const createPaypalPaymentRequest = async (data: PaymentCreateInput) => {
  const response = await instance.post('/payments/paypal', data);
  return getSuccessResponse<{ payment: PaymentResponse; approvalUrl: string }>(response);
};

export const capturePaypalPaymentRequest = async (paypalOrderId: string) => {
  const response = await instance.get(`/payments/paypal/capture/${paypalOrderId}`);
  return getSuccessResponse<PaymentResponse>(response);
};

export const cancelPaypalPaymentRequest = async () => {
  const response = await instance.get('/payments/paypal/cancel');
  return getSuccessResponse<null>(response);
};

export const createAdminPaypalPaymentRequest = async (data: PaymentCreateInput) => {
  const response = await instance.post('/payments/admin/paypal', data);
  return getSuccessResponse<{ payment: PaymentResponse; approvalUrl: string }>(response);
};

export const captureAdminPaypalPaymentRequest = async (paypalOrderId: string) => {
  const response = await instance.get(`/payments/admin/paypal/capture/${paypalOrderId}`);
  return getSuccessResponse<PaymentResponse>(response);
};
