# Rimfrost Frontend

A modern task management application built with Vue 3, TypeScript, and Vite. This application provides a user interface for case handlers to manage operational tasks (uppgifter) in a streamlined workflow.

## Features

- **Task Management** - View, manage and process operational tasks
- **Task Assignment** - Fetch and assign new tasks to case handlers
- **Module Federation** - Micro-frontend architecture supporting remote applications
- **FK UI Components** - Built with Försäkringskassan's design system (@fkui/vue)
- **Type Safety** - Full TypeScript support with strict type checking
- **Mock API** - Built-in API mocking for development
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
- **SCSS** - Advanced styling capabilities

## Prerequisites

- Node.js (version 18 or higher recommended)
- npm or yarn

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
   cp .env.example .env.local
   ```

2. Configure your local settings in `.env.local`

### Key Environment Variables

- `VITE_PORT` - Development server port (default: 3030)
- `VITE_UPPGIFTER_API_URL` - Uppgifter service URL
- `VITE_REGEL_API_URL` - Regel service URL
- `VITE_REMOTE_APP_URL` - Remote module federation URL
- `VITE_EXAMPLE_APP_URL` - Example app module federation URL
- `VITE_USE_API` - Toggle between mock and real API

See [ENV_SETUP.md](ENV_SETUP.md) for the complete list of available variables.

## Project Structure

```
rimfrost-fe/
├── src/
│   ├── components/        # Vue components
│   │   ├── AppLank.vue
│   │   ├── HuvudytaUppgift.vue
│   │   ├── IngenUppgiftVald.vue
│   │   ├── OppnadUppgift.vue
│   │   └── UppgiftLista.vue
│   ├── router/           # Vue Router configuration
│   ├── stores/           # Pinia stores
│   ├── utils/            # Utility functions
│   ├── config/           # Configuration files
│   ├── assets/           # Static assets and mock data
│   ├── App.vue           # Root component
│   ├── main.ts           # Application entry point
│   ├── pinia.ts          # Pinia store setup
│   └── types.ts          # TypeScript type definitions
├── mock/                 # API mock responses
├── public/               # Public static assets
├── vite.config.ts        # Vite configuration
└── package.json          # Dependencies and scripts
```

## Module Federation

This application uses Module Federation to support micro-frontend architecture:

- **Host App**: Rimfrost FE (this app)
- **Remote Apps**:
  - `remoteApp` - Configurable via `VITE_REMOTE_APP_URL`
  - `exampleApp` - Configurable via `VITE_EXAMPLE_APP_URL`
- **Shared Dependencies**: Vue, @fkui/vue, Pinia
- **Exposed Modules**: `./pinia` - Shared Pinia store instance

## API Integration

The application proxies requests to backend services:

- `/uppgifter` → Uppgifter API (tasks service)
- `/regel` → Regel API (rules service)

For development, you can use the built-in API mocks located in the `mock/` directory.

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
