# Vue Composables Documentation

This document explains how composables are used in the Centaforce Nuxt application and how to create new ones.

## What are Composables?

Composables are reusable functions that encapsulate and reuse stateful logic between Vue components. They follow the Vue 3 Composition API pattern and typically start with "use".

## Benefits of Composables

- **Reusability**: Logic can be shared across multiple components
- **Testability**: Logic can be tested independently of components
- **Separation of Concerns**: UI and business logic are separated
- **Type Safety**: TypeScript can be used to ensure type safety

## Directory Structure

Composables are stored in the `src/composables` directory:

```
src/
└── composables/
    ├── useApi.ts
    ├── useUser.ts
    ├── usePermissions.ts
    └── ...
```

## Creating a Composable

A composable is a JavaScript/TypeScript function that uses Vue's Composition API:

```typescript
// src/composables/useCounter.ts
import { ref, computed } from "vue";

export function useCounter(initialValue = 0) {
  // State
  const count = ref(initialValue);

  // Computed
  const isEven = computed(() => count.value % 2 === 0);

  // Methods
  function increment() {
    count.value++;
  }

  function decrement() {
    count.value--;
  }

  function reset() {
    count.value = initialValue;
  }

  // Return exposed state and methods
  return {
    count,
    isEven,
    increment,
    decrement,
    reset,
  };
}
```

## Common Composable Patterns

### API Interaction

```typescript
// src/composables/useApi.ts
import { ref } from "vue";

export function useApi<T>(url: string) {
  const data = ref<T | null>(null);
  const error = ref<Error | null>(null);
  const loading = ref<boolean>(false);

  const fetchData = async () => {
    loading.value = true;
    error.value = null;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      data.value = await response.json();
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err));
    } finally {
      loading.value = false;
    }
  };

  return {
    data,
    error,
    loading,
    fetchData,
  };
}
```

### State Management

```typescript
// src/composables/useState.ts
import { ref, readonly } from "vue";

export function useState<T>(initialState: T) {
  const state = ref(initialState);

  const setState = (newState: T) => {
    state.value = newState;
  };

  const updateState = (updater: (currentState: T) => T) => {
    state.value = updater(state.value);
  };

  return {
    state: readonly(state),
    setState,
    updateState,
  };
}
```

## Using Composables in Components

```vue
<script setup lang="ts">
import { useCounter } from "@/composables/useCounter";
import { useApi } from "@/composables/useApi";
// Import types from the types folder
import type { User } from "@/types/user";

// Use the counter composable
const { count, increment, decrement } = useCounter(10);

// Use the API composable
const { data: users, loading, error, fetchData } = useApi<User[]>("/api/users");

// Fetch data on component mount
fetchData();

// No need to define User type here as it's imported
</script>

<template>
  <div>
    <!-- Counter component -->
    <div>
      <p>Count: {{ count }}</p>
      <button @click="increment">+</button>
      <button @click="decrement">-</button>
    </div>

    <!-- API data display -->
    <div>
      <p v-if="loading">Loading...</p>
      <p v-else-if="error">Error: {{ error.message }}</p>
      <ul v-else-if="users">
        <li v-for="user in users" :key="user.id">{{ user.name }} ({{ user.email }})</li>
      </ul>
    </div>
  </div>
</template>
```

## Best Practices

1. **Name Consistently**: Always prefix composable functions with "use"
2. **Single Responsibility**: Each composable should have a focused purpose
3. **Return What's Needed**: Only expose values and functions that are needed
4. **Type Everything**: Use TypeScript for better IDE support and type safety
5. **Document**: Add JSDoc comments to explain the purpose and usage
6. **Testing**: Write unit tests for composables

## Testing Composables

Composables can be tested independently using Vue Test Utils:

```typescript
import { useCounter } from "@/composables/useCounter";
import { describe, it, expect } from "vitest";

describe("useCounter", () => {
  it("should initialize with the provided value", () => {
    const { count } = useCounter(5);
    expect(count.value).toBe(5);
  });

  it("should increment the count", () => {
    const { count, increment } = useCounter(0);
    increment();
    expect(count.value).toBe(1);
  });

  it("should decrement the count", () => {
    const { count, decrement } = useCounter(1);
    decrement();
    expect(count.value).toBe(0);
  });

  it("should reset the count", () => {
    const { count, increment, reset } = useCounter(0);
    increment();
    increment();
    expect(count.value).toBe(2);
    reset();
    expect(count.value).toBe(0);
  });
});
```
