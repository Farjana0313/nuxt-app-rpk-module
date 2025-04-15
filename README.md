# Centaforce Nuxt Application

A modern frontend application built with Nuxt 3, Vue 3, TypeScript, and Tailwind CSS.

## Documentation

Detailed documentation is available in the `/docs` directory:

- [Main Documentation](./docs/README.md)
- [Components Documentation](./docs/COMPONENTS.md)
- [Internationalization (i18n)](./docs/I18N.md)
- [Linting and Code Style](./docs/LINTING.md)
- [Composables](./docs/COMPOSABLES.md)
- [Project Structure](./docs/PROJECT_STRUCTURE.md)
- [Docker Configuration](./docs/DOCKER.md)
- [Pinia State Management](./docs/PINIA.md)

## Docker Setup

For more detailed information about Docker configuration, please refer to the [Docker documentation](./docs/DOCKER.md).

## Features

- Nuxt 3 framework
- Vue 3 Composition API
- TypeScript integration
- Tailwind CSS for styling
- Internationalization (English and Malay)
- ESLint and Prettier for code quality
- Responsive layout with sidebar and header
- Pinia state management
- Docker containerization

## Requirements

- Node.js 16.x or higher
- Yarn package manager

## Project Structure

```
nuxt-app/
├── .husky/                  # Git hooks for code quality
├── .nuxt/                   # Nuxt build artifacts
├── docs/                    # Project documentation
├── i18n/                    # Internationalization files
├── src/                     # Source code
│   ├── assets/              # Static assets
│   ├── components/          # Vue components
│   ├── composables/         # Vue composables
│   ├── layouts/             # Application layouts
│   ├── pages/               # Application pages/routes
│   ├── plugins/             # Nuxt plugins
│   └── server/              # Server-side code
└── types/                   # TypeScript type definitions
```
