import { api } from './api';
import { Trilha } from '../types/models';

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    lastPage: number;
  };
}

export const TrilhasService = {
  getAll: async (page: number = 1, limit: number = 10): Promise<PaginatedResponse<Trilha>> => {
    try {
      const response = await api.get<PaginatedResponse<Trilha>>('/trilhas', {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar trilhas:", error);
      throw error; 
    }
  },

  getById: async (id: string): Promise<Trilha> => {
    try {
      const response = await api.get<Trilha>(`/trilhas/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar a trilha ${id}:`, error);
      throw error;
    }
  },

  create: async (data: { titulo: string; descricao?: string; icone?: string }): Promise<Trilha> => {
    try {
      const response = await api.post<Trilha>('/trilhas', data);
      return response.data;
    } catch (error) {
      console.error("Erro ao criar trilha:", error);
      throw error;
    }
  },

  update: async (id: number, data: { titulo?: string; descricao?: string; icone?: string }): Promise<Trilha> => {
    try {
      const response = await api.patch<Trilha>(`/trilhas/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar a trilha ${id}:`, error);
      throw error;
    }
  },

  delete: async (id: number): Promise<void> => {
    try {
      await api.delete(`/trilhas/${id}`);
    } catch (error) {
      console.error(`Erro ao deletar a trilha ${id}:`, error);
      throw error;
    }
  }
};