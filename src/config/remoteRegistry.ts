import { env } from "./env";

interface RemoteConfig {
  scope: string;
  module: string;
  devEntry: string;
  prodEntry: string;
}

let manifestPromise: Promise<Record<string, RemoteConfig>> | null = null;

async function loadManifest() {
  if (!manifestPromise) {
    const url = env.bffUrl
      ? `${env.bffUrl}/api/route-manifest`
      : "/route-manifest.json";

    manifestPromise = fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Failed to fetch route manifest: ${response.statusText}`,
          );
        }
        return response.json();
      })
      .then((json) => json.routes);
  }
  return manifestPromise;
}

export async function getRemoteConfig(routeKey: string) {
  const manifest = await loadManifest();
  const normalizedKey = routeKey.replace(/^\//, "");
  const config = manifest[normalizedKey];

  if (!config) {
    throw new Error(`No remote config found for route key: ${routeKey}`);
  }

  const entryUrl =
    import.meta.env.PROD && config.prodEntry
      ? config.prodEntry
      : config.devEntry;

  return { ...config, entryUrl };
}
