import type { Response as FetchResponse } from "node-fetch";
import fetch from "node-fetch";
import {
  OrderStatusEnum,
  PaymentStatusEnum,
  PermissionEnum,
} from "prisma/generated/client";
import { prisma } from "~/configs/database.config";
import { MESSAGES } from "~/libs/constants/messages.constant";
import {
  PaymentCreateInputSchema,
  PaymentResponseSchema,
  type PaymentResponseType,
} from "~/libs/schemas/payment.schema";
import { getRequestUser } from "~/libs/utils/requestContext.util";
import UserRepository from "~/repositories/user.repository";
import OrderRepository from "../repositories/order.repository";
import PaymentRepository from "../repositories/payment.repository";

// Define interfaces for PayPal data structures
interface CartItem {
  totalPrice: number;
  product_id: string;
  quantity: number;
  [key: string]: any;
}
interface Item {
  name: string;
  description?: string;
  sku?: string;
  unit_amount: {
    currency_code: string;
    value: string;
  };
  quantity: string;
  category?: string;
  image_url?: string;
  url?: string;
  upc?: {
    type: string;
    code: string;
  };
}

interface AmountBreakdown {
  item_total: {
    currency_code: string;
    value: string;
  };
  shipping?: {
    currency_code: string;
    value: string;
  };
}

interface PurchaseUnit {
  invoice_id?: string;
  amount: {
    currency_code: string;
    value: string;
    breakdown?: AmountBreakdown;
  };
  items?: Item[];
  reference_id?: string;
}

interface PaymentSource {
  paypal: {
    experience_context: {
      payment_method_preference: string;
      landing_page: string;
      shipping_preference: string;
      user_action: string;
      return_url: string;
      cancel_url: string;
    };
  };
}

interface OrderPayload {
  intent: string;
  purchase_units: PurchaseUnit[];
  payment_source: PaymentSource;
}

interface AccessTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  [key: string]: any;
}

interface ApiResponse {
  jsonResponse: any;
  httpStatusCode: number;
}

// Environment variables
const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, BASE_URL } = process.env;
const base = "https://api-m.sandbox.paypal.com";

/**
 * Generate an OAuth 2.0 access token for authenticating with PayPal REST APIs.
 */
const generateAccessToken = async (): Promise<string> => {
  if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
    throw new Error("MISSING_API_CREDENTIALS");
  }
  const auth = Buffer.from(
    `${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`
  ).toString("base64");
  const response = await fetch(`${base}/v1/oauth2/token`, {
    method: "POST",
    body: "grant_type=client_credentials",
    headers: {
      Authorization: `Basic ${auth}`,
    },
  });

  const data = (await response.json()) as AccessTokenResponse;
  if (!data.access_token) {
    throw new Error("Failed to generate access token");
  }

  console.log({ accessToken: data.access_token });
  return data.access_token;
};

const createOrder = async (cart: CartItem[]): Promise<ApiResponse> => {
  console.log("cart", cart);

  const accessToken = await generateAccessToken();
  const url = `${base}/v2/checkout/orders`;
  console.log("accessToken", accessToken);

  // Calculate total amount and item total in USD
  const itemTotal =
    cart.reduce((sum, item) => sum + item.totalPrice * item.quantity, 0) /
    23000; // Convert VND to USD
  const shippingCost = 10.0; // Example shipping cost in USD
  const totalAmount = (itemTotal + shippingCost).toFixed(2);

  // Map cart items to PayPal items format
  const items = cart.map((item, index) => ({
    name: item.name ?? "",
    description: item.description ?? "",
    sku: (item.stock ?? 0).toString(),
    unit_amount: {
      currency_code: "USD",
      value: (item.totalPrice / 23000).toFixed(2),
    },
    quantity: (item.quantity ?? 0).toString(),
    category: "PHYSICAL_GOODS",
    image_url: item.image_url ?? "",
    url: item.url ?? "",
  }));

  const purchaseUnit: PurchaseUnit = {
    invoice_id: `INV_${Date.now()}`, // Unique invoice ID
    amount: {
      currency_code: "USD",
      value: totalAmount,
      breakdown: {
        item_total: {
          currency_code: "USD",
          value: itemTotal.toFixed(2),
        },
        shipping: {
          currency_code: "USD",
          value: shippingCost.toFixed(2),
        },
      },
    },
    items,
    reference_id: `order_${Date.now()}`,
  };

  const payload: OrderPayload = {
    intent: "CAPTURE",
    purchase_units: [purchaseUnit],
    payment_source: {
      paypal: {
        experience_context: {
          payment_method_preference: "IMMEDIATE_PAYMENT_REQUIRED",
          landing_page: "LOGIN",
          shipping_preference: "GET_FROM_FILE",
          user_action: "PAY_NOW",
          return_url: `${BASE_URL}/api/v1/payments/paypal/capture`,
          cancel_url: `${BASE_URL}/api/v1/payments/paypal/cancel`,
        },
      },
    },
  };

  console.log({ payload });

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      "PayPal-Request-Id": `order_${Date.now()}`, // Unique request ID
    },
    method: "POST",
    body: JSON.stringify(payload),
  });

  console.log({ response });
  return handleResponse(response);
};

/**
 * Capture payment for the created order to complete the transaction.
 */
const captureOrder = async (orderID: string): Promise<ApiResponse> => {
  const accessToken = await generateAccessToken();
  const url = `${base}/v2/checkout/orders/${orderID}/capture`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return handleResponse(response);
};

/**
 * Handle the API response and return structured data.
 */
const handleResponse = async (
  response: FetchResponse
): Promise<ApiResponse> => {
  try {
    const jsonResponse = await response.json();
    return {
      jsonResponse,
      httpStatusCode: response.status,
    };
  } catch (err) {
    console.error(err);
    const errorMessage = await response.text();
    throw new Error(errorMessage);
  }
};

class PaymentService {
  private async checkPermission(
    userId: string,
    permission: PermissionEnum
  ): Promise<boolean> {
    const user = await prisma.users.findUnique({
      where: { uuid: userId, is_deleted: false },
      include: {
        role: {
          include: {
            role_permissions: {
              include: { permission: true },
            },
          },
        },
      },
    });

    if (!user) {
      throw new Error(MESSAGES.ACCOUNT_DOES_NOT_EXIST);
    }

    return user.role.role_permissions.some(
      (rp) => rp.permission.name === permission
    );
  }

  async createPayPalPayment(data: unknown): Promise<{
    payment: PaymentResponseType;
    approvalUrl: string;
  }> {
    const reqUser = getRequestUser();
    if (!reqUser?.userId) {
      throw new Error(MESSAGES.NOT_LOGGED_IN);
    }

    const parsedData = PaymentCreateInputSchema.parse(data);
    const user = await UserRepository.findById(reqUser.userId);
    if (!user) {
      throw new Error(MESSAGES.ACCOUNT_DOES_NOT_EXIST);
    }

    const hasPermission = await this.checkPermission(
      reqUser.userId,
      PermissionEnum.MANAGE_ORDERS
    );
    if (!hasPermission && parsedData.user_id !== reqUser.userId) {
      throw new Error(MESSAGES.FORBIDDEN);
    }

    console.log({ parsedData });

    // Validate cart items
    const cartItems = parsedData.items.map((item) => ({
      totalPrice: item.unit_price * item.quantity, // Convert to VND
      product_id: item.product_id,
      quantity: item.quantity,
      name: item.name,
      description: item.description,
      image_url: item.image_url,
      url: item.url,
      category: item?.category,
      sku: item.sku,
    }));

    if (!cartItems.length) {
      throw new Error("No items in cart");
    }

    // Create PayPal order
    const paypalResponse = await createOrder(cartItems);
    console.log("paypalResponse", paypalResponse);

    if (
      paypalResponse.httpStatusCode !== 201 &&
      (paypalResponse.httpStatusCode !== 200 ||
        paypalResponse.jsonResponse.status !== "PAYER_ACTION_REQUIRED")
    ) {
      console.error(
        "PayPal order creation failed:",
        paypalResponse.jsonResponse
      );
      throw new Error(MESSAGES.PAYMENT_FAILED);
    }

    console.log({ paypalResponse: paypalResponse.jsonResponse.links });

    // Create payment record with paypal_order_id
    const payment = await PaymentRepository.create({
      user_id: parsedData.user_id,
      amount: parsedData.amount,
      items: parsedData.items,
      transaction_id: paypalResponse.jsonResponse.id,
    });

    console.log({ payment });

    const Kernow = paypalResponse.jsonResponse.links.find(
      (link: any) => link.rel === "payer-action"
    )?.href;
    console.log({ kernow: Kernow });
    if (!Kernow) {
      throw new Error(MESSAGES.PAYMENT_FAILED);
    }

    return {
      payment: PaymentResponseSchema.parse({
        ...payment,
        transaction_id: paypalResponse.jsonResponse.id,
      }),
      approvalUrl: Kernow,
    };
  }

  async capturePayPalPayment(
    paypalOrderId: string
  ): Promise<PaymentResponseType> {
    const reqUser = getRequestUser();
    if (!reqUser?.userId) {
      throw new Error(MESSAGES.NOT_LOGGED_IN);
    }

    const payment = await PaymentRepository.findByPayPalOrderId(paypalOrderId);
    if (!payment) {
      throw new Error(MESSAGES.NOT_FOUND);
    }

    const user = await UserRepository.findById(reqUser.userId);
    if (!user) {
      throw new Error(MESSAGES.ACCOUNT_DOES_NOT_EXIST);
    }

    const hasPermission = await this.checkPermission(
      reqUser.userId,
      PermissionEnum.MANAGE_ORDERS
    );
    if (!hasPermission && payment.user_id !== user.id) {
      throw new Error(MESSAGES.FORBIDDEN);
    }

    const paypalResponse = await captureOrder(paypalOrderId);
    if (
      paypalResponse.httpStatusCode !== 201 ||
      paypalResponse.jsonResponse.status !== PaymentStatusEnum.COMPLETED
    ) {
      await PaymentRepository.updateStatus(
        payment.uuid,
        PaymentStatusEnum.FAILED
      );
      throw new Error(MESSAGES.PAYMENT_FAILED);
    }

    // Get user's default address
    const defaultAddress = await prisma.addresses.findFirst({
      where: {
        user_id: user.id,
        is_default: true,
        is_deleted: false,
      },
    });

    if (!defaultAddress) {
      throw new Error(MESSAGES.ADDRESS_NOT_FOUND);
    }

    // Parse JSON items
    const items = payment.items
      ? JSON.parse(JSON.stringify(payment.items))
      : [];
    if (!Array.isArray(items) || items.length === 0) {
      throw new Error("Invalid or empty items in payment");
    }

    // Create order after successful payment
    const order = await OrderRepository.create({
      user_id: user.uuid,
      address_id: defaultAddress.id,
      items: items.map((item: any) => ({
        product_id: item.product_id, // Convert to string for OrderRepository
        quantity: item.quantity,
      })),
    });

    // Update payment with order_id
    const updatedPayment = await PaymentRepository.updateStatus(
      payment.uuid,
      PaymentStatusEnum.COMPLETED,
      paypalResponse.jsonResponse.id,
      order.id
    );

    // Update order status to PROCESSING
    await OrderRepository.updateStatus(order.uuid, {
      status: OrderStatusEnum.PROCESSING,
    });

    // Delete cart items after successful payment
    await prisma.cart_items.deleteMany({
      where: {
        user_id: user.id,
        product: {
          uuid: { in: items.map((item: any) => item.product_id) },
        },
      },
    });

    return PaymentResponseSchema.parse(updatedPayment);
  }

  async findByPayPalOrderId(
    paypalOrderId: string
  ): Promise<PaymentResponseType | null> {
    const payment = await PaymentRepository.findByPayPalOrderId(paypalOrderId);
    return payment ? PaymentResponseSchema.parse(payment) : null;
  }

  async updatePaymentStatus(
    uuid: string,
    status: PaymentStatusEnum,
    transactionId?: string,
    orderId?: number
  ): Promise<PaymentResponseType> {
    const payment = await PaymentRepository.updateStatus(
      uuid,
      status,
      transactionId,
      orderId
    );
    return PaymentResponseSchema.parse(payment);
  }
}

export default new PaymentService();
