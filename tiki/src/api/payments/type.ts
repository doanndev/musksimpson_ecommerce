import type { z } from 'zod';
import type { PaymentCreateInputSchema, PaymentResponseSchema } from './schema';

export type PaymentCreateInput = z.infer<typeof PaymentCreateInputSchema>;
export type PaymentResponse = z.infer<typeof PaymentResponseSchema>;

export interface CartItem {
  totalPrice: number;
  product_id: number;
  quantity: number;
  shop_name: string;
  fee: number;
  [key: string]: any;
}

export interface PurchaseUnit {
  amount: {
    currency_code: string;
    value: string;
  };
  reference_id: string;
}

export interface OrderPayload {
  intent: string;
  purchase_units: PurchaseUnit[];
  application_context?: {
    return_url: string;
    cancel_url: string;
  };
}

export interface AccessTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  [key: string]: any;
}

export interface ApiResponse {
  jsonResponse: any;
  httpStatusCode: number;
}
