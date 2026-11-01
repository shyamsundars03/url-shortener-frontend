# URL Shortener — Frontend

A modern, responsive React SPA for the URL Shortener platform. Built with **React 18**, **TypeScript**, **Vite**, and **React Router v6**. Communicates with the NestJS backend via an Axios service layer.

---

## Table of Contents

- [Overview](#overview)
- [How URL Shortening Works (Frontend Side)](#how-url-shortening-works-frontend-side)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Key Design Decisions](#key-design-decisions)
- [Pages & Routes](#pages--routes)
- [Constants](#constants)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)

---

## Overview

The frontend provides:

- **Authentication flows** — email/password register & login, Google OAuth 2.0
- **URL dashboard** — create short links, search, paginate, copy links
- **Automatic token refresh** — silent refresh via Axios interceptor
- **Session persistence** — JWT stored in `localStorage`, decoded to user profile
- **Protected routes** — unauthenticated users redirected to `/login`

---

## How URL Shortening Works (Frontend Side)

### Creating a Short URL

1. User types a long URL (e.g. `https://www.example.com/very/long/path`) into `CreateUrlForm`
2. `CreateUrlForm` calls `createUrl({ originalUrl })` from `urls.service.ts`
3. The service POSTs to `POST /link` (via `URL_ENDPOINTS.CREATE`)
4. The backend returns the full short URL (e.g. `http://localhost:3001/aB3xY9`)
5. `UrlList` displays this with a **Copy** button — clicking copies `shortUrlFull` to clipboard

### Redirecting via a Short Link

The **redirect is entirely handled by the backend**. When a user visits `http://localhost:3001/aB3xY9`:
- The backend resolves the short code `aB3xY9` → original URL
- Issues a `302 Found` redirect to the original destination
- The frontend never gets involved — the user lands directly on the original site

### Visit Tracking Display

Each URL card in `UrlList` shows how many times the short link has been visited. This comes from the `lastVisited` array in the API response — an array of ISO timestamp strings, one per visit. The frontend counts `lastVisited.length` to display the visit count.

### Search & Pagination

The `HomePage` uses `useUrls` hook which manages:
- **Page** and **limit** state (default 10 per page)
- **Debounced search** — waits 1 second after typing before sending `GET /link?search=<term>`
- **Polling** — refetches every 10 seconds to keep the list fresh

```
GET /link?page=1&limit=10&search=github
```

The backend does a case-insensitive regex match on `originalUrl`.

---

## Tech Stack

| Category | Technology |
|----------|-----------|
| Build Tool | Vite |
| Framework | React 18 |
| Language | TypeScript |
| Routing | React Router v6 |
| HTTP Client | Axios |
| Linting | ESLint + `typescript-eslint` (strict mode) |
| Styling | Vanilla CSS (`App.css`, `index.css`) |

---

## Architecture

The frontend is organised into clear, separated layers:

```
┌─────────────────────────────────────────────────────────────┐
│                      Pages / Views                          │
│   HomePage  LoginPage  RegisterPage  OAuthCallbackPage      │
└──────────────────────────┬──────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                Contexts & Custom Hooks                      │
│   AuthContext (session state)    useUrls (URL state)        │
└──────────────────────────┬──────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                    Service Layer                            │
│   auth.service.ts          urls.service.ts                 │
│   (uses AUTH_ENDPOINTS.*)  (uses URL_ENDPOINTS.*)          │
└──────────────────────────┬──────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                    Axios Instance (api.ts)                  │
│   • Attaches Bearer token to every request                  │
│   • Auto-refreshes expired access tokens (401 interceptor)  │
│   • Queues failed requests during refresh                   │
└──────────────────────────┬──────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                    Backend REST API                         │
│                 http://localhost:3001                       │
└─────────────────────────────────────────────────────────────┘
```

---

## Project Structure

```
frontend/
├── index.html
├── vite.config.ts
├── tsconfig.app.json
├── tsconfig.node.json
├── eslint.config.js
│
└── src/
    ├── main.tsx                    # React root, AuthProvider wrapper
    ├── App.tsx                     # Router + Route definitions (uses APP_ROUTES)
    ├── App.css                     # Global component styles
    ├── index.css                   # CSS reset + base typography
    │
    ├── config/
    │   └── env.ts                  # Typed env variable access (VITE_API_BASE_URL)
    │
    ├── constants/                  # Single source of truth for all string literals
    │   ├── api-endpoints.ts        # AUTH_ENDPOINTS, URL_ENDPOINTS (backend API paths)
    │   ├── app-routes.ts           # APP_ROUTES (frontend navigation paths)
    │   └── storage.keys.ts         # ACCESS_TOKEN_STORAGE_KEY, REFRESH_TOKEN_STORAGE_KEY
    │
    ├── types/
    │   ├── api.types.ts            # ApiResponse<T> — matches backend wrapper shape
    │   ├── user.types.ts           # User, AuthResponse, LoginCredentials, RegisterPayload
    │   └── url.types.ts            # Url, CreateUrlRequest, PaginatedUrlsResponse
    │
    ├── services/
    │   ├── api.ts                  # Axios instance + request/response interceptors
    │   ├── auth.service.ts         # register, login, logout, refresh, Google OAuth helpers
    │   └── urls.service.ts         # createUrl, getUserUrls
    │
    ├── contexts/
    │   ├── AuthContext.tsx          # User state, login/logout/register actions
    │   └── ToastContext.tsx         # Global toast notification system
    │
    ├── hooks/
    │   ├── useAuth.ts              # Consume AuthContext safely
    │   └── useUrls.ts              # URL list state, pagination, search, CRUD
    │
    ├── pages/
    │   ├── HomePage.tsx            # Dashboard: URL creation + list (auth-gated)
    │   ├── LoginPage.tsx           # Login form + Google sign-in
    │   ├── RegisterPage.tsx        # Registration form
    │   ├── OAuthCallbackPage.tsx   # Handles Google OAuth token from query string
    │   └── NotFoundPage.tsx        # 404 page
    │
    ├── components/
    │   ├── auth/
    │   │   ├── LoginForm.tsx
    │   │   ├── RegisterForm.tsx
    │   │   └── GoogleSignInButton.tsx
    │   └── urls/
    │       ├── CreateUrlForm.tsx
    │       └── UrlList.tsx
    │
    └── utils/
        ├── jwt.util.ts             # Decode JWT → User (no external library)
        ├── validation.util.ts      # Email, password validators
        └── axios-error.util.ts     # Extract readable messages from AxiosError
```

---

## Key Design Decisions

### 1. Constants for Every String Literal

No route or endpoint string is ever hardcoded in component files.

**API endpoints** (`constants/api-endpoints.ts`):
```typescript
export const AUTH_ENDPOINTS = {
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  REFRESH: '/auth/refresh',
  LOGOUT: '/auth/logout',
  GOOGLE: '/auth/google',
} as const;

export const URL_ENDPOINTS = {
  CREATE: '/link',
  LIST: '/link',
  COUNT: '/link/count',
} as const;
```

**Frontend app routes** (`constants/app-routes.ts`):
```typescript
export const APP_ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  AUTH_CALLBACK: '/auth/callback',
  NOT_FOUND: '/404',
} as const;
```

Used everywhere:
```tsx
<Route path={APP_ROUTES.LOGIN} element={<LoginPage />} />
<Link to={APP_ROUTES.REGISTER}>Create an account</Link>
void navigate(APP_ROUTES.HOME);
window.location.assign(APP_ROUTES.LOGIN);
```

---

### 2. ApiResponse\<T\> Type Matches Backend

The backend wraps every response in `{ success, message, data }`. The frontend's `ApiResponse<T>` mirrors this exactly:

```typescript
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
```

Each service function unwraps the inner `data.data`:
```typescript
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const { data } = await api.post<ApiResponse<AuthResponse>>(
    AUTH_ENDPOINTS.LOGIN,
    credentials,
  );
  return data.data; // ← unwrap the envelope
}
```

---

### 3. Axios Interceptors in api.ts

The shared Axios instance (`services/api.ts`) handles:

- **Request interceptor** — attaches `Authorization: Bearer <token>` to every request
- **401 response interceptor** — silently refreshes the access token and retries the original request
- **Queue management** — parallel requests that arrive while a refresh is in progress are queued and retried after the new token is available
- **Type-safe error handling** — `error: unknown` narrowed with `axios.isAxiosError()` to satisfy strict ESLint rules

```typescript
// RetriableRequest extends InternalAxiosRequestConfig with _retry flag
interface RetriableRequest extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

api.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error)) {
      return Promise.reject(
        error instanceof Error ? error : new Error('API request failed'),
      );
    }
    const originalRequest = error.config as RetriableRequest | undefined;
    // ... silent refresh logic
  }
);
```

---

### 4. AuthContext Session Management

`AuthContext` manages the entire session lifecycle:

| Action | What happens |
|--------|-------------|
| `login()` | Calls backend, stores tokens in `localStorage`, decodes JWT → `User` |
| `register()` | Calls backend, returns confirmation message (no auto-login) |
| `logout()` | Calls backend, clears `localStorage`, resets user state |
| `completeOAuthLogin()` | Called by `OAuthCallbackPage` after Google OAuth redirect with token query params |

JWT is decoded client-side using `utils/jwt.util.ts` — no external JWT library needed.

---

### 5. Strict TypeScript + ESLint

`eslint.config.js` enforces the full `recommendedTypeChecked` ruleset plus:

```javascript
'@typescript-eslint/no-explicit-any': 'error',
'@typescript-eslint/no-unsafe-assignment': 'error',
'@typescript-eslint/no-unsafe-member-access': 'error',
'@typescript-eslint/no-unsafe-call': 'error',
'@typescript-eslint/no-unsafe-return': 'error',
'@typescript-eslint/no-unsafe-argument': 'error',
```

All `any` is banned — every value must be properly typed or narrowed.

---

## Pages & Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `HomePage` | Dashboard — shows hero for guests, URL manager for authenticated users |
| `/login` | `LoginPage` | Email/password login + Google sign-in button |
| `/register` | `RegisterPage` | Account creation form |
| `/auth/callback` | `OAuthCallbackPage` | Reads `?token=&refresh=` from query string after Google OAuth |
| `/404` | `NotFoundPage` | Not found page |
| `*` | `NotFoundPage` | Catch-all fallback |

---

## Constants

### `constants/api-endpoints.ts`
All **backend API paths** used by Axios service functions. If the backend changes a route, update only this file.

### `constants/app-routes.ts`
All **frontend navigation paths** used in `<Route path>`, `<Link to>`, `navigate()`, and `window.location.assign()`. If a page's URL changes, update only this file.

### `constants/storage.keys.ts`
`localStorage` key names:
- `ACCESS_TOKEN_STORAGE_KEY` — stores the short-lived JWT access token
- `REFRESH_TOKEN_STORAGE_KEY` — stores the long-lived refresh token

---

## Environment Variables

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_BASE_URL=http://localhost:3001
```

Access in code via the typed config helper:
```typescript
import { env } from '../config/env';
// env.apiBaseUrl → 'http://localhost:3001'
```

> ⚠️ All Vite env variables must be prefixed with `VITE_` to be accessible in the browser bundle.

---

## Getting Started

### Prerequisites
- Node.js ≥ 18
- Backend server running (see `backend/README.md`)

### Installation

```bash
cd frontend
npm install
```

### Run in Development

```bash
npm run dev
```

App starts at **http://localhost:3000**

### Build for Production

```bash
npm run build
```

Output goes to `dist/`. Serve with any static file server or hosting platform.

---

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Type-check + compile to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint across all `.ts` / `.tsx` files |
