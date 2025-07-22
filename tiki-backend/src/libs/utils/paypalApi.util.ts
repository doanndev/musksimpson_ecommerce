// services/paypal.service.ts
// import fetch from 'node-fetch'; // Ensure @types/node-fetch is installed

// Define interfaces for PayPal data structures
interface CartItem {
  totalPrice: number;
  [key: string]: any; // Allow additional properties from the frontend
}

interface PurchaseUnit {
  amount: {
    currency_code: string;
    value: string;
  };
  reference_id: string;
}

interface OrderPayload {
  intent: string;
  purchase_units: PurchaseUnit[];
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
const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env;
const base = 'https://api-m.sandbox.paypal.com';

/**
 * Generate an OAuth 2.0 access token for authenticating with PayPal REST APIs.
 * @see https://developer.paypal.com/api/rest/authentication/
 */
const generateAccessToken = async (): Promise<string | undefined> => {
  try {
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      throw new Error('MISSING_API_CREDENTIALS');
    }
    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
    const response = await fetch(`${base}/v1/oauth2/token`, {
      method: 'POST',
      body: 'grant_type=client_credentials',
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });

    const data = (await response.json()) as AccessTokenResponse;
    return data.access_token;
  } catch (error) {
    console.error('Failed to generate Access Token:', error);
    return undefined;
  }
};

/**
 * Create an order to start the transaction.
 * @see https://developer.paypal.com/docs/api/orders/v2/#orders_create
 */
const createOrder = async (cart: CartItem[]): Promise<ApiResponse> => {
  console.log({ cart });
  console.log('Shopping cart information passed from the frontend createOrder() callback:', cart);

  const accessToken = await generateAccessToken();
  if (!accessToken) {
    throw new Error('Failed to obtain access token');
  }

  const url = `${base}/v2/checkout/orders`;

  const purchaseUnits = cart.map((c, index) => {
    const usd = (c.totalPrice / 23000).toFixed(2);
    return {
      amount: {
        currency_code: 'USD',
        value: usd,
      },
      reference_id: `item_${index + 1}`,
    } as PurchaseUnit;
  });

  const payload: OrderPayload = {
    intent: 'CAPTURE',
    purchase_units: purchaseUnits,
  };

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    method: 'POST',
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
};

/**
 * Capture payment for the created order to complete the transaction.
 * @see https://developer.paypal.com/docs/api/orders/v2/#orders_capture
 */
const captureOrder = async (orderID: string): Promise<ApiResponse> => {
  const accessToken = await generateAccessToken();
  if (!accessToken) {
    throw new Error('Failed to obtain access token');
  }

  const url = `${base}/v2/checkout/orders/${orderID}/capture`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return handleResponse(response);
};

/**
 * Handle the API response and return structured data.
 */
const handleResponse = async (response: Response): Promise<ApiResponse> => {
  try {
    const jsonResponse = await response.json();
    return {
      jsonResponse,
      httpStatusCode: response.status,
    };
  } catch (err) {
    const errorMessage = await response.text();
    throw new Error(errorMessage);
  }
};

export { createOrder, captureOrder };
