# Centaforce Nuxt Application Documentation

This documentation provides a comprehensive overview of the Centaforce Nuxt application, explaining its architecture, structure, and key features.

## Table of Contents

- [Project Overview](#project-overview)
- [Folder Structure](#folder-structure)
- [Key Features](#key-features)
  - [Layouts and Pages](#layouts-and-pages)
  - [Components](#components)
  - [Composables](#composables)
  - [Internationalization (i18n)](#internationalization-i18n)
  - [Styling with Tailwind CSS](#styling-with-tailwind-css)
- [Development Guidelines](#development-guidelines)
  - [Code Style and Linting](#code-style-and-linting)
  - [Vue Component Structure](#vue-component-structure)
  - [Git Workflow](#git-workflow)
- [Getting Started](#getting-started)

## Project Overview

This project is a Nuxt 3 application that serves as the frontend for the Centaforce platform. It utilizes modern web development practices including:

- **Nuxt 3**: A Vue.js framework for building modern web applications
- **Vue 3 Composition API**: For reactive and organized component logic
- **Tailwind CSS**: For utility-first styling
- **i18n**: For multi-language support (English and Malay)
- **Pinia**: For state management
- **TypeScript**: For type safety throughout the application

## Folder Structure

```
nuxt-app/
├── .husky/                  # Git hooks for code quality checks
├── .nuxt/                   # Nuxt build artifacts (auto-generated)
├── docs/                    # Project documentation
├── i18n/                    # Internationalization files
│   └── locales/             # Translation files by language
│       ├── en/              # English translations
│       └── ms/              # Malay translations
├── src/                     # Source code
│   ├── assets/              # Static assets (CSS, images)
│   │   └── css/
│   ├── components/          # Reusable Vue components
│   │   ├── navigation/      # Navigation-related components
│   │   └── section/         # Section-specific components
│   ├── composables/         # Vue composables for reusable logic
│   ├── layouts/             # Application layouts
│   ├── pages/               # Application pages (routes)
│   │   └── (hdr-pm)/        # Nested routes
│   ├── plugins/             # Nuxt plugins
│   ├── public/              # Static public files
│   └── server/              # Server-side code
│       └── assets/          # Server assets
├── types/                   # TypeScript type definitions
├── .eslintrc.js             # ESLint configuration
├── .prettierrc              # Prettier configuration
├── nuxt.config.ts           # Nuxt configuration
├── package.json             # Project dependencies
├── tailwind.config.js       # Tailwind CSS configuration
└── tsconfig.json            # TypeScript configuration
```

## Key Features

### Layouts and Pages

The application uses Nuxt's layout system for consistent page structures. The main layout is defined in `src/layouts/default.vue` which includes the header and sidebar navigation components.

Pages are organized in the `src/pages` directory, with nested routes using the Nuxt directory-based routing system. The application uses the pattern `(feature)/(subfeature)/(id)/page-name.vue` for organizing pages.

### Components

Components are organized functionally in the `src/components` directory:

- **Navigation components**: Header, sidebar, and other navigation elements
- **Section components**: Components specific to certain sections of the application

Components follow the Vue 3 Composition API pattern and include TypeScript for type safety.

### Composables

Composables are located in the `src/composables` directory and provide reusable logic that can be shared across components. They follow the Vue 3 Composition API pattern with functions that start with "use", such as:

- State management functions
- Utility functions
- API interaction functions

### Internationalization (i18n)

The application uses `@nuxtjs/i18n` for multi-language support:

- Default language: English (en)
- Additional language: Malay (ms)

Translation files are organized by language and feature in the `i18n/locales` directory:

- `en/about.json` & `en/landing.json`
- `ms/about.json` & `ms/landing.json`

Example usage in a component:

```vue
<template>
  <div>
    <h1>{{ $t("welcome.title") }}</h1>
    <p>{{ $t("welcome.message") }}</p>
  </div>
</template>
```

### Styling with Tailwind CSS

The project uses Tailwind CSS for styling, with custom configurations in `tailwind.config.js`. Custom utility classes and overrides are defined in `src/assets/css/tailwind.css`.

Custom background colors and other theme customizations have been added to Tailwind, such as:

```css
.bg-white {
  --tw-bg-opacity: 1;
  background-color: #eef0fd;
}
.bg-blue-50 {
  --tw-bg-opacity: 1;
  background: linear-gradient(90deg, #e8eafb 0%, #c1c7f0 100%);
}
```

## Development Guidelines

### Code Style and Linting

The project enforces code quality through ESLint and Prettier:

#### ESLint Rules

- **No Unused Variables**: Variables declared but not used are flagged
- **Consistent Quotes**: Single quotes are required for strings
- **No Console Logs**: Console logs are restricted in production code
- **TypeScript Strict Checking**: Strict TypeScript rules are enforced

#### Prettier Configuration

- **Line Width**: 80 characters
- **Single Quotes**: For string literals
- **Trailing Commas**: In multi-line objects and arrays
- **Tab-based Indentation**: Rather than spaces

#### Running Linting

```bash
# Check for linting errors
yarn lint

# Fix linting issues automatically
yarn lint --fix
```

### Vue Component Structure

When creating Vue components, follow this structure:

1. **`<script>` Section**:

   - At the top of the file
   - Must use `lang="ts"` for TypeScript
   - Use the `setup` syntax
   - Define all logic, imports, and reactive data

2. **`<template>` Section**:

   - Place after the script section
   - Use semantic HTML
   - Follow proper indentation

3. **`<style>` Section**:
   - Place at the bottom
   - Use `scoped` to prevent style leakage

Example:

```vue
<template>
  <div class="counter">
    <p>Count: {{ count }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>

<script setup lang="ts">
// Imports
import { ref } from "vue";

// State
const count = ref(0);

// Methods
const increment = () => {
  count.value++;
};
</script>

<style scoped>
.counter {
  padding: 1rem;
}
</style>
```

### Git Workflow

The project uses Husky git hooks to ensure code quality:

- **pre-commit**: Runs Prettier and ESLint to ensure code quality before committing
- **post-merge**: Runs after merging to ensure dependencies are up to date

## Getting Started

To start the development server:

```bash
# Install dependencies
yarn install

# Start development server
yarn dev

# Build for production
yarn build

# Preview production build
yarn preview
```

For more information, refer to the [Nuxt 3 documentation](https://nuxt.com/docs).
