# Frontend Dual Layout Showcase App

Portfolio sample built with React + TypeScript to demonstrate two production-style UI flows:

- **Desktop experience**: sidebar navigation, content sections, reusable cards/tables, and media dialogs.
- **Mobile-first experience**: multi-step booking/request form with calendar interactions, time pickers, and stateful feedback.

## Stack

- Vite + React 19 + TypeScript
- Tailwind CSS v4 (`@theme` tokens + utility-first styling)
- `clsx` + `tailwind-merge` + `class-variance-authority` for composable variants
- Vitest + Testing Library for UI and hook behavior

## Quick start

```bash
pnpm install
pnpm dev
pnpm build
pnpm test:run
```

Dev server: `http://localhost:5173`

## Routes

- `/`: project switcher
- `/desktop`: dashboard layout
- `/responsive`: mobile-first request flow
