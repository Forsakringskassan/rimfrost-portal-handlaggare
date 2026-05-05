// eslint-disable-next-line @typescript-eslint/no-explicit-any -- window._env_ is injected at runtime via runtime-config.js and has no type definition
const runtimeEnv = (window as any)._env_ ?? {};

/**
 * Centralized environment configuration.
 *
 * In development (npm run dev): values come from VITE_* in .env via Vite.
 * In containers: RUNTIME_* values are set via a mounted runtime-config.js
 * (ConfigMap in OpenShift, volume mount in Docker) and take precedence.
 */
export const env = {
  bffUrl: runtimeEnv.RUNTIME_BFF_URL || import.meta.env.VITE_BFF_URL || "",
};
