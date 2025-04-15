# Project Structure Documentation

This document provides a detailed overview of the Centaforce Nuxt application's project structure.

## Overview

The Centaforce Nuxt application follows a modular structure to organize code efficiently. The project is built with Nuxt 3, Vue 3, TypeScript, and follows modern best practices.

## Directory Structure

```
nuxt-app/
├── .husky/                  # Git hooks for code quality
├── .nuxt/                   # Nuxt build artifacts (auto-generated)
├── docs/                    # Project documentation
├── i18n/                    # Internationalization files
│   └── locales/             # Translation files
│       ├── en/              # English translations
│       └── ms/              # Malay translations
├── node_modules/            # Dependencies (auto-generated)
├── src/                     # Source code
│   ├── assets/              # Static assets
│   │   └── css/             # CSS files including Tailwind
│   ├── components/          # Reusable Vue components
│   │   ├── ui/              # UI components (buttons, inputs, cards)
│   │   ├── layout/          # Layout components (header, footer, sidebar)
│   │   ├── feature/         # Feature-specific components
│   │   │   ├── auth/        # Authentication related components
│   │   │   └── dashboard/   # Dashboard related components
│   │   └── common/          # Shared components used across features
│   ├── composables/         # Vue composables
│   ├── layouts/             # Application layouts
│   ├── pages/               # Application pages (routes)
│   │   └── (hdr-pm)/        # Nested routes with parenthesis for grouping
│   ├── plugins/             # Nuxt plugins
│   ├── public/              # Static public files
│   └── server/              # Server-side code
│       └── assets/          # Server assets
├── types/                   # TypeScript type definitions
├── .eslintrc.js             # ESLint configuration
├── .gitignore               # Git ignore file
├── .prettierrc              # Prettier configuration
├── eslint.config.js         # ESLint flat configuration
├── nuxt.config.ts           # Nuxt configuration
├── package.json             # Project dependencies
├── README.md                # Project README
├── tailwind.config.js       # Tailwind CSS configuration
└── tsconfig.json            # TypeScript configuration
```

## Key Directories Explained

### `/src` Directory

The `/src` directory contains the main source code of the application.

#### `/src/assets`

Contains static assets like CSS, images, fonts, etc.

- `/src/assets/css/tailwind.css`: Contains Tailwind CSS configuration and custom styles

#### `/src/components`

Contains reusable Vue components organized by function and feature:

- `/src/components/ui`: UI components like buttons, inputs, and cards
  - `Button.vue`: Reusable button component
  - `Card.vue`: Card display component
  - `Input.vue`: Form input component
- `/src/components/layout`: Layout components
  - `AppHeader.vue`: Application header
  - `AppFooter.vue`: Application footer
  - `Sidebar.vue`: Side navigation component
- `/src/components/feature`: Feature-specific components
  - `/feature/auth`: Authentication components
    - `LoginForm.vue`: Login form component
    - `SignupForm.vue`: Signup form component
  - `/feature/dashboard`: Dashboard components
    - `StatCard.vue`: Statistics card component
    - `ActivityFeed.vue`: Activity display component
- `/src/components/common`: Shared utility components
  - `LoadingSpinner.vue`: Loading indicator
  - `ErrorMessage.vue`: Error display component

#### `/src/layouts`

Contains application layouts:

- `default.vue`: The default layout with header and sidebar

#### `/src/pages`

Contains application pages that map to routes based on their file path:

- `index.vue`: The homepage
- `(hdr-pm)/(db)/(01)/test-db-01.vue`: Example of nested route using the parenthesis grouping pattern. The grouping is based on the module name

Routes are automatically generated based on the file structure:

- Files in `pages/` directory become routes
- The parenthesis notation `(folder-name)` is used for route grouping without affecting the URL path

#### `/src/composables`

Contains Vue 3 composables for reusable logic.

#### `/src/plugins`

Contains Nuxt plugins for extending the application.

### `/i18n` Directory

Contains translation files organized by language:

- `/i18n/locales/en`: English translations
- `/i18n/locales/ms`: Malay translations

Each language directory contains JSON files organized by feature (e.g., about.json, landing.json).

### `/docs` Directory

Contains project documentation organized by topic:

- `README.md`: Main documentation
- `COMPONENTS.md`: Components documentation
- `I18N.md`: Internationalization documentation
- `LINTING.md`: Linting and code style documentation
- `COMPOSABLES.md`: Composables documentation

### Configuration Files

- `nuxt.config.ts`: Main Nuxt configuration
- `tailwind.config.js`: Tailwind CSS configuration
- `eslint.config.js`: ESLint configuration
- `tsconfig.json`: TypeScript configuration
- `.prettierrc`: Prettier configuration

## File Naming Conventions

- **Vue Components**: PascalCase for component filenames (e.g., `Header.vue`, `SearchPanel.vue`)
- **JavaScript/TypeScript Files**: camelCase for utility files (e.g., `useApi.ts`, `formatDate.js`)
- **Translation Files**: lowercase with feature name (e.g., `about.json`, `landing.json`)

## Routing System

Nuxt uses file-based routing where files in the `pages/` directory become routes:

- `pages/index.vue` → `/`
- `pages/about.vue` → `/about`
- `pages/(hdr-pm)/(db)/(01)/test-db-01.vue` → `/test-db-01`

The parenthesis notation is used for route grouping without affecting the URL path.

## TypeScript Integration

The project uses TypeScript for type safety:

- `tsconfig.json` contains TypeScript configuration
- Vue components use `<script setup lang="ts">` for TypeScript support
- `types/` directory contains custom type definitions

## Build and Development

The application uses Nuxt's build system:

- Development mode: `yarn dev`
- Production build: `yarn build`
- Preview production: `yarn preview`

## Git Hooks

The `.husky` directory contains git hooks:

- `pre-commit`: Runs Prettier and ESLint before committing
- Other hooks for various git events
