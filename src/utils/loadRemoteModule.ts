/* eslint-disable @typescript-eslint/no-explicit-any -- for promise */
/* eslint-disable import/no-unresolved -- Handled by Vite Module Federation plugin */
const remoteImporters: Record<string, () => Promise<any>> = {
  "rtf-manuell": () => import("remoteApp/VardAvHusdjur"),
  "bekrafta-beslut": () => import("bekraftaBeslutApp/BekraftaBeslut"),
};

export async function loadRemoteModule(remoteName: string) {
  const importer = remoteImporters[remoteName];
  if (!importer) {
    throw new Error(`No importer found for remote: ${remoteName}`);
  }
  const module = await importer();
  return module.default ?? module;
}
