import { z } from 'zod';

export const ChatbotRequestSchema = z.object({
  message: z.string().min(1, { message: 'Message is required' }),
});

export const ChatbotResponseSchema = z.object({
  response: z.string(),
});
