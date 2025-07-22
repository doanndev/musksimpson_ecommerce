import { PrismaClient } from 'prisma/generated/client';
import type { Conversation, Message } from '../libs/types/chatbot.types';
import { MESSAGES } from '~/libs/constants/messages.constant';
import UserRepository from './user.repository';

const prisma = new PrismaClient();

const ChatBotRepository = {
  findAllConversationsByUserId: async (userId: string): Promise<Conversation[]> => {
    const user = await UserRepository.findById(userId);

    if (!user) {
      throw new Error(MESSAGES.ACCOUNT_DOES_NOT_EXIST);
    }

    return prisma.conversations.findMany({
      where: { user_id: user.id },
      orderBy: { started_at: 'desc' },
      include: { messages: true },
    });
  },

  findMessagesByChatId: async (chatId: string): Promise<Message[]> => {
    return prisma.messages.findMany({
      where: { chat_id: chatId },
      orderBy: { created_at: 'asc' },
    });
  },

  updateConversationTitle: async (chatId: string, title: string): Promise<void> => {
    await prisma.conversations.update({
      where: { chat_id: chatId },
      data: { title },
    });
  },

  deleteConversation: async (chatId: string): Promise<void> => {
    await prisma.conversations.delete({
      where: { chat_id: chatId },
    });
  },

  findConversationByChatId: async (chatId: string): Promise<Conversation | null> => {
    return prisma.conversations.findUnique({
      where: { chat_id: chatId },
      include: { messages: true },
    });
  },

  createConversation: async (userId: string, chatId: string, title: string): Promise<Conversation> => {
    const user = await UserRepository.findById(userId);

    if (!user) {
      throw new Error(MESSAGES.ACCOUNT_DOES_NOT_EXIST);
    }

    return prisma.conversations.create({
      data: {
        chat_id: chatId,
        user_id: user.id,
        title,
      },
      include: { messages: true },
    });
  },

  createMessage: async (chatId: string, sender: 'user' | 'system', message: string): Promise<Message> => {
    return prisma.messages.create({
      data: {
        chat_id: chatId,
        sender,
        message,
      },
    });
  },
};

export default ChatBotRepository;
