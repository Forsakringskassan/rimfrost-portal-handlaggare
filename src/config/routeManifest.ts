interface RemoteConfig {
  name: string;
  devUrl: string;
  prodUrl: string;
  moduleName: string;
  description?: string;
}

interface RouteManifestData {
  routes: Record<string, RemoteConfig>;
  version: string;
  lastUpdated: string;
}

import { env } from "./env";

let manifestCache: RouteManifestData | null = null;

const isDev = import.meta.env.MODE === "development";

console.log(
  `RouteManifest: Running in ${isDev ? "development" : "production"} mode`,
);

export async function loadManifest(): Promise<RouteManifestData> {
  if (manifestCache) {
    return manifestCache;
  }

  try {
    const endpoint = env.bffUrl
      ? `${env.bffUrl}/api/route-manifest.json`
      : "/route-manifest.json";

    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new Error(`Failed to fetch route manifest: ${response.statusText}`);
    }

    manifestCache = await response.json();
    return manifestCache!;
  } catch (error) {
    console.error("Error loading route manifest:", error);
    throw error;
  }
}

export function getRemoteUrl(config: RemoteConfig): string {
  return isDev ? config.devUrl : config.prodUrl;
}

export async function getRemoteConfig(
  key: string,
): Promise<RemoteConfig | null> {
  const manifest = await loadManifest();
  return manifest.routes[key] || null;
}

export async function getAllRouteKeys(): Promise<string[]> {
  const manifest = await loadManifest();
  return Object.keys(manifest.routes);
}
