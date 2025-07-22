import instance, { getSuccessResponse } from '../axios';
import type { ChatbotRequest, ChatbotResponse } from './type';

export const interactWithChatbotRequest = async (data: ChatbotRequest) => {
  const response = await instance.post('/chatbot', data);
  return getSuccessResponse<ChatbotResponse>(response);
};
