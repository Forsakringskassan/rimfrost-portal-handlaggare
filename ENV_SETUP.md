# Environment Configuration

Config is split between local development and container deployments.

## Local development

Set variables in `.env`. Vite reads `VITE_*` values at dev-server startup and bakes them into the bundle — they are **not configurable** after the image is built.

```env
VITE_BFF_URL=http://localhost:9001
```

## Docker (local image testing)

Mount a `runtime-config.js` file into the container at the path `/usr/local/apache2/htdocs/runtime-config.js`. Create the file with the values you need:

```js
window._env_ = {
  RUNTIME_BFF_URL: "http://your-bff-url",
};
```

```bash
docker run -p 8080:8080 \
  -v ./runtime-config.js:/usr/local/apache2/htdocs/runtime-config.js \
  your-image-name
```

## OpenShift (production)

Create a ConfigMap with the config file content and mount it using `subPath` so only the config file is replaced inside the container:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: portal-handlaggare-config
data:
  runtime-config.js: |
    window._env_ = {
      "RUNTIME_BFF_URL": "https://your-bff.internal.example.com"
    };
```

```yaml
# In your Deployment:
volumeMounts:
  - name: runtime-config
    mountPath: /usr/local/apache2/htdocs/runtime-config.js
    subPath: runtime-config.js
volumes:
  - name: runtime-config
    configMap:
      name: portal-handlaggare-config
```

## Available variables

| Variable | Dev (`.env`)   | Container (`runtime-config.js`) | Description         |
| -------- | -------------- | ------------------------------- | ------------------- |
| BFF URL  | `VITE_BFF_URL` | `RUNTIME_BFF_URL`               | Portal BFF base URL |

## Reading config in code

All config is accessed through `src/config/env.ts`:

```typescript
import { env } from "@/config/env";

const apiUrl = env.bffUrl;
```

Do not use `import.meta.env` directly in source files.
