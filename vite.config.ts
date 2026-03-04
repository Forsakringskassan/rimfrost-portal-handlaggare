import { URL, fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import { vitePlugin as apimockPlugin } from "@forsakringskassan/apimock-express";
import federation from "@originjs/vite-plugin-federation";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import routeManifest from "./public/route-manifest.json";

const isProd = process.env.NODE_ENV === "production";

const remotes = Object.values(routeManifest.routes).reduce(
  (acc, entry) => {
    acc[entry.scope] = `${isProd ? entry.prodEntry : entry.devEntry}`;
    return acc;
  },
  {} as Record<string, string>,
);

export default defineConfig(() => ({
  plugins: [
    apimockPlugin([{ url: "/api/uppgifter", dir: "mock" }]),
    federation({
      name: "app",
      remotes,
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
    },
    port: 3030,
  },
}));
