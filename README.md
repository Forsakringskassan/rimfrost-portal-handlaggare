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
- **Toast Notifications** - User feedback on task completion via `task-done` custom event

## Tech Stack

- **Vue 3** - Progressive JavaScript framework with Composition API
- **TypeScript** - Type-safe JavaScript
- **Vite** - Next-generation frontend tooling
- **Pinia** - State management for Vue 3
- **Vue Router** - Official router for Vue.js
- **Module Federation** - Micro-frontend architecture via @module-federation/vite + @module-federation/enhanced
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

The application will be available at `http://localhost:3030`.

## Testing

Unit tests are written with [Vitest](https://vitest.dev/) and [@vue/test-utils](https://test-utils.vuejs.org/), using [happy-dom](https://github.com/capricorn86/happy-dom) as the DOM environment.

```bash
# Run tests in watch mode
npm test

# Run once and generate a coverage report (output: coverage/)
npm run test:coverage
```

Tests live next to the code they cover in `__tests__` directories:

```
src/
└── stores/
    ├── handlaggareStore.ts
    ├── uppgiftListaStore.ts
    └── __tests__/
        ├── handlaggareStore.spec.ts
        └── uppgiftListaStore.spec.ts
```

### Conventions

- Each store and util gets its own `*.spec.ts` file in a sibling `__tests__/` directory.
- Store tests call `setActivePinia(createPinia())` in `beforeEach` to isolate state between tests.
- `fetch` is mocked with `vi.stubGlobal("fetch", ...)` and cleaned up in `afterEach` via `vi.unstubAllGlobals()`.

### Config

- `vitest.config.ts` — standalone Vitest config using only the Vue plugin (the Module Federation plugin is excluded as it is incompatible with the test environment).
- `tsconfig.vitest.json` — extends `tsconfig.app.json` and adds `vitest/globals` types.

## Handläggare Selection (Dev Only)

A dropdown in the application header allows switching between case handlers during development. Handlers are fetched from Portal BFF (`GET /handlaggare`) with automatic mock fallback.

To add or modify mock handlers, update `utils/mockDataService.ts` in `rimfrost-portal-bff`.

## Toast Notifications

Toast notifications are displayed in the portal when a task is completed or fails.

- **Settings** (timeout, animation, styling): `src/utils/useToast.ts` and `src/components/ToastContainer.vue`
- **Triggered by**: `task-done` custom event dispatched via `window.dispatchEvent`
- **Listened to in**: `src/App.vue`

Each micro frontend dispatches `task-done` with a `success` field and an optional `message`:

```typescript
window.dispatchEvent(
  new CustomEvent("task-done", {
    detail: {
      handlaggningId: "...",
      success: true,
      message: "Uppgift slutförd!",
    },
  }),
);
```

| Field            | Type              | Description                                      |
| ---------------- | ----------------- | ------------------------------------------------ |
| `handlaggningId` | string            | ID för handläggningsärendet                      |
| `success`        | boolean           | `true` = grön toast, `false` = röd toast         |
| `message`        | string (optional) | Visas i toasten, annars visas standardmeddelande |

## Module Federation (Micro Frontends)

### Dynamic Remote Loading

This app uses **Module Federation** to dynamically load micro frontends based on task data. The system is fully data-driven — each task carries a `url` field that points to a registered micro frontend entry. No portal rebuild is needed to add or update a remote.

### How It Works

1. **Task arrives with a `url` field** (e.g., `"url": "rtf-manuell"`)
2. **Host fetches the remote registry** from Portal BFF (`GET /api/route-manifest`) to look up the remote's scope, module, and entry URLs. Falls back to `public/route-manifest.json` only in local dev when no BFF is running.
3. **Host calls `loadRemoteModule()`** → registers the remote via `registerRemotes()` then loads it via `loadRemote()` from `@module-federation/enhanced/runtime`
4. **Micro frontend renders** with props: `handlaggningId` and `regeltyp`

### Adding a New Micro Frontend

**No changes to this repo are required.** The registry lives in `rimfrost-portal-bff`.

#### Update `remotes.json` in `rimfrost-portal-bff`

Add an entry to `rimfrost-portal-bff/remotes.json`:

```json
{
  "routes": {
    "your-route-key": {
      "scope": "yourRemoteApp",
      "module": "YourComponent",
      "devEntry": "http://localhost:YOUR_PORT/mf-manifest.json",
      "prodEntry": "https://your-prod-url.example.com/mf-manifest.json"
    }
  }
}
```

- **scope**: must match the remote's `federation({ name: ... })` in its `vite.config.ts`
- **module**: the exposed component key without the leading `./` (e.g., `"YourComponent"` for `exposes: { "./YourComponent": ... }`)
- **devEntry/prodEntry**: URL to the remote's `mf-manifest.json`

In **production** (Kubernetes/OpenShift), `remotes.json` is replaced by a ConfigMap mounted at the path specified by `REMOTES_CONFIG_PATH` on the BFF. Update the ConfigMap and the change takes effect immediately — no rebuild or restart of the portal or BFF is needed.

In **development**, the BFF re-reads the file on every request — just save the file and reload the page.

#### Backend/BFF

Have the backend set the task's `url` field to your route key (e.g., `"url": "your-route-key"`). Ensure your micro frontend accepts `handlaggningId` and `regeltyp` props.

### Building for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Environment Configuration

Config is split between local development and container deployments. See [ENV_SETUP.md](ENV_SETUP.md) for full details including the OpenShift ConfigMap setup.

### Local development

Set variables in `.env`. These are baked into the bundle at build time and are **not configurable** after the image is built.

```env
VITE_BFF_URL=http://localhost:9001
```

### Docker and OpenShift

Mount a `runtime-config.js` file at `/usr/local/apache2/htdocs/runtime-config.js` inside the container:

```js
window._env_ = {
  RUNTIME_BFF_URL: "https://your-bff.internal.example.com",
};
```

In OpenShift this is done via a ConfigMap mounted with `subPath`. See [ENV_SETUP.md](ENV_SETUP.md).

Micro frontend entry URLs are configured in `remotes.json` in `rimfrost-portal-bff` (or the Kubernetes ConfigMap pointed to by `REMOTES_CONFIG_PATH` on the BFF), not via environment variables on the portal.

## Project Structure

```
rimfrost-portal-handlaggare/
├── src/
│   ├── components/
│   │   ├── HuvudytaUppgift.vue      # Page header component
│   │   ├── IngenUppgiftVald.vue     # Empty state view
│   │   ├── OppnadUppgift.vue        # Micro FE loader & container
│   │   └── UppgiftLista.vue         # Task list navigation
│   │   ├── ToastContainer.vue       # Toast notification display
│   ├── router/                      # Vue Router configuration
│   ├── stores/
│   │   ├── uppgiftListaStore.ts     # Task list state
│   │   └── handlaggareStore.ts      # Case handler selection state
│   ├── utils/
│   │   ├── loadRemoteModule.ts      # Dynamic MFE loader
│   │   ├── getTilldeladeUppgifter.ts # Fetch assigned tasks
│   │   ├── getNextUppgift.ts        # Fetch next task
│   │   └── transformUppgift.ts      # Data transformation
│   │   ├── useToast.ts              # Toast notification logic
│   ├── config/
│   │   └── remoteRegistry.ts        # MFE manifest loader
│   ├── App.vue                      # Root layout
│   ├── main.ts                      # Entry point
│   ├── pinia.ts                     # Store setup
│   ├── federation.d.ts              # TypeScript declarations for remote modules
│   └── types.ts                     # Type definitions
├── public/
│   └── route-manifest.json          # Local dev fallback only — authoritative registry lives in rimfrost-portal-bff
├── vite.config.ts                   # Vite & Module Federation config
└── package.json                     # Dependencies & scripts
```

### Key Files

- **`src/utils/loadRemoteModule.ts`**: Loads and instantiates remotes dynamically
- **`src/config/remoteRegistry.ts`**: Fetches the remote registry from Portal BFF at runtime; falls back to `public/route-manifest.json` in local dev without a BFF
- **`public/route-manifest.json`**: Local dev fallback registry — the authoritative registry is `remotes.json` in `rimfrost-portal-bff`
- **`src/stores/handlaggareStore.ts`**: Manages selected case handler state
- **`src/components/OppnadUppgift.vue`**: Container that renders the loaded micro frontend

## Remote Micro Frontend Development

### Prerequisites for Your Remote

Your micro frontend must:

1. **Use Module Federation** with `@module-federation/vite`
2. **Declare a unique name** in `vite.config.ts` (e.g., `federation({ name: "yourRemoteApp" })`)
3. **Expose a component** (e.g., `exposes: { "./YourComponent": "./src/components/YourComponent.vue" }`)
4. **Enable manifest generation** and auto publicPath so the runtime resolves chunk URLs correctly:

```typescript
federation({
  manifest: true,
  publicPath: "auto",
  shared: {
    vue: { singleton: true, requiredVersion: "^3.x.x" },
    "@fkui/vue": { singleton: true, requiredVersion: "^6.x.x" },
    pinia: { singleton: true, requiredVersion: "^3.x.x" },
  },
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

1. Start the remote dev server: `npm run dev` (e.g., port 3031)
2. Start the host dev server: `npm run dev` (port 3030)
3. The host fetches the remote's `mf-manifest.json` at runtime — no build step needed for the remote
4. Hot-reload works on both sides

## API Integration

This host app communicates only with the **Portal BFF**:

- `GET /handlaggare` - Fetch available case handlers
- `GET /tasks/:handlaggarId` - Fetch all tasks assigned to a handler
- `POST /tasks/getNext/:handlaggarId` - Fetch the next available task
- `GET /api/route-manifest` - Fetch the micro-frontend remote registry

The Portal BFF fetches from backend services and returns mock data when unavailable.

**Each micro frontend** has its own dedicated Rule BFF (e.g., rimfrost-regel-rtf-manuell-bff) for rule-specific calls:

- `GET /api/:regel/:regeltyp/:handlaggningId` - Fetch decision data
- `POST /api/:regel/:regeltyp/:handlaggningId/patchErsattning` - Submit decisions

Micro frontends communicate with their BFF using the `regeltyp` prop received from the host.

## Docker Deployment

### Using Docker Compose

```bash
# Build and run the container
docker-compose up -d

# Stop the container
docker-compose down
```

The application will be available at `http://localhost:8080`.

### Building Docker Image Manually

```bash
# Build the production app
npm run build

# Build Docker image
docker build -t rimfrost-fe .

# Run container
docker run -p 8080:8080 rimfrost-fe
```

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
