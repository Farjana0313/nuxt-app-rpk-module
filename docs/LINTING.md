# Linting and Code Style Documentation

This document outlines the linting rules and code style guidelines for the Centaforce Nuxt application.

## Overview

The project uses ESLint and Prettier to maintain code quality and consistency. Linting rules are enforced through:

- ESLint configuration in `eslint.config.js`
- Prettier configuration
- Husky git hooks to ensure code quality before commits

## ESLint Configuration

The project uses a modern flat ESLint configuration file (`eslint.config.js`). Key configurations include:

### General Rules

- **No unused variables**: Variables declared but not used are flagged
- **No explicit any**: TypeScript's `any` type is disallowed to maintain type safety
- **Limited console usage**: Console logs are restricted (only `console.error` is allowed)

```js
"no-console": [
  "error",
  {
    allow: ["error"], // Allow console.error
  },
],
```

### Vue-Specific Rules

- **Component naming**: Enforces consistent naming for Vue components
- **Props declarations**: Type-based props declarations are required
- **Vue file structure**: Enforces a consistent structure for Vue files

```js
"vue/define-props-declaration": ["error", "type-based"],
```

### TypeScript Rules

- **Strict typing**: TypeScript rules are enforced to maintain type safety
- **No explicit any**: The `any` type is disallowed

```js
"@typescript-eslint/no-explicit-any": "error",
```

## Prettier Configuration

Prettier is configured to ensure consistent code formatting:

- **Line Width**: 80 characters
- **Single Quotes**: For string literals
- **Trailing Commas**: In multi-line objects and arrays (ES5 compatible)
- **Tab-based Indentation**: Rather than spaces

## Running Linting

You can check and fix linting issues using the following commands:

```bash
# Check for linting errors
yarn lint

# Fix linting issues automatically
yarn lint --fix
```

## Git Hooks with Husky

The project uses Husky to run linting checks on git hooks:

- **pre-commit**: Runs Prettier and ESLint before allowing a commit

```bash
# Content of .husky/pre-commit
yarn prettier
git add .
yarn lint
```

This ensures that all committed code meets the project's code style and quality standards.

## Vue Component Structure

For Vue files, follow this sequence for better readability:

1. **`<template>` Section**:

   - Place after the script section
   - Use clean, semantic HTML
   - Maintain proper indentation

2. **`<script lang="ts">` Section**:

   - Place at the top
   - Use `setup` syntax with TypeScript
   - Define all imports, props, and logic
   - `lang="ts"` must be added

3. **`<style>` Section**:
   - Place at the bottom
   - Use `scoped` attribute

Example:

```vue
<template>
  <div class="counter">
    <p>Current count: {{ count }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>

<script setup lang="ts">
// Imports
import { ref } from "vue";

// State
const count = ref(0);

// Methods
function increment() {
  count.value++;
}
</script>

<style scoped>
.counter {
  margin: 1rem 0;
}
</style>
```

## Best Practices

1. **Keep Components Focused**: Each component should have a single responsibility
2. **Use TypeScript**: TypeScript adds type safety and improves code quality
3. **Follow Vue Style Guide**: Follow the [Vue Style Guide](https://vuejs.org/style-guide/)
4. **Document Complex Logic**: Add comments for complex logic
5. **Run Linting Regularly**: Don't wait until commit time to run linting

## Troubleshooting Common Issues

### ESLint and Prettier Conflicts

If you experience conflicts between ESLint and Prettier:

1. Make sure you're using the latest configurations
2. Check for overlapping rules
3. Let Prettier handle formatting concerns and ESLint handle code quality concerns

### TypeScript Errors

For TypeScript-related errors:

1. Ensure you've properly typed your variables and functions
2. Use type assertions only when necessary
3. Avoid using `any` type - use proper typing instead

### Fixing Husky Issues

If Husky hooks aren't running:

1. Make sure Husky is installed (`yarn add -D husky`)
2. Ensure hooks are executable (`chmod +x .husky/*`)
3. Verify git hooks are enabled in your git config
