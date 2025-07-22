import type { z } from 'zod';
import type { ChatbotRequestSchema, ChatbotResponseSchema } from './schema';

export type ChatbotRequest = z.infer<typeof ChatbotRequestSchema>;
export type ChatbotResponse = z.infer<typeof ChatbotResponseSchema>;
