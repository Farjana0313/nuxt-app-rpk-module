# Naming Conventions

This guide outlines the naming conventions to follow in this project for maintainable and scalable code.

---

## 🧱 Folder & File Naming

- Use **kebab-case** for all folder and file names.
- Keep directory names meaningful and grouped by **function**, **sub-function**, and **activity**.

### Example:

```
/features/
  user-management/
    auth/
      login.vue
      reset-password.vue
      otp.vue
```

---

## 🔧 Components

- Use **PascalCase** for component file names and definitions.
- Prefix reusable components with context if needed (e.g., `UserCard.vue`, `AuthForm.vue`).
- Local-only components can use lowercase if inline (optional).

### Example:

```
/components/
  BaseButton.vue
  ModalConfirm.vue
```

---

## 🧠 Composables

- Use **camelCase** for filenames and function names.
- Prefix with `use`.

### Example:

```
/composables/
  useAuth.js
  useUserSettings.js
```

---

## 📦 Stores (if using Pinia)

- Use **camelCase** for file and store id.
- Prefix store name with feature or domain.

### Example:

```
/stores/
  userStore.js   // defineStore('userStore', ...)
```

---

## 📡 API Layer

- Use **camelCase** for API functions.
- Group by domain or feature.
- Organize like `/api/<feature>/<endpoint>.ts`.

### Example:

```
/api/
  auth/
    login.ts
    resetPassword.ts
  users/
    fetchList.ts
    updateProfile.ts
```

---

## 📄 Types & Interfaces

- Use **PascalCase** for TypeScript types.
- Name DTOs clearly as:
  - `LoginRequestDto`
  - `LoginResponseDto`
  - `UserModel`

### Example:

```
/types/
  auth/
    LoginRequestDto.ts
    LoginResponseDto.ts
  user/
    UserModel.ts
```

---

## 🔁 Transformers / Mappers

- Only create if DTO and model differ.
- Use **camelCase** and group under `transformers/`.

---

## 🎯 Pages & Routing

- Pages follow the file system routing pattern.
- Use **kebab-case** and **end-page-name** in routes.
- Hide nested structure using parentheses when necessary.

### Example:

```
/pages/
  (user-management)/
    (auth)/
      login.vue            --> /login
      reset-password.vue   --> /reset-password
```

---

## ✅ Tests

- Use **.spec.ts** or **.test.ts** suffix.
- Mirror structure of code being tested.

```
/tests/
  unit/
    components/
      ModalConfirm.spec.ts
  e2e/
    login.spec.ts
```

---

## 📜 CSS / SCSS / Tailwind Utilities

- Use **kebab-case**.
- Group styles by feature or layout type.

---

## ⏳ Async & Loading States

- Use suffix like `isLoading`, `isSubmitting`, `hasError`.

```ts
const isLoading = ref(false);
const hasError = ref(false);
```

---

## 🧾 JSON & TypeScript Type Properties (CamelCase Convention)

### JSON Keys (from API)

- ✅ Use **camelCase** for all API responses and requests.

```json
{
  "userId": 101,
  "firstName": "Nesar",
  "lastName": "Uddin",
  "authToken": "abc123"
}
```

### TypeScript DTOs and Models

```ts
// types/dto/LoginRequestDto.ts
export interface LoginRequestDto {
  username: string;
  password: string;
}

// types/dto/LoginResponseDto.ts
export interface LoginResponseDto {
  userId: number;
  firstName: string;
  lastName: string;
  authToken: string;
}
```

```ts
// types/models/UserModel.ts
export interface UserModel {
  userId: number;
  firstName: string;
  lastName: string;
  authToken: string;
}
```

---

## 🔁 Summary of Property Naming

| Context                  | Convention | Example                      |
| ------------------------ | ---------- | ---------------------------- |
| JSON from API            | camelCase  | `userId`, `authToken`        |
| TypeScript DTO Interface | camelCase  | `userId`, `firstName`        |
| TypeScript Model         | camelCase  | `userId`, `authToken`        |
| Component Props          | camelCase  | `userId`, `isLoading`        |
| Composable Return Values | camelCase  | `data`, `error`, `isLoading` |
