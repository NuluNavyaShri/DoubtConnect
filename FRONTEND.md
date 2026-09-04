# Frontend Architecture — DoubtConnect

Purpose: describe how the frontend is organized, how it communicates with the backend, and recommended patterns for components, routing, state, and API integration.

Tech stack
- React 19 + Vite
- Tailwind CSS for styling
- Dev tooling: ESLint, Vite dev server

Component organization
- Entry point: `src/main.jsx` → mounts `App`.
- Current app: `App.jsx` (placeholder). Recommended structure:
	- `src/components/` — small reusable UI components (buttons, inputs, lists)
	- `src/pages/` — top-level route pages (Login, Feed, DoubtDetail, Profile)
	- `src/layouts/` — layout components (Header, Footer, SideNav)
	- `src/hooks/` — custom hooks (e.g., `useAuth`, `useFetch`)
	- `src/services/` — API wrappers and network helpers

Routing
- `react-router-dom` is used for SPA routing. Keep route definitions centralized (e.g., in `App.jsx`) and lazy-load heavy pages to improve load-time.

Defined routes in this project (from `frontend/src/App.jsx`):
 - `/` → `Home`
 - `/signin` → `SignIn`
 - `/signup` → `SignUp`
 - `/dashboard` → `Dashboard`
 - `/profile` → `Profile`
 - `/search` → `Search`
 - `/homepage` → `HomePage`

State management
- Local UI state: `useState` / `useReducer` inside components for ephemeral UI.
- Auth/session state: React Context (`AuthContext`) exposing `user`, `isAuthenticated`, `login()`, `logout()`.
- Server state: React Query or SWR for fetching, caching, and mutating remote data (feeds, doubts, answers).
- Global client store (Redux/Zustand) only if cross-cutting client state becomes complex (e.g., complex offline interactions).

API integration & authentication
- Backend uses an HTTP-only `jwt` cookie. The frontend must send requests with credentials so the browser includes the cookie.
- Centralize API calls in `src/services/api.js` (base URL, error parsing, credentials setting).
- Use `fetch(..., { credentials: 'include' })` or `axios` with `withCredentials=true` for all requests.
- Do NOT attempt to read the `jwt` cookie from JavaScript (HTTP-only). Keep derived auth state client-side (e.g., `isAuthenticated`) and verify with an auth-status endpoint (`GET /auth/me`) if needed.

Error handling and UX
- Surface API errors to users via toasts or inline messages and show loading / retry states.
- Centralize error parsing in the API wrapper so components receive normalized error objects.

Styling
- Tailwind CSS utilities in components; place global tokens in `src/main.css`.
- Extract repeated patterns into small, reusable components to keep markup clean.

Developer workflow
Install and run dev server:
```bash
cd frontend
npm install
npm run dev
```

Build for production:
```bash
npm run build
```

Recommended next steps
- Add `react-router-dom` and a small route tree in `App.jsx`.
- Create `src/services/api.js` with base URL and `credentials: 'include'`.
- Scaffold `src/context/AuthContext.jsx` to manage auth state and session checks.

Last updated: February 2026

