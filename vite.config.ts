import { URL, fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import { vitePlugin as apimockPlugin } from "@forsakringskassan/apimock-express";
import { federation } from "@module-federation/vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";

export default defineConfig(() => ({
  plugins: [
    federation({
      name: "app",
      remotes: {},
      shared: {
        vue: { singleton: true, requiredVersion: "^3.5.22" },
        "@fkui/vue": { singleton: true, requiredVersion: "^6.24.1" },
        pinia: { singleton: true, requiredVersion: "^3.0.4" },
      },
      exposes: {
        "./pinia": "./src/pinia.ts",
      },
      dev: {
        disableHotTypesReload: true,
      },
    }),
    apimockPlugin([{ url: "/api/uppgifter", dir: "mock" }]),
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  // TODO: after deploying under a sub-path, verify that Module Federation dynamic chunk
  // loading still works (open a task that loads a remote MFE and check the network tab).
  // If chunks 404, add `publicPath: "auto"` to the federation() config above — this tells
  // the MF runtime to infer its base URL from the executing script's src attribute at
  // runtime instead of relying on the static Vite base.
  base: "./",
  build: {
    target: "esnext",
  },
  optimizeDeps: {
    include: ["@module-federation/runtime"],
  },
  server: {
    proxy: {
      "/uppgifter": "http://localhost:8889",
      "/api/regel/bekraftabeslut": "http://localhost:9003",
      "/api": "http://localhost:9002",
    },
    port: 3030,
  },
}));
