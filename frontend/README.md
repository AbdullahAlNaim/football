# Matchday: frontend

React + TypeScript + Vite app for Matchday. See the [main README](../README.md) for the full project overview and setup.

## Commands

```bash
npm install      # install dependencies
npm run dev      # dev server at http://localhost:5173 (forwards /api to Django on :8000)
npm run build    # type-check and build for production into dist/
npm run lint     # ESLint
```

## Structure

| Folder | Purpose |
| --- | --- |
| `src/api/` | Typed fetch functions and shared types (`Team`, `Match`, `Standing`) |
| `src/hooks/` | TanStack Query hooks: `useMatches`, `useStandings`, `useTeams`, `useCountdown`… |
| `src/components/` | UI components; `layout/` (navigation) and `calendar/` (month grid, agenda list) |
| `src/pages/` | Routed pages: Dashboard, Calendar, Teams |
| `src/lib/` | Date and label helpers |

Theme colours (navy background, card shades, accent and win/draw/loss colours) are defined once in `src/index.css` under `@theme` and used as Tailwind classes like `bg-card` and `text-accent`.
