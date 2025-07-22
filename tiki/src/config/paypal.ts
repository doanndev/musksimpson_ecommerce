export const initialOptions = {
  clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? '',
  currency: 'USD',
  intent: 'capture',
};
