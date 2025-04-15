# Components Documentation

This document provides information about the components used in the Centaforce Nuxt application.

## Best Practices for Creating New Components

1. **Focused Responsibility**: Each component should have a single responsibility
2. **Props Validation**: Always use TypeScript for props validation
3. **Event Handling**: Use emits option to document events
4. **Composables**: Extract complex logic into composables
5. **Styling**: Use Tailwind classes but extract repeated patterns to component classes

## Folder Structure

### Components Organization

```
components/
├── ui/                 # UI components (buttons, inputs, cards)
│   ├── Button.vue
│   ├── Card.vue
│   └── Input.vue
├── layout/             # Layout components (header, footer, sidebar)
│   ├── AppHeader.vue
│   ├── AppFooter.vue
│   └── Sidebar.vue
├── feature/            # Feature-specific components
│   ├── auth/           # Authentication related components
│   │   ├── LoginForm.vue
│   │   └── SignupForm.vue
│   └── dashboard/      # Dashboard related components
│       ├── StatCard.vue
│       └── ActivityFeed.vue
└── common/             # Shared components used across features
    ├── LoadingSpinner.vue
    └── ErrorMessage.vue
```

### Auto-imports

Nuxt automatically imports components from the `components/` directory. The import path follows the directory structure:

- `components/Button.vue` → `<Button />`
- `components/ui/Card.vue` → `<UiCard />`
- `components/feature/auth/LoginForm.vue` → `<FeatureAuthLoginForm />`

### Naming Conventions

- Use PascalCase for component filenames (e.g., `Button.vue`, not `button.vue`)
- Prefix components with feature/module name when appropriate
- Use self-descriptive names that indicate the component's purpose
- For nested components that are specific to a parent component:
  ```
  components/
  └── ProductList.vue
  └── ProductList/       # Nested components specific to ProductList
      ├── Item.vue       # Used as <ProductListItem />
      └── Filter.vue     # Used as <ProductListFilter />
  ```

### Component Registration

Nuxt 3 handles component registration automatically. You don't need to manually import or register components in most cases.

### Component Template

```vue
<script setup lang="ts">
// Define props with TypeScript
interface Props {
  title: string;
  items: Array<{ id: number; name: string }>;
}

const props = defineProps<Props>();

// Define emits
const emit = defineEmits<{
  (e: "select", item: { id: number; name: string }): void;
}>();

// Component logic
const handleSelect = (item: { id: number; name: string }) => {
  emit("select", item);
};
</script>

<template>
  <div class="my-component">
    <h2 class="text-lg font-bold">{{ props.title }}</h2>
    <ul>
      <li
        v-for="item in props.items"
        :key="item.id"
        class="p-2 hover:bg-gray-100 cursor-pointer"
        @click="handleSelect(item)"
      >
        {{ item.name }}
      </li>
    </ul>
  </div>
</template>
```
