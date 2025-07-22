import { Client } from '@elastic/elasticsearch';
import type { Response } from 'express';
import type { AuthRequest } from '~/libs/types/common.types';
import { runLLM } from '~/libs/utils/chatbot';
import { identifyIntentAndEntities } from '~/libs/utils/nlp';
import { HttpError } from '../middleware/errorHandler.middleware';
import ChatBotRepository from '../repositories/chatbot.repository';

const client = new Client({ node: 'http://localhost:9200' });

const ChatBotController = {
  getAllConversations: async (req: AuthRequest, res: Response): Promise<void> => {
    if (!req?.user?.userId) {
      throw new HttpError('Unauthorized!!', 401);
    }
    try {
      const conversations = await ChatBotRepository.findAllConversationsByUserId(req.user.userId);
      res.status(200).json({
        message: 'success',
        data: conversations,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: 'error',
        data: error,
      });
    }
  },

  getAllMessages: async (req: AuthRequest, res: Response): Promise<void> => {
    const { chatId } = req.params;
    try {
      const messages = await ChatBotRepository.findMessagesByChatId(chatId);
      res.status(200).json({
        message: 'success',
        data: messages,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: 'error',
        data: error,
      });
    }
  },

  handleEditConversation: async (req: AuthRequest, res: Response): Promise<void> => {
    const { chatId } = req.params;
    const { title } = req.body as { title: string };
    try {
      await ChatBotRepository.updateConversationTitle(chatId, title);
      res.status(200).json({
        message: 'success',
        data: null,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: 'error',
        data: error,
      });
    }
  },

  handleDeleteConversation: async (req: AuthRequest, res: Response): Promise<void> => {
    const { chatId } = req.params;
    try {
      await ChatBotRepository.deleteConversation(chatId);
      res.status(200).json({ message: 'success', data: null });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: 'error',
        data: error,
      });
    }
  },

  handleSendMessage: async (req: AuthRequest, res: Response): Promise<void> => {
    const { question, conversationId, chatTitle } = req.body as {
      question: string;
      conversationId: string;
      chatTitle: string;
    };

    if (!req?.user?.userId) {
      throw new HttpError('Unauthorized!!', 401);
    }

    const userId = req?.user.userId;
    const { intent, products } = await identifyIntentAndEntities(question);

    try {
      const existingConversation = await ChatBotRepository.findConversationByChatId(conversationId);
      if (!existingConversation) {
        await ChatBotRepository.createConversation(userId, conversationId, chatTitle);
      }

      await ChatBotRepository.createMessage(conversationId, 'user', question);

      if (intent === 'price_query' || intent === 'compare_products') {
        const esQuery = {
          index: 'products',
          body: {
            query: {
              bool: {
                should: products.map((product: string) => ({
                  match: {
                    product_name: product,
                  },
                })),
              },
            },
            _source: ['product_name', 'price_new', 'description'],
          },
        };

        const body = await client.search(esQuery);

        if (body.hits.hits.length === 0) {
          const answer = 'Có vẻ như đã xảy ra lỗi trong quá trình xử lý câu hỏi của bạn. Vui lòng thử lại.';
          await ChatBotRepository.createMessage(conversationId, 'system', answer);
          res.json({ answer });
          return;
        }

        const productData = body.hits.hits
          .map((hit: any) => `${hit._source.product_name}: ${hit._source.price_new} VNĐ - ${hit._source.description}`)
          .join('\n');

        const answer = await runLLM(question, productData);
        await ChatBotRepository.createMessage(conversationId, 'system', answer);
        res.json({ answer });
        return;
      }

      const answer = await runLLM(question, '');
      await ChatBotRepository.createMessage(conversationId, 'system', answer);
      res.json({ answer });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        answer: 'Đã xảy ra lỗi khi xử lý câu hỏi của bạn.',
      });
    }
  },
};

export default ChatBotController;
