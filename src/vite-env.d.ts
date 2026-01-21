/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_UPPGIFTER_API_URL: string;
  readonly VITE_REGEL_API_URL: string;
  readonly VITE_KUNDBEHOV_API_URL: string;
  readonly VITE_REMOTE_APP_URL: string;
  readonly VITE_EXAMPLE_APP_URL: string;
  readonly VITE_MOCK_HANDLAGGARE_ID: string;
  readonly VITE_USE_API: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Module Federation remote module declarations
declare module "exampleApp/ExempelKomponent" {
  const component: import("vue").Component;
  export default component;
}

declare module "remoteApp/VardAvHusdjur" {
  const component: import("vue").Component;
  export default component;
}
