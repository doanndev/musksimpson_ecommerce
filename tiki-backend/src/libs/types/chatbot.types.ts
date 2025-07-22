import type { conversations, messages } from 'prisma/generated/client';

export interface Conversation extends conversations {
  messages: Message[];
}

export interface Message extends messages {}

export interface ChatBotResponse {
  answer: string;
}
