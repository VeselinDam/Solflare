import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { v4 as uuidv4 } from 'uuid';

const BASE_URL = "https://wallet-api.solflare.com";

export const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10_000,
  headers: { "Content-Type": "application/json", Accept: "application/json" },
  validateStatus: () => true,
});

export function setToken() {
  const authUuid = uuidv4();
  api.defaults.headers.common["Authorization"] = `Bearer ${authUuid}`;
  return authUuid;
}

export async function request<T = any>(config: AxiosRequestConfig
): Promise<{ status: number; body: T; headers: Record<string, any> }> {
  const res = await api.request<T>(config);
  return { status: res.status, body: res.data as T, headers: res.headers as any };
}

export const get = <T = any>(url: string, config?: AxiosRequestConfig) =>
  request<T>({ ...config, method: "get", url });
