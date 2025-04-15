# Pinia State Management Documentation

This document explains how Pinia state management is implemented and used in the Centaforce Nuxt application.

## Overview

The application uses Pinia for state management, which is the official state management solution for Vue 3. Pinia offers:

- TypeScript support with autocompletion
- Devtools support
- Strong typing for store actions, state, and getters
- Simple and intuitive API
- Modular design with composable stores

## Pinia Setup

Pinia is integrated with Nuxt using the `@pinia/nuxt` module in our `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  // ... other config
  modules: [
    // ... other modules
    "@pinia/nuxt",
  ],
  // ... rest of config
});
```

## Store Organization

Stores are organized in the `src/stores` directory, following a feature-based approach:

```
src/
└── stores/
    ├── contacts/
    │   ├── contact.ts       # Contact store implementation
    │   └── types/
    │       └── types.ts     # TypeScript types for the contact store
    └── (other feature stores)
```

## Store Structure

Each store typically follows this structure:

1. **State**: The reactive state of the store
2. **Actions**: Methods to mutate the state
3. **Getters**: Computed state derived from the store state

Here's the structure of our contact store:

```typescript
import type { GetContact } from "@/types/contact";
import { defineStore } from "pinia";
import type { ContactActions, ContactState } from "./types/types";

export const useContactStore = defineStore<"contact", ContactState, {}, ContactActions>("contact", {
  state: () => ({
    contacts: [],
    filteredContact: [],
    loading: false,
  }),
  actions: {
    setLoading(isLoading: boolean) {
      this.loading = isLoading;
    },
    resetLoading() {
      this.loading = false;
    },
    setContacts(contacts: GetContact[]) {
      this.contacts = contacts;
    },
    resetContacts() {
      this.contacts = [];
    },
    getFilteredContact(contact: GetContact[]) {
      this.filteredContact = contact;
    },
    resetFilterContact() {
      this.filteredContact = [];
    },
  },
});
```

## TypeScript Integration

Pinia stores in this project use TypeScript for type safety. Store types are defined in separate type files:

```typescript
// src/stores/contacts/types/types.ts
import type { GetContact } from "@/types/contact";

export interface ContactState {
  contacts: GetContact[] | [];
  filteredContact: GetContact[] | [];
  loading: boolean;
}

export interface ContactActions {
  setLoading(isLoading: boolean): void;
  resetLoading(): void;
  setContacts(contacts: GetContact[]): void;
  resetContacts(): void;
  getFilteredContact(contact: GetContact[]): void;
  resetFilterContact(): void;
}
```

## Using Stores in Components and Composables

### In Composables

Stores can be used in composables to create reusable logic:

```typescript
// src/composables/useContacts.ts
import { useContactStore } from "@/stores/contacts/contact";
import { contactApi } from "@/api/contact/contactApi";
import type { ContactSearchParams, GetContact } from "@/types/contact";
import { storeToRefs } from "pinia";
import type { Ref } from "vue";

export const useContacts = (): {
  searchContacts: (params: ContactSearchParams) => Promise<void>;
  getContacts: () => Promise<void>;
  loading: Ref<boolean>;
  contacts: Ref<GetContact[] | []>;
  resetContacts: () => Promise<void>;
  filteredContact: Ref<GetContact[] | []>;
} => {
  const contactStore = useContactStore();
  const { setLoading, setContacts, getFilteredContact } = contactStore;
  const { contacts, loading, filteredContact } = storeToRefs(contactStore);

  const searchContacts = async (params: ContactSearchParams): Promise<void> => {
    try {
      setLoading(true);
      const result = await contactApi.contactSearch(params);
      getFilteredContact(result);
    } catch (error) {
      console.error("Error searching contacts:", error);
    } finally {
      setLoading(false);
    }
  };

  // ... other methods

  return {
    searchContacts,
    getContacts,
    loading,
    contacts,
    resetContacts,
    filteredContact,
  };
};
```

### In Components

Using stores in components:

We will not use any thing about Pinia in view or components. We must use throw composables.

## Store Patterns

### State Reset

Stores include reset methods to clear state. You must keep a reset option with every actions.

```typescript
resetContacts() {
  this.contacts = [];
}
```

### Loading State Management

Stores handle loading states for API operations:

```typescript
setLoading(isLoading: boolean) {
  this.loading = isLoading;
}
```

### Using storeToRefs

Always use `storeToRefs` when you need to maintain reactivity for store properties:

```typescript
import { storeToRefs } from "pinia";

// Correct - maintains reactivity
const { contacts, loading } = storeToRefs(contactStore);

// Wrong - loses reactivity
const { contacts, loading } = contactStore;
```

## Advanced Patterns

### Store Composition

Stores can be composed together using other stores:

```typescript
export const useUserStore = defineStore("user", {
  // ... user store implementation
});

export const useCartStore = defineStore("cart", () => {
  // Use another store
  const userStore = useUserStore();

  // Reference the user store's state
  const addItemToCart = (item) => {
    if (userStore.isAuthenticated) {
      // Add item logic
    }
  };

  return {
    addItemToCart,
  };
});
```

### Store Hydration & Persistence

For persisting store state across page reloads:

```typescript
import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";

export const usePersistedStore = defineStore("persisted", {
  state: () => ({
    counter: useStorage("counter", 0),
    preferences: useStorage("preferences", {
      theme: "light",
    }),
  }),
  // actions, getters, etc.
});
```

## Best Practices

1. **Separate Types**: Keep store types in separate files for clarity
2. **Use storeToRefs**: Always use storeToRefs for reactive state
3. **Feature-Based Organization**: Organize stores by feature
4. **Composables Integration**: Create composables that use stores for additional functionality
5. **Specific Actions**: Create specific actions rather than exposing the raw state
6. **Reset Methods**: Provide methods to reset store state
7. **Loading State**: Include loading states for asynchronous operations
8. **Avoid Circular Dependencies**: Be careful not to create circular dependencies between stores
9. **TypeScript Integration**: Leverage TypeScript for type safety and autocompletion
