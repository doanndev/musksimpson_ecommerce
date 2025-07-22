export const env = {
  APP_URL: process.env.NEXT_PUBLIC_APP_URL! ?? 'http://localhost:3000',
  API_URL: process.env.NEXT_PUBLIC_API_URL! ?? 'http://localhost:3001',
  API_WEBSOCKET: process.env.NEXT_PUBLIC_API_SOCKET! ?? 'http://localhost:3003',
  CHAT_API_URL: process.env.NEXT_PUBLIC_CHAT_API_URL! ?? 'http://localhost:8000/chat',
};
