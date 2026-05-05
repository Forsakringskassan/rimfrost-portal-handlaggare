/* eslint-disable import/no-unresolved -- Handled by Vite Module Federation plugin */

const remoteImporters: Record<string, () => Promise<{ default: unknown }>> = {
  "rtf-manuell": () => import("remoteApp/VardAvHusdjur"),
  bekraftabeslut: () => import("bekraftaBeslutApp/BekraftaBeslut"),
};

export async function loadRemoteModule(remoteName: string) {
  const importer = remoteImporters[remoteName];

  if (!importer) {
    throw new Error(`No importer found for remote: ${remoteName}`);
  }

  const module = await importer();
  return module.default ?? module;
}
