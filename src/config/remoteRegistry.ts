import { env } from "./env";

interface RemoteConfig {
  scope: string;
  module: string;
  devEntry: string;
  prodEntry: string;
}

export class ManifestLoadError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = "ManifestLoadError";
  }
}

let manifestPromise: Promise<Record<string, RemoteConfig>> | null = null;

async function loadManifest() {
  if (!manifestPromise) {
    const url = env.bffUrl
      ? `${env.bffUrl}/api/route-manifest`
      : "/route-manifest.json";

    manifestPromise = fetch(url)
      .then(async (response) => {
        if (!response.ok) {
          throw new ManifestLoadError(
            `Failed to fetch route manifest: ${response.statusText}`,
          );
        }
        try {
          return await response.json();
        } catch {
          throw new ManifestLoadError(`Failed to parse route manifest as JSON`);
        }
      })
      .then((json) => json.routes)
      .catch((err) => {
        console.error("Error loading route manifest:", err);
        manifestPromise = null;
        throw err;
      });
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
