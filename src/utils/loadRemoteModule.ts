/**
 * Dynamically load a remote module from a given URL
 * Works with originjs/vite-plugin-federation
 * @param remoteUrl - The URL of the remote module
 * @param moduleName - The name of the module to load
 */

export async function loadRemoteModule(remoteUrl: string, moduleName: string) {
  try {
    const url = new URL(remoteUrl);
    const remoteEntryUrl = `${url.origin}/assets/remoteEntry.js`;

    const remoteContainer = await import(/* @vite-ignore */ remoteEntryUrl);

    const moduleFactory = await remoteContainer.get(moduleName);
    const module = moduleFactory();

    return module.default || module;
  } catch (error) {
    console.error(
      `Error loading remote module ${moduleName} from ${remoteUrl}:`,
      error,
    );
    throw error;
  }
}
