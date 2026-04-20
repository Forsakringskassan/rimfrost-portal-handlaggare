# Rimfrost Frontend

A modern task management application built with Vue 3, TypeScript, and Vite. This application provides a user interface for case handlers to manage operational tasks (uppgifter) in a streamlined workflow.

## Features

- **Task Management** - View, manage and process operational tasks
- **Task Assignment** - Fetch and assign new tasks to case handlers
- **Handläggare Selection** - Dropdown in header to switch between case handlers (dev only)
- **Module Federation** - Micro-frontend architecture supporting remote applications
- **FK UI Components** - Built with Försäkringskassan's design system (@fkui/vue)
- **Type Safety** - Full TypeScript support with strict type checking
- **State Management** - Pinia for reactive state management
- **Routing** - Vue Router for navigation

## Tech Stack

- **Vue 3** - Progressive JavaScript framework with Composition API
- **TypeScript** - Type-safe JavaScript
- **Vite** - Next-generation frontend tooling
- **Pinia** - State management for Vue 3
- **Vue Router** - Official router for Vue.js
- **Module Federation** - Micro-frontend architecture via @originjs/vite-plugin-federation
- **FKUI Design System** - Försäkringskassan's UI component library

## Prerequisites

- Node.js (version 18 or higher recommended).
- npm or yarn

## System Architecture

### Communication Flow

This is the **Host Frontend** in a micro-frontend architecture with the following communication flow:

```
[Host FE] ←→ [Portal BFF] ←→ [Backend Services]
    ↓
[Micro FE (RTF Manual)] ←→ [Rule BFF] ←→ [Backend Services]
```

**Data Flow:**

1. Host FE loads task list from Portal BFF (`/tasks/:handlaggarId`)
2. User selects a task → Host FE loads appropriate Micro FE via Module Federation
3. Micro FE receives `handlaggningId` and `regeltyp` as props
4. Micro FE calls its dedicated Rule BFF (`/api/regel/rtf-manuell/:id`)
5. Each BFF handles backend communication with automatic fallback to mock data

## Getting Started

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd rimfrost-fe

# Install dependencies
npm install
```

### Development

```bash
# Start development server with hot-reload
npm run dev
```

The application will be available at `http://localhost:3030` (configurable via `VITE_PORT` environment variable).

### Build

1. At build time, Vite embeds `VITE_*` environment variables into the bundle
2. At runtime, the `env.sh` script creates a `runtime-config.js` file with `RUNTIME_*` variables
3. The application checks `window._env_` for runtime values before falling back to build-time values

## Handläggare Selection (Dev Only)

A dropdown in the application header allows switching between case handlers during development. Handlers are fetched from Portal BFF (`GET /handlaggare`) with automatic mock fallback.

To add or modify mock handlers, update `utils/mockDataService.ts` in `rimfrost-portal-bff`.

## Module Federation (Micro Frontends)

### Dynamic Remote Loading

This app uses **Module Federation** to dynamically load micro frontends based on task data. The system is fully data-driven—each task carries a `url` field that points to a registered micro frontend entry.

### How It Works

1. **Task arrives with a `url` field** (e.g., `"url": "rtf-manuell"`)
2. **Host loads manifest** from `public/route-manifest.json` to look up the remote's scope, module, and entry URLs
3. **Host calls `loadRemoteModule()`** with the route key → loads the remote entry script and imports the module
4. **Micro frontend renders** with props: `handlaggningId` and `regeltyp`

### Adding a New Micro Frontend

Follow these three steps to register a new remote:

### TypeScript Type Declarations for Remotes

Module Federation imports are not recognized by TypeScript at compile time since they are resolved dynamically by Vite. To avoid TypeScript errors, all remote module imports are declared in `src/federation.d.ts`.

#### `src/federation.d.ts`

This file tells the TypeScript compiler that the remote modules exist and what they export. Without it, imports like `import("bekraftaBeslutApp/BekraftaBeslut")` would cause TypeScript errors since the modules are not real npm packages.

**When to update this file:**

Every time you add a new micro frontend, add a corresponding declaration:

```typescript
declare module "yourRemoteApp/YourComponent" {
  const component: import("vue").Component;
  export default component;
}
```

The pattern is `${scope}/${module}` — the same values you used in `route-manifest.json` and `loadRemoteModule.ts`.

> **Note:** The `import('vue').Component` syntax is required due to `erasableSyntaxOnly: true` in `tsconfig.app.json`. Standard `import { Component } from 'vue'` inside declare blocks is not allowed.

#### Step 1: Register in `public/route-manifest.json`

```json
{
  "routes": {
    "your-route-key": {
      "scope": "yourRemoteApp",
      "module": "YourComponent",
      "devEntry": "http://localhost:YOUR_PORT/assets/remoteEntry.js",
      "prodEntry": "https://your-prod-url.example.com/assets/remoteEntry.js"
    }
  }
}
```

- **scope**: The Module Federation container name (must match your remote's `federation({ name: ... })`)
- **module**: The exposed component path (e.g., `"./YourComponent"`)
- **devEntry**: Dev server remote entry URL
- **prodEntry**: Production remote entry URL

#### Step 2: Update `vite.config.ts` remotes map

The remotes map is auto-generated from the manifest:

```typescript
const remotes = Object.entries(routeManifest.routes).reduce(
  (acc, [key, entry]) => {
    acc[entry.scope] = `${isProd ? entry.prodEntry : entry.devEntry}`;
    return acc;
  },
  {} as Record<string, string>,
);
```

This runs automatically at build time, so you don't need to manually edit it.

#### Step 3: Add to `src/utils/loadRemoteModule.ts` and `src/federation.d.ts`

Add your route key to the importer lookup in `loadRemoteModule.ts`:

```typescript
const remoteImporters: Record<string, () => Promise<{ default: unknown }>> = {
  "rtf-manuell": () => import("remoteApp/VardAvHusdjur"),
  "your-route-key": () => import("yourRemoteApp/YourComponent"),
};
```

And add a type declaration in `src/federation.d.ts`:

```typescript
declare module "yourRemoteApp/YourComponent" {
  const component: import("vue").Component;
  export default component;
}
```

#### Step 4: Backend/BFF updates

- Have the backend set the task's `url` field to your route key (e.g., `"url": "your-route-key"`)
- Ensure your micro frontend has a similar structure to `rimfrost-regel-rtf-manuell-fe`, accepting `handlaggningId` and `regeltyp` props

```bash
# Build for production
npm run build
```

The production-ready files will be generated in the `dist/` directory.

### Preview Production Build

```bash
# Preview production build locally
npm run preview
```

## Environment Configuration

The project uses environment variables for configuration. See [ENV_SETUP.md](ENV_SETUP.md) for detailed documentation.

### Quick Setup

1. Copy `.env.example` to `.env.local`:

```bash
   cp .env .env.local
```

2. Configure your local settings in `.env.local`

### Key Environment Variables

- `VITE_PORT` - Development server port (default: 3030)
- `VITE_BFF_URL` - Portal BFF base URL (must start with `/` for relative or `http://` for absolute)
- `VITE_MOCK_HANDLAGGARE_ID` - Fallback handler ID if store is empty

Micro frontend entry URLs are configured in `public/route-manifest.json` under `devEntry` and `prodEntry`, not via environment variables. This allows changing remotes without rebuilding the host.

See [ENV_SETUP.md](ENV_SETUP.md) for the complete list of available variables.

## Project Structure

```
rimfrost-portal-handlaggare/
├── src/
│   ├── components/
│   │   ├── HuvudytaUppgift.vue      # Page header component
│   │   ├── IngenUppgiftVald.vue     # Empty state view
│   │   ├── OppnadUppgift.vue        # Micro FE loader & container
│   │   └── UppgiftLista.vue         # Task list navigation
│   ├── router/                      # Vue Router configuration
│   ├── stores/
│   │   ├── uppgiftListaStore.ts     # Task list state
│   │   └── handlaggareStore.ts      # Case handler selection state
│   ├── utils/
│   │   ├── loadRemoteModule.ts      # Dynamic MFE loader
│   │   ├── getTilldeladeUppgifter.ts # Fetch assigned tasks
│   │   ├── getNextUppgift.ts        # Fetch next task
│   │   └── transformUppgift.ts      # Data transformation
│   ├── config/
│   │   └── remoteRegistry.ts        # MFE manifest loader
│   ├── App.vue                      # Root layout
│   ├── main.ts                      # Entry point
│   ├── pinia.ts                     # Store setup
│   ├── federation.d.ts              # TypeScript declarations for remote modules
│   └── types.ts                     # Type definitions
├── public/
│   └── route-manifest.json          # MFE registry (scope, module, entry URLs)
├── vite.config.ts                   # Vite & Module Federation config
└── package.json                     # Dependencies & scripts
```

### Key Files

- **`public/route-manifest.json`**: Central registry of all available micro frontends
- **`src/utils/loadRemoteModule.ts`**: Loads and instantiates remotes dynamically
- **`src/federation.d.ts`**: TypeScript type declarations for remote modules
- **`src/stores/handlaggareStore.ts`**: Manages selected case handler state
- **`src/components/OppnadUppgift.vue`**: Container that renders the loaded micro frontend

## Remote Micro Frontend Development

### Prerequisites for Your Remote

Your micro frontend must:

1. **Use Module Federation** with `@originjs/vite-plugin-federation`
2. **Declare a unique name** in `vite.config.ts` (e.g., `federation({ name: "yourRemoteApp" })`)
3. **Expose a component** (e.g., `exposes: { "./YourComponent": "./src/components/YourComponent.vue" }`)
4. **Share dependencies** with the host (Vue, @fkui/vue, Pinia):

```typescript
federation({
  shared: ["vue", "@fkui/vue", "pinia"],
});
```

5. **Accept props**: `handlaggningId` (string) and `regeltyp` (string)

### Shared Dependencies

Both host and remotes share these libraries to avoid duplication:

- **Vue** - Core framework
- **@fkui/vue** - Design system components
- **Pinia** - Global state management

### Local Development with Multiple Repos

If developing the host and remote simultaneously:

1. Start remote dev server: `npm run dev` (e.g., port 3032)
2. Start host dev server: `npm run dev` (e.g., port 3030)
3. Host automatically loads from remote's dev entry URL
4. Hot-reload works on both sides

## API Integration

This host app communicates only with the **Portal BFF**:

- `GET /handlaggare` - Fetch available case handlers
- `GET /tasks/:handlaggarId` - Fetch all tasks assigned to a handler
- `POST /tasks/getNext/:handlaggarId` - Fetch the next available task

The Portal BFF fetches from backend services and returns mock data when unavailable.

**Each micro frontend** has its own dedicated Rule BFF (e.g., rimfrost-regel-rtf-manuell-bff) for rule-specific calls:

- `GET /api/:regel/:regeltyp/:handlaggningId` - Fetch decision data
- `POST /api/:regel/:regeltyp/:handlaggningId/patchErsattning` - Submit decisions

Micro frontends communicate with their BFF using the `regeltyp` prop received from the host.

## Docker Deployment

### Full stack (all services)

The `docker-compose.yml` in this repo wires together all six services. Each service builds its own image from the sibling repos.

```bash
# 1. Copy the example env file and fill in your internal URLs
cp .env.docker.example .env.docker

# 2. Build and start all services
docker compose --env-file .env.docker up --build -d

# 3. Open http://localhost:8080
```

See [.env.docker.example](.env.docker.example) for a description of every required variable.

**Port mapping:**

| Service | External port |
|---|---|
| rimfrost-portal-fe | 8080 |
| rimfrost-portal-bff | 9001 |
| rimfrost-rtf-manuell-fe | 8081 |
| rimfrost-rtf-manuell-bff | 9002 |
| rimfrost-bekraftabeslut-fe | 8082 |
| rimfrost-bekraftabeslut-bff | 9003 |

### Single service (this FE only)

```bash
docker build -t rimfrost-portal-fe .
docker run -p 8080:8080 \
  -e RUNTIME_BFF_URL=https://bff.example.com \
  -e RUNTIME_REMOTE_APP_URL=https://rtf-manuell.example.com/assets/remoteEntry.js \
  -e RUNTIME_EXAMPLE_APP_URL=https://bekraftabeslut.example.com/assets/remoteEntry.js \
  rimfrost-portal-fe
```

### How runtime environment injection works

1. At container start, `env.sh` reads every `RUNTIME_*` environment variable.
2. It writes them into `/usr/local/apache2/htdocs/runtime-config.js` as `window._env_ = { ... }`.
3. `index.html` has a `<script src="/runtime-config.js">` tag injected, so the values are available before the app boots.
4. `src/config/env.ts` checks `window._env_.RUNTIME_*` first, then falls back to build-time `VITE_*` values (used in dev).

**Required `RUNTIME_*` variables:**

| Variable | Purpose |
|---|---|
| `RUNTIME_BFF_URL` | URL of the portal BFF, as seen from the **browser** |
| `RUNTIME_REMOTE_APP_URL` | `remoteEntry.js` URL of the RTF Manuell micro-FE, as seen from the **browser** |
| `RUNTIME_EXAMPLE_APP_URL` | `remoteEntry.js` URL of the Bekräfta Beslut micro-FE, as seen from the **browser** |

## Code Quality

The project uses Försäkringskassan's code quality standards:

- **ESLint** - Linting with @forsakringskassan/eslint-config
- **Prettier** - Code formatting with @forsakringskassan/prettier-config
- **TypeScript** - Strict type checking
- **Commitlint** - Conventional commit message validation

## Design Resources

Figma design file: [Rimfrost-FE](https://www.figma.com/design/bPSo3oZMvp9Mbm7keQnBRe/Rimfrost-FE?m=auto&t=WdisuEgzoREFhPN7-6)

## Development Tools

- **Vite DevTools** - Vue DevTools integration for development
- **API Mock** - @forsakringskassan/apimock-express for API mocking
- **Hot Module Replacement** - Instant updates during development

## Browser Support

The application is built to support modern browsers. Ensure your target browsers support ES2015+ features.

## Contributing

1. Follow the conventional commits specification
2. Ensure all tests pass before submitting
3. Follow the FK coding standards and guidelines
4. Update documentation as needed

## License

Private project - All rights reserved

## Support

For questions or issues, please contact the development team.
