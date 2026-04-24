import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from './api';

export interface AuthResponse {
  user: {
    id: number;
    nome: string;
    email: string;
  };
  accessToken: string;
  message: string;
}

const TOKEN_KEY = '@trilhaestudos:token';
const USER_KEY = '@trilhaestudos:user';

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

      // Salvar token e dados do usuário no AsyncStorage
      await AsyncStorage.setItem(TOKEN_KEY, response.data.accessToken);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(response.data.user));

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

  logout: async (): Promise<void> => {
    await AsyncStorage.removeItem(TOKEN_KEY);
    await AsyncStorage.removeItem(USER_KEY);
  },

  getToken: async (): Promise<string | null> => {
    return AsyncStorage.getItem(TOKEN_KEY);
  },

  getUser: async (): Promise<{ id: number; nome: string; email: string } | null> => {
    const userData = await AsyncStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  },

  isAuthenticated: async (): Promise<boolean> => {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    return !!token;
  },
};
