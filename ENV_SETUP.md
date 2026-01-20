# Environment Variables Setup

This project uses environment variables for configuration following Vite best practices.

## Environment Files

- **`.env`** - Default configuration (committed to git)
- **`.env.development`** - Development overrides (committed to git)
- **`.env.production`** - Production overrides (committed to git)
- **`.env.local`** - Local overrides (ignored by git, for personal settings)
- **`.env.example`** - Template file showing all available variables

## Variable Naming Convention

All environment variables exposed to the client must be prefixed with `VITE_` to be accessible in the application code.

## Available Variables

### API URLs

- `VITE_API_BASE_URL` - Base URL for main API
- `VITE_UPPGIFTER_API_URL` - Uppgifter service URL
- `VITE_REGEL_API_URL` - Regel service URL
- `VITE_KUNDBEHOV_API_URL` - Kundbehov service URL

### Remote Module Federation

- `VITE_REMOTE_APP_URL` - Remote app entry point
- `VITE_EXAMPLE_APP_URL` - Example app entry point

### Configuration

- `VITE_MOCK_HANDLAGGARE_ID` - Mock handler ID for API requests
- `VITE_USE_API` - Toggle between mock and real API (true/false)
- `VITE_PORT` - Development server port

## Usage

### In TypeScript/JavaScript

```typescript
import { env } from "@/config/env";

// Use the centralized config
const apiUrl = env.uppgifterApiUrl;
const useApi = env.useApi;
```

### In vite.config.ts

```typescript
import { loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  // Access via env.VITE_*
});
```

### In Node.js scripts

```javascript
const API_URL = process.env.VITE_UPPGIFTER_API_URL || "http://localhost:8889";
```

## Setup Instructions

1. Copy `.env.example` to `.env.local` for personal overrides:

   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` with your local settings

3. Never commit `.env.local` or any file containing secrets

## Production Deployment

For production builds, ensure all required environment variables are set:

- In CI/CD pipelines, set variables via pipeline configuration
- For container deployments, use docker-compose or Kubernetes secrets
- For static hosting, use platform-specific environment variable settings

## Type Safety

The environment configuration is fully typed in `src/config/env.ts`, providing:

- IntelliSense support
- Type checking
- Default values
- Value transformation (string to boolean/number)

## Best Practices

✅ **DO:**

- Use the centralized `env` config from `src/config/env.ts`
- Prefix all client-side variables with `VITE_`
- Provide sensible defaults
- Document all variables in `.env.example`
- Use `.env.local` for personal settings

❌ **DON'T:**

- Hardcode URLs or configuration in source files
- Commit sensitive data to version control
- Access `import.meta.env` directly (use the config instead)
- Use unprefixed variables for client-side code
