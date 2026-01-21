import { env } from "../config/env";

export function getUppgifterApiUrl(path: string): string {
  const isDev = import.meta.env.DEV;
  if (isDev) {
    return `/uppgifter${path}`;
  }
  const baseUrl = env.uppgifterApiUrl;
  return `${baseUrl}${path}`;
}

export function getRegelApiUrl(path: string): string {
  const isDev = import.meta.env.DEV;
  if (isDev) {
    return `/regel${path}`;
  }
  const baseUrl = env.regelApiUrl;
  return `${baseUrl}${path}`;
}

export function getKundbehovApiUrl(path: string): string {
  const isDev = import.meta.env.DEV;
  if (isDev) {
    // Add proxy if needed in vite.config.ts
    const baseUrl = env.kundbehovApiUrl;
    return `${baseUrl}${path}`;
  }
  const baseUrl = env.kundbehovApiUrl;
  return `${baseUrl}${path}`;
}

export function getApiBaseUrl(): string {
  return env.apiBaseUrl;
}
