import apiService from './apiService';

export interface RegisterRequest {
  titleType: string;
  dob: string; // Format: YYYY-MM-DD
  mobileNo: string;
  name: string;
  email: string;
  password: string;
  gender: string;
  role: string;
  address: string;
}

export interface RegisterResponse {
  message: string;
  citizenId?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  statusCode: number;
  message: string;
  data: {
    id: number;
    mobileNo: string;
    name: string;
    email: string;
    gender: string;
    role: string;
    address: string;
    registeredAt: string;
  };
  token?: string;
}

const authService = {
  register: async (payload: RegisterRequest): Promise<RegisterResponse> => {
    try {
      const response = await apiService.post<RegisterResponse>('/api/citizens/register', payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  login: async (payload: LoginRequest): Promise<LoginResponse> => {
    try {
      const response = await apiService.post<LoginResponse>('/api/citizens/login', payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default authService;
