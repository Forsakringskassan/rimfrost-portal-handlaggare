/**
 * Environment configuration for the application.
 * All environment variables must be prefixed with VITE_ to be exposed to the client.
 *
 * @see https://vitejs.dev/guide/env-and-mode.html
 */

interface EnvConfig {
  // API URLs
  apiBaseUrl: string;
  uppgifterApiUrl: string;
  regelApiUrl: string;
  kundbehovApiUrl: string;

  // Remote Module Federation URLs
  remoteAppUrl: string;
  exampleAppUrl: string;

  // Mock Handläggare ID
  mockHandlaggareId: string;

  // Feature Flags
  useApi: boolean;

  // Server Configuration
  port: number;
}

// Build-time environment variable values (Vite will replace these at build time)
const BUILD_API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://api.example.com";
const BUILD_UPPGIFTER_API_URL =
  import.meta.env.VITE_UPPGIFTER_API_URL || "http://localhost:8889";
const BUILD_REGEL_API_URL =
  import.meta.env.VITE_REGEL_API_URL || "http://localhost:8890";
const BUILD_KUNDBEHOV_API_URL =
  import.meta.env.VITE_KUNDBEHOV_API_URL || "http://localhost:8888";
const BUILD_REMOTE_APP_URL =
  import.meta.env.VITE_REMOTE_APP_URL ||
  "http://localhost:3031/assets/remoteEntry.js";
const BUILD_EXAMPLE_APP_URL =
  import.meta.env.VITE_EXAMPLE_APP_URL ||
  "http://localhost:3033/assets/remoteEntry.js";
const BUILD_MOCK_HANDLAGGARE_ID =
  import.meta.env.VITE_MOCK_HANDLAGGARE_ID ||
  "469ddd20-6796-4e05-9e18-6a95953f6cb3";
const BUILD_USE_API = import.meta.env.VITE_USE_API === "true";
const BUILD_PORT = parseInt(import.meta.env.VITE_PORT || "8080", 10);

/**
 * Get runtime environment variable value
 */
function getRuntimeEnv(key: string): string | undefined {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- testing
  const runtimeValue = (window as any)._env_?.[key];
  // Only use runtime value if it exists, is not empty, and is not the placeholder key itself
  if (runtimeValue && runtimeValue !== "" && runtimeValue !== key) {
    return runtimeValue;
  }
  return undefined;
}

/**
 * Centralized environment configuration with runtime override support
 */
export const env: EnvConfig = {
  // API URLs
  get apiBaseUrl() {
    return getRuntimeEnv("RUNTIME_API_BASE_URL") || BUILD_API_BASE_URL;
  },
  get uppgifterApiUrl() {
    return (
      getRuntimeEnv("RUNTIME_UPPGIFTER_API_URL") || BUILD_UPPGIFTER_API_URL
    );
  },
  get regelApiUrl() {
    return getRuntimeEnv("RUNTIME_REGEL_API_URL") || BUILD_REGEL_API_URL;
  },
  get kundbehovApiUrl() {
    return (
      getRuntimeEnv("RUNTIME_KUNDBEHOV_API_URL") || BUILD_KUNDBEHOV_API_URL
    );
  },

  // Remote Module Federation URLs
  get remoteAppUrl() {
    return getRuntimeEnv("RUNTIME_REMOTE_APP_URL") || BUILD_REMOTE_APP_URL;
  },
  get exampleAppUrl() {
    return getRuntimeEnv("RUNTIME_EXAMPLE_APP_URL") || BUILD_EXAMPLE_APP_URL;
  },

  // Mock Handläggare ID
  get mockHandlaggareId() {
    return (
      getRuntimeEnv("RUNTIME_MOCK_HANDLAGGARE_ID") || BUILD_MOCK_HANDLAGGARE_ID
    );
  },

  // Feature Flags
  get useApi() {
    const runtimeValue = getRuntimeEnv("RUNTIME_USE_API");
    if (runtimeValue !== undefined) {
      return runtimeValue === "true";
    }
    return BUILD_USE_API;
  },

  // Server Configuration
  get port() {
    const runtimeValue = getRuntimeEnv("RUNTIME_PORT");
    if (runtimeValue !== undefined) {
      return parseInt(runtimeValue, 10);
    }
    return BUILD_PORT;
  },
};

/**
 * Validate that all required environment variables are set
 */
export function validateEnv(): void {
  const required = [
    "VITE_API_BASE_URL",
    "VITE_UPPGIFTER_API_URL",
    "VITE_REGEL_API_URL",
  ];

  const missing = required.filter((key) => !import.meta.env[key]);

  if (missing.length > 0) {
    console.warn(
      `Missing environment variables: ${missing.join(", ")}. Using default values.`,
    );
  }
}
