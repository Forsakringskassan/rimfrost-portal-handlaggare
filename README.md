# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about the recommended Project Setup and IDE Support in the [Vue Docs TypeScript Guide](https://vuejs.org/guide/typescript/overview.html#project-setup).

Figma Design file can be found here: https://www.figma.com/design/bPSo3oZMvp9Mbm7keQnBRe/Rimfrost-FE?m=auto&t=WdisuEgzoREFhPN7-6

## Docker Runtime Environment Variables

The application supports runtime environment variable injection. This means you can configure the application when starting the Docker container without rebuilding the image.

### Usage

Pass environment variables with the `RUNTIME_` prefix when starting the container:

```bash
docker run -p 8080:8080 \
  -e APP_PREFIX=RUNTIME_ \
  -e RUNTIME_MOCK_HANDLAGGARE_ID=12345 \
  -e RUNTIME_UPPGIFTER_API_URL=https://api.example.com \
  rimfrost-fe-rimfrost-fe
```

### Available Runtime Variables

All build-time `VITE_*` variables can be overridden at runtime by using the `RUNTIME_*` prefix:

- `RUNTIME_MOCK_HANDLAGGARE_ID` - Mock Handläggare ID
- `RUNTIME_API_BASE_URL` - Base API URL
- `RUNTIME_UPPGIFTER_API_URL` - Uppgifter API URL
- `RUNTIME_REGEL_API_URL` - Regel API URL
- `RUNTIME_KUNDBEHOV_API_URL` - Kundbehov API URL
- `RUNTIME_USE_API` - Feature flag for API usage (true/false)

### How It Works

1. At build time, Vite embeds `VITE_*` environment variables into the bundle
2. At runtime, the `env.sh` script creates a `runtime-config.js` file with `RUNTIME_*` variables
3. The application checks `window._env_` for runtime values before falling back to build-time values
