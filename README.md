# Cashevide Web

The web app for **Cashevide** — a privacy-first invoicing and client-management platform for freelancers, letting them track clients, products, and invoices, and keep tabs on payments, without exposing their data to third parties.

Built with React 19, TypeScript, Vite, and Tailwind CSS v4.

## Features

- **Authentication** — email/password login and signup, Google OAuth, password reset via OTP
- **Onboarding** — guided setup flow for new freelancer accounts
- **Client management** — create, edit, view, and archive clients
- **Product/service catalog** — manage billable products and services, with archive support
- **Invoicing** — create, edit, and track invoices against clients and products
- **Business profile** — manage the freelancer's business identity shown on invoices
- **Settings** — account, security, app preferences, and legal document access
- **Legal gate** — enforces acceptance of up-to-date legal documents before app access
- **Support/donation flow** — in-app prompts for supporting the project
- **Design system** — a dedicated `/design-system` route tree documenting shared UI primitives (buttons, inputs, badges, modals, colors, typography, etc.)
- **PWA support** — installable as a standalone app via `vite-plugin-pwa`
- **i18n-ready content layer** — English and Malayalam content sources under `src/content`

## Tech Stack

| Purpose                | Library                                                                                                             |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------- |
| UI framework           | [React 19](https://react.dev/)                                                                                      |
| Language               | [TypeScript](https://www.typescriptlang.org/)                                                                       |
| Build tool             | [Vite](https://vite.dev/)                                                                                           |
| Styling                | [Tailwind CSS v4](https://tailwindcss.com/)                                                                         |
| Routing                | [React Router v8](https://reactrouter.com/)                                                                         |
| Server state / caching | [TanStack Query](https://tanstack.com/query)                                                                        |
| Client state           | [Zustand](https://zustand.docs.pmnd.rs/)                                                                            |
| HTTP client            | [Axios](https://axios-http.com/)                                                                                    |
| Auth                   | [@react-oauth/google](https://www.npmjs.com/package/@react-oauth/google)                                            |
| Icons                  | [Heroicons](https://heroicons.com/), [Lucide](https://lucide.dev/)                                                  |
| Markdown rendering     | [react-markdown](https://github.com/remarkjs/react-markdown) + [remark-gfm](https://github.com/remarkjs/remark-gfm) |
| Linting                | [oxlint](https://oxc.rs/)                                                                                           |
| PWA                    | [vite-plugin-pwa](https://vite-pwa-org.netlify.app/)                                                                |

## Project Structure

The codebase follows a **feature-based architecture**:

```
src/
├── app/              # App shell: routes, router config, providers, auth bootstrap
│   └── routes/       # One file per route, grouped by access level (public/signup/etc.)
├── features/         # Self-contained feature modules
│   └── <feature>/
│       ├── api/          # API calls for this feature
│       ├── components/   # Feature-specific UI components
│       ├── hooks/         # React Query hooks / feature-specific hooks
│       └── types/         # TypeScript types for this feature
├── components/       # Shared/reusable UI components (design system primitives)
├── content/          # Static content and translations (en, ml)
├── stores/           # Zustand global stores
├── lib/              # Core infrastructure: API client, React Query setup, route constants
├── hooks/            # Shared, cross-feature hooks
├── utils/            # Generic utility functions
└── types/            # Shared/global TypeScript types
```

Feature modules currently present: `auth`, `onboarding`, `business-profile`, `clients`, `products`, `invoices`, `profile`, `settings`, `legal`, `donation`.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- npm

### Installation

```bash
npm install
```

### Environment Variables

Environment variables are validated and read via `src/config/env.ts` — check that file for the exact variables the app expects (e.g. API base URL, Google OAuth client ID) before running the app, and create a `.env` file at the project root accordingly.

### Development

```bash
npm run dev
```

Starts the Vite dev server (bound to `0.0.0.0`, so it's reachable on your local network too).

### Build

```bash
npm run build
```

Type-checks with `tsc -b` and produces a production build via Vite.

### Preview

```bash
npm run preview
```

Serves the production build locally.

### Lint

```bash
npm run lint
```

Runs [oxlint](https://oxc.rs/).

## License

Private/proprietary — not currently licensed for public use.
