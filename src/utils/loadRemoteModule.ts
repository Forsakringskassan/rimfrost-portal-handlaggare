/* eslint-disable import/no-unresolved -- with module federation */
/**
 * Dynamically load a remote module using a route key
 * Works with originjs/vite-plugin-federation
 */

// const isDev = import.meta.env.MODE === "development";

export async function loadRemoteModule(
  path: string,
  kundbehovsflodeId: string,
  moduleName: string,
) {
  try {
    console.log(`Loading remote module for path: ${path}`);
    console.log(`KundbehovsflodeId: ${kundbehovsflodeId}`);
    console.log(`ModuleName: ${moduleName}`);

    // Use the pre-configured remote from vite.config
    const module = await import("remoteApp/VardAvHusdjur");

    return module.default || module;
  } catch (error) {
    console.error(`Error loading remote module for path: ${path}`, error);
    throw error;
  }
}
