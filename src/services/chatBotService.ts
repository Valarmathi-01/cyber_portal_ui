import apiService from './apiService';

export interface ChatRequest {
  message: string;
}

export interface ChatResponse {
  statusCode: number;
  message: string;
  data: string;
}

const chatBotService = {
  /**
   * Send a message to the AI Chatbot
   * Endpoint: POST /api/ai/message
   */
  chat: async (message: string): Promise<ChatResponse> => {
    try {
      const response = await apiService.post<ChatResponse>('/api/ai/message', { message });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default chatBotService;
