import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ⚠️ ATENÇÃO: Substitua pelo endereço IPv4 da sua máquina na rede local.
// No Windows: digite 'ipconfig' no CMD.
// No Mac/Linux: digite 'ifconfig' no terminal.
// Se usar o Emulador do Android Studio na mesma máquina, você pode usar 'http://10.0.2.2:3000'
const API_URL = 'http://10.0.2.2:3000'; 

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 segundos de limite para não deixar o app travado em caso de erro
});

// Interceptor para injetar o JWT nas requisições
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('@trilhaestudos:token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratar 401 (token expirado/inválido)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Limpar token inválido do storage
      await AsyncStorage.removeItem('@trilhaestudos:token');
      await AsyncStorage.removeItem('@trilhaestudos:user');
    }
    return Promise.reject(error);
  }
);