# AGENTS.md

## Project Overview

- **Name:** `zz-user`
- **Stack:** Next.js (App Router), React 19, TypeScript, Tailwind CSS v4, Ant Design v6, TanStack Query, Axios, Three.js/R3F.
- **Domain:** Customer-facing bakery app for ZamZam. Core flows include:
  - Landing page
  - Cake library and cake detail browsing
  - Custom cake creation (including 3D preview and quote flow)
  - Review/feedback flows
  - Payment and review pages

## Runbook

- Install dependencies: `pnpm install`
- Start dev server: `pnpm dev`
- Build: `pnpm build`
- Start prod build: `pnpm start`
- Lint (auto-fix): `pnpm lint`
- Typecheck: `pnpm check-types`
- Format: `pnpm format`

## Environment Variables

Values are read from `.env` (not committed with secrets).

- `NEXT_PUBLIC_BASE_URL`
  - API base for frontend Axios client.
  - Defaults to `/api` when unset.
- `GEMINI_API_KEY`
  - Used by `src/app/api/visualise-cake/route.ts`.
  - If missing, the route returns a "Coming Soon" placeholder response.
- `NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER`
  - Used for WhatsApp order/contact URL generation.

## App Routes (src/app)

- `/` -> `src/app/page.tsx` (landing page)
- `/cake-library` -> `src/app/cake-library/page.tsx`
- `/cake/[id]` -> `src/app/cake/[id]/page.tsx`
- `/custom-cake` -> `src/app/custom-cake/page.tsx`
- `/feedback-form` -> `src/app/feedback-form/page.tsx`
- `/review/[id]` -> `src/app/review/[id]/page.tsx`
- `/payment` -> `src/app/payment/page.tsx`

### API Routes

- `POST /api/custom-cakes` -> `src/app/api/custom-cakes/route.ts`
  - Local validation + mock-style create response payload.
- `POST /api/visualise-cake` -> `src/app/api/visualise-cake/route.ts`
  - Calls Gemini image model when key exists; otherwise returns placeholder data.

## Project Structure

```text
.
├── public/
│   ├── __mocks__/                  # Mock images/data used by UI
│   └── ...                         # Static assets
├── src/
│   ├── app/                        # Next.js App Router pages/layout/api
│   ├── components/
│   │   ├── LandingPage/            # Home page sections
│   │   ├── cake/                   # Cake-specific UI
│   │   ├── common/                 # Shared UI primitives
│   │   ├── custom-cake/            # Custom cake builder + 3D tooling
│   │   └── review/                 # Review flow components
│   ├── lib/
│   │   ├── auth/context/           # Auth context provider
│   │   ├── hooks/                  # Custom hooks (signin/upload)
│   │   ├── locales/                # Locale strings
│   │   ├── services/
│   │   │   ├── api/                # API clients + endpoint maps
│   │   │   └── storage/            # Local storage helpers
│   │   ├── theme/                  # Ant Design theme tokens/config
│   │   └── utils/                  # Utility functions
│   ├── types/                      # Shared TypeScript interfaces/types
│   └── proxy.ts
├── package.json
├── next.config.ts
├── tsconfig.json
└── AGENTS.md
```

## Architecture Notes

- **UI composition:** Pages in `src/app` compose feature components from `src/components`.
- **State/data fetching:** React hooks + TanStack Query for async reads in client components.
- **API integration:** `src/lib/services/api/*` centralizes endpoint constants and Axios request wrappers.
- **Auth/token handling:** Access token sourced from cookies/local storage via `cookie.service` and `storage`.
- **Styling:** Tailwind utility classes + Ant Design components/theme (`ConfigProvider` in layout).
- **3D/customization:** Custom cake flow uses `@react-three/fiber` and `@react-three/drei`.

## Conventions for Future Agents

- Prefer existing service clients in `src/lib/services/api` instead of ad-hoc fetch logic.
- Keep shared type definitions in `src/types` or feature `types.ts` files.
- Use `@/*` import alias (configured in `tsconfig.json`) for `src` imports.
- Reuse common components from `src/components/common` before adding new primitives.
- Preserve fallback behavior in `/api/visualise-cake` for environments without `GEMINI_API_KEY`.

## Known Gaps / Maintenance Notes

- `README.md` is still default Next.js boilerplate and does not reflect current product features.
- API route `/api/custom-cakes` currently behaves like a validated mock response (no DB persistence).
