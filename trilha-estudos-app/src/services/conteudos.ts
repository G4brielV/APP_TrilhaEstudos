import { api } from './api';
import { Conteudo } from '../types/models';

export const ConteudosService = {
  // Busca conteúdos relacionados a uma trilha específica
  getByTrilhaId: async (trilhaId: string): Promise<Conteudo[]> => {
    try {
      // Supondo que seu NestJS tenha uma rota assim, ou passe via query params
      const response = await api.get<Conteudo[]>(`/conteudos/trilha/${trilhaId}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar conteúdos da trilha ${trilhaId}:`, error);
      throw error;
    }
  },

  create: async (data: { titulo: string; url?: string; tipo?: string; trilhaId: number }): Promise<Conteudo> => {
    try {
      const response = await api.post<Conteudo>('/conteudos', data);
      return response.data;
    } catch (error) {
      console.error("Erro ao criar conteúdo:", error);
      throw error;
    }
  },

  update: async (id: number, data: { titulo?: string; url?: string; tipo?: string; trilhaId?: number }): Promise<Conteudo> => {
    try {
      const response = await api.patch<Conteudo>(`/conteudos/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar o conteúdo ${id}:`, error);
      throw error;
    }
  },

  toggleStatus: async (id: number, isCompleted: boolean): Promise<Conteudo> => {
    try {
      const response = await api.patch<Conteudo>(`/conteudos/${id}/toggle`, { isCompleted });
      return response.data;
    } catch (error) {
      console.error(`Erro ao alterar status do conteúdo ${id}:`, error);
      throw error;
    }
  },

  delete: async (id: number): Promise<void> => {
    try {
      await api.delete(`/conteudos/${id}`);
    } catch (error) {
      console.error(`Erro ao deletar o conteúdo ${id}:`, error);
      throw error;
    }
  }
};