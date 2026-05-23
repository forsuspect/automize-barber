import axios from "axios";

/**
 * Cliente HTTP preparado para integração com API/Supabase.
 * Atualmente o app usa localStorage; substitua os métodos do storageService
 * por chamadas a esta instância quando o backend estiver disponível.
 */
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "/api",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("[API]", error.message);
    return Promise.reject(error);
  }
);
