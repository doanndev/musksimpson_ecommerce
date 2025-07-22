import { Router } from 'express';
import chatbotController from '../controllers/chatbot.controller';
import { verifyTokenMiddleware } from '../middleware/verifyToken.middleware';

const chatBotRouter: Router = Router();

chatBotRouter.post('/', verifyTokenMiddleware, chatbotController.handleSendMessage);
chatBotRouter.get('/conversations', verifyTokenMiddleware, chatbotController.getAllConversations);
chatBotRouter.get('/messages/:chatId', verifyTokenMiddleware, chatbotController.getAllMessages);
chatBotRouter.put('/:chatId', verifyTokenMiddleware, chatbotController.handleEditConversation);
chatBotRouter.delete('/:chatId', verifyTokenMiddleware, chatbotController.handleDeleteConversation);

export default chatBotRouter;
