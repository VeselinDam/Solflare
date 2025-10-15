import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

const BASE_URL = "https://wallet-api.solflare.com";

export const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10_000,
  headers: { "Content-Type": "application/json", Accept: "application/json" },
  validateStatus: () => true,
});

api.interceptors.request.use((cfg) => {
  console.log(`[API] ${cfg.method?.toUpperCase()} ${cfg.baseURL}${cfg.url}`);
  return cfg;
});
api.interceptors.response.use((res) => {
  console.log(`[API] ${res.status} <- ${res.config.url}`);
  return res;
});

export async function request<T = any>(
  cfg: AxiosRequestConfig
): Promise<{ status: number; body: T; headers: Record<string, any> }> {
  const res = await api.request<T>(cfg);
  return { status: res.status, body: res.data as T, headers: res.headers as any };
}
