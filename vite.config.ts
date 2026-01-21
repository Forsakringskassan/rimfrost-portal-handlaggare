import { URL, fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import { vitePlugin as apimockPlugin } from "@forsakringskassan/apimock-express";
import federation from "@originjs/vite-plugin-federation";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";

export default defineConfig(({ mode }) => ({
  plugins: [
    apimockPlugin([{ url: "/api", dir: "mock" }]),
    federation({
      name: "app",
      remotes: {
        remoteApp:
          mode === "production"
            ? process.env.VITE_REMOTE_APP_URL ||
              "http://localhost:3031/assets/remoteEntry.js"
            : "http://localhost:3031/assets/remoteEntry.js",
        exampleApp:
          mode === "production"
            ? process.env.VITE_EXAMPLE_APP_URL ||
              "http://localhost:8083/assets/remoteEntry.js"
            : "http://localhost:8083/assets/remoteEntry.js",
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
      "/uppgifter": "http://localhost:8889",
      "/regel": "http://localhost:8890",
    },
    port: 3030,
  },
}));
