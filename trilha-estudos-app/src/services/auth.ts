import { api } from './api';
import { Usuario } from '../types/models';

export interface AuthResponse {
  user: {
    id: number;
    nome: string;
    email: string;
  };
  message: string;
}

export const AuthService = {
  register: async (data: { nome: string; email: string; senha: string }): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/auth/register', data);
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(
          Array.isArray(error.response.data.message)
            ? error.response.data.message[0]
            : error.response.data.message
        );
      }
      console.error("Erro ao registrar:", error);
      throw error;
    }
  },

  login: async (data: { email: string; senha: string }): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/auth/login', data);
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(
          Array.isArray(error.response.data.message)
            ? error.response.data.message[0]
            : error.response.data.message
        );
      }
      console.error("Erro ao fazer login:", error);
      throw error;
    }
  },
};
