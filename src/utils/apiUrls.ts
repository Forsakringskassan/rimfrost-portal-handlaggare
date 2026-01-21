export function getUppgifterApiUrl(path: string): string {
  const isDev = import.meta.env.DEV;
  if (isDev) {
    return `/uppgifter${path}`;
  }
  const baseUrl = import.meta.env.VITE_UPPGIFTER_API_URL;
  return `${baseUrl}${path}`;
}

export function getRegelApiUrl(path: string): string {
  const isDev = import.meta.env.DEV;
  if (isDev) {
    return `/regel${path}`;
  }
  const baseUrl = import.meta.env.VITE_REGEL_API_URL;
  return `${baseUrl}${path}`;
}

export function getKundbehovApiUrl(path: string): string {
  const isDev = import.meta.env.DEV;
  if (isDev) {
    // Add proxy if needed in vite.config.ts
    const baseUrl = import.meta.env.VITE_KUNDBEHOV_API_URL;
    return `${baseUrl}${path}`;
  }
  const baseUrl = import.meta.env.VITE_KUNDBEHOV_API_URL;
  return `${baseUrl}${path}`;
}

export function getApiBaseUrl(): string {
  return import.meta.env.VITE_API_BASE_URL;
}
