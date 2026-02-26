import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Create a centralized Axios instance
// Base URL is set to http://192.168.1.72:8085/ as per requirements
const api: AxiosInstance = axios.create({
  // baseURL:'https://architectonically-unscrubbed-alfreda.ngrok-free.dev',

  baseURL:'http://192.168.1.22:8085/',
  headers: {
    // 'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
  timeout: 30000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    // Suppress console spam for expected errors that are handled in UI
    if (error.response && error.response.status === 500) {
       // Silent for 500s as they are handled by fallbacks
    } else {
       console.error('API Response Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

const apiService = {
  get: <T = any>(url: string, params?: any) => {
    return api.get<T>(url, { params });
  },
  getBlob: (url: string, params?: any) => {
    return api.get(url, { params, responseType: 'blob' });
  },
  post: <T = any>(url: string, data: any, config?: AxiosRequestConfig) => {
    return api.post<T>(url, data, config);
  },
  put: <T = any>(url: string, data: any, config?: AxiosRequestConfig) => {
    return api.put<T>(url, data, config);
  },
  delete: <T = any>(url: string) => {
    return api.delete<T>(url);
  },
};

export default apiService;