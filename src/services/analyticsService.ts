import apiService from './apiService';

export interface StatsByStatusResponse {
    statusCode: number;
    message: string;
    data: Record<string, number>;
}

export interface StatsByStateResponse {
    statusCode: number;
    message: string;
    data: Record<string, number>;
}

const analyticsService = {
  getByStatus: async (): Promise<StatsByStatusResponse> => {
    try {
      const response = await apiService.get<StatsByStatusResponse>('/api/dashboard/by-status');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getByState: async (): Promise<StatsByStateResponse> => {
    try {
      const response = await apiService.get<StatsByStateResponse>('/api/dashboard/by-state');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default analyticsService;
