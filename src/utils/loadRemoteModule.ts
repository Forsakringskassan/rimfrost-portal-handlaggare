/* eslint-disable @typescript-eslint/no-explicit-any -- for promise */
/* eslint-disable import/no-unresolved -- Handled by Vite Module Federation plugin */
// Static imports - Vite/federation plugin rewrites these at build time
const remoteImporters: Record<string, () => Promise<any>> = {
  "rtf-manuell": () => import("remoteApp/VardAvHusdjur"),
  example: () => import("remoteExample/ExampleComponent"),
  // Add more as needed:
  // "exempel": () => import("remoteExample/ExampleComponent"),
};

export async function loadRemoteModule(remoteName: string) {
  const importer = remoteImporters[remoteName];

  if (!importer) {
    throw new Error(`No importer found for remote: ${remoteName}`);
  }

  const module = await importer();
  return module.default ?? module;
}
