import { api } from './api';
import { Trilha } from '../types/models';

export const TrilhasService = {
  getAll: async (): Promise<Trilha[]> => {
    try {
      const response = await api.get<{ data: Trilha[], meta: any }>('/trilhas');
      return response.data.data;
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
  
  delete: async (id: number): Promise<void> => {
    try {
      await api.delete(`/trilhas/${id}`);
    } catch (error) {
      console.error(`Erro ao deletar a trilha ${id}:`, error);
      throw error;
    }
  }
};