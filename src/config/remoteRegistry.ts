interface RemoteConfig {
  scope: string;
  module: string;
  devEntry: string;
  prodEntry: string;
}

let manifestPromise: Promise<Record<string, RemoteConfig>> | null = null;

async function loadManifest() {
  if (!manifestPromise) {
    manifestPromise = fetch("/route-manifest.json")
      .then((response) => response.json())
      .then((json) => json.routes);
  }

  return manifestPromise;
}

export async function getRemoteConfig(routeKey: string) {
  const manifest = await loadManifest();
  const normalizedKey = routeKey.replace(/^\//, ""); // Remove leading slash if present
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
