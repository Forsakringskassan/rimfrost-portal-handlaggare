import type { Component } from "vue";
import { createInstance, getInstance } from "@module-federation/runtime";
import { getRemoteConfig } from "../config/remoteRegistry";

function getMFInstance() {
  // In prod the plugin bootstrap has already called init(), so getInstance()
  // returns the fully-configured instance. In dev mode the bootstrap runs
  // asynchronously and may not have fired yet, so we create a minimal instance.
  return (
    getInstance() ?? createInstance({ name: "app", remotes: [], shared: {} })
  );
}

export async function loadRemoteModule(routeKey: string): Promise<Component> {
  const mf = getMFInstance();
  const config = await getRemoteConfig(routeKey);

  mf.registerRemotes([{ name: config.scope, entry: config.entryUrl }], {
    force: true,
  });

  const module = await mf.loadRemote<{ default: Component }>(
    `${config.scope}/${config.module}`,
  );

  if (!module) {
    throw new Error(`Failed to load remote module: ${routeKey}`);
  }

  return module.default ?? (module as unknown as Component);
}
