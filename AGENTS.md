# AB Bank Rwanda — public site (`Frontend/`)

Public marketing site: **React 19 + Vite + Tailwind CSS v4 + react-router 7**.
Reads published content from the CMS API (`VITE_API_URL`), with built-in
fallback copy when the API is unreachable. Installable PWA (offline-capable).

> Project-wide rules, security requirements and the three-repo layout are in
> the root `CLAUDE.md` / `PROJECT_STATUS.md`. Read those first.

## Development

```bash
npm run dev        # Vite dev server on :5173 (admin runs on :5174)
npm run build      # tsc --noEmit && vite build  → dist/
npm run preview    # serve the production build (needed to exercise the PWA)
npm run typecheck  # tsc --noEmit
npm run lint       # eslint
```

`Frontend/.env`:

```ini
VITE_API_URL=http://localhost:4000
```

## Key files

- `src/App.tsx` — routes
- `src/main.tsx` — React entry
- `src/index.css` — Tailwind import, `@font-face` (self-hosted fonts in
  `public/fonts/`), design tokens under `@theme`
- `src/lib/content.ts` — public CMS reads + offline fallback
- `src/lib/i18n.tsx` — en / rw / fr, dictionaries in `src/locales/`
- `src/components/page/PageShell.tsx` — shared chrome for every route
- `vite.config.ts` — Vite + `vite-plugin-pwa` config (`abrPwa()`)
- `src/imports/` — exported image assets (logos, hero media, map pins)

## Styling

Tailwind CSS v4 via `@tailwindcss/vite` — utility classes in JSX, no PostCSS
config. Several older components use inline `style={{…}}` objects with the
`--color-*` / `--font-*` tokens from `src/index.css`; match whichever the file
you're editing already uses.
