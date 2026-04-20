// eslint-disable-next-line @typescript-eslint/no-explicit-any
const runtimeEnv = (window as any)._env_ ?? {};

/**
 * Centralized environment configuration.
 *
 * In development (npm run dev): values come from VITE_* in .env via Vite.
 * In Docker containers: RUNTIME_* values are injected into window._env_ at
 * startup by env.sh and take precedence over any build-time baked values.
 */
export const env = {
  bffUrl: runtimeEnv.RUNTIME_BFF_URL || import.meta.env.VITE_BFF_URL || "",
  remoteAppUrl:
    runtimeEnv.RUNTIME_REMOTE_APP_URL ||
    import.meta.env.VITE_REMOTE_APP_URL ||
    "",
  exampleAppUrl:
    runtimeEnv.RUNTIME_EXAMPLE_APP_URL ||
    import.meta.env.VITE_EXAMPLE_APP_URL ||
    "",
};
