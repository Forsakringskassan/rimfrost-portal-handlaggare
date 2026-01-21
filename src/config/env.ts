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

/**
 * Get environment variable with fallback
 */
function getEnv(key: string, defaultValue: string): string {
  return import.meta.env[key] || defaultValue;
}

/**
 * Get boolean environment variable
 */
function getBoolEnv(key: string, defaultValue: boolean): boolean {
  const value = import.meta.env[key];
  if (value === undefined || value === null) {
    return defaultValue;
  }
  return value === "true" || value === true;
}

/**
 * Get number environment variable
 */
function getNumberEnv(key: string, defaultValue: number): number {
  const value = import.meta.env[key];
  if (value === undefined || value === null) {
    return defaultValue;
  }
  return parseInt(value, 10);
}

/**
 * Centralized environment configuration
 */
export const env: EnvConfig = {
  // API URLs
  apiBaseUrl: getEnv("VITE_API_BASE_URL", "https://api.example.com"),
  uppgifterApiUrl: getEnv("VITE_UPPGIFTER_API_URL", "http://localhost:8889"),
  regelApiUrl: getEnv("VITE_REGEL_API_URL", "http://localhost:8890"),
  kundbehovApiUrl: getEnv("VITE_KUNDBEHOV_API_URL", "http://localhost:8888"),

  // Remote Module Federation URLs
  remoteAppUrl: getEnv(
    "VITE_REMOTE_APP_URL",
    "http://localhost:3031/assets/remoteEntry.js",
  ),
  exampleAppUrl: getEnv(
    "VITE_EXAMPLE_APP_URL",
    "http://localhost:3033/assets/remoteEntry.js",
  ),

  // Mock Handläggare ID
  mockHandlaggareId: getEnv(
    "VITE_MOCK_HANDLAGGARE_ID",
    "469ddd20-6796-4e05-9e18-6a95953f6cb3",
  ),

  // Feature Flags
  useApi: getBoolEnv("VITE_USE_API", false),

  // Server Configuration
  port: getNumberEnv("VITE_PORT", 8080),
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
