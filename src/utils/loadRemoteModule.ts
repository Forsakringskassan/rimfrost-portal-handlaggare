/* eslint-disable @typescript-eslint/no-explicit-any -- for promise */
/* eslint-disable import/no-unresolved -- Handled by Vite Module Federation plugin */

// Static imports - Vite/federation plugin rewrites these at build time
const remoteImporters: Record<string, () => Promise<any>> = {
  "rtf-manuell": () => import("remoteApp/VardAvHusdjur"),
  remoteExample: () => import("remoteExample/ExampleComponent"),
  // Add more as needed:
  // "exempel": () => import("remoteExample/ExampleComponent"),
};

export async function loadRemoteModule(routeKey: string) {
  const normalizedKey = routeKey.replace(/^\/?(regel\/)?/, ""); // normalize "regel/rtf-manuell" → "rtf-manuell"
  const importer = remoteImporters[normalizedKey];

  if (!importer) {
    throw new Error(`No remote module registered for route key: "${routeKey}"`);
  }

  const module = await importer();
  return module.default ?? module;
}
