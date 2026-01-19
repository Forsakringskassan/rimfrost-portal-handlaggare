import { URL, fileURLToPath } from "node:url";
import { defineConfig, loadEnv } from "vite";
import { vitePlugin as apimockPlugin } from "@forsakringskassan/apimock-express";
import federation from "@originjs/vite-plugin-federation";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      apimockPlugin([{ url: "/api", dir: "mock" }]),
      federation({
        name: "app",
        remotes: {
          remoteApp:
            env.VITE_REMOTE_APP_URL ||
            "http://localhost:3031/assets/remoteEntry.js",
          exampleApp:
            env.VITE_EXAMPLE_APP_URL ||
            "http://localhost:3033/assets/remoteEntry.js",
        },
        shared: ["vue", "@fkui/vue", "pinia"],
        exposes: {
          "./pinia": "./src/pinia.ts",
        },
      }),
      vue(),
      vueDevTools(),
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    server: {
      proxy: {
        "/uppgifter": env.VITE_UPPGIFTER_API_URL || "http://localhost:8889",
        "/regel": env.VITE_REGEL_API_URL || "http://localhost:8890",
      },
      port: parseInt(env.VITE_PORT || "3030", 10),
      strictPort: true,
    },
  };
});
