import { resolve } from "node:path";
import { URL, fileURLToPath } from "node:url";
import { defineConfig } from "vite";

import federation from "@originjs/vite-plugin-federation";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    federation({
      name: "remote_app",
      filename: "remoteEntry.js",
      exposes: {
        "./VardAvHusdjur": "./src/components/VardAvHusdjur.vue",
      },
      shared: ["vue", "@fkui/vue", "pinia"],
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  preview: {
    port: 3031,
    cors: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
  server: {
    proxy: {
      "/regel": "http://localhost:8890",
    },
    port: 3032,
  },
  define: { "process.env": '"production"' },
  build: {
    cssCodeSplit: false,
    lib: {
      formats: ["es"],
      entry: resolve(__dirname, "src/main.ts"),
      name: "vardAvHusdjur",
    },
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith(".css")) {
            return "assets/vardAvHusdjur.css";
          }
          return assetInfo.name ?? "assets/[name][extname]";
        },
      },
    },
  },
});
