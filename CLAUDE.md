# CLAUDE.md

Guidance for working in this repository with Claude Code (or any agentic tool).
Read this before making changes — it captures the conventions that keep the
codebase coherent.

## What this is

The **web frontend** for Caden, a personal home AI system. Phase 1 is a static,
dark-first site with mocked data and a client-side auth gate. The backend (the
"brain") connects later. There is **no framework and no build step** — what's in
the repo is what ships.

## Golden rules

1. **No frameworks, no build tools, no bundlers.** Vanilla HTML/CSS/JS only.
   Don't add React/Vue/Tailwind/npm dependencies.
2. **No external dependencies except Google Fonts.** Don't pull in CDN libraries.
3. **Dark mode only.** There is no light theme and none is wanted.
4. **Relative links only** (`app.html`, not `/app.html`). The site must work from
   a GitHub Pages project subpath (`user.github.io/caden/`) as well as locally.
5. **Design tokens first.** Every color, space, font, radius, and timing value
   lives as a CSS custom property in `assets/css/global.css` `:root`. Never
   hard-code a hex value in a component — reference a token. If you need a new
   value, add a token.
6. **Mobile responsive always.** Kiosk, phone, tablet, and desktop all matter.
7. **Accessible by default.** Semantic HTML, ARIA labels on interactive elements,
   visible keyboard focus, `prefers-reduced-motion` respected.
8. **No lorem ipsum.** All copy is real and on-brand: calm, confident, plain
   verbs, sentence case, written from the user's side of the screen.

## Naming + style

- **CSS classes:** kebab-case (`.rail-link`, `.stat-value`).
- **JS functions/vars:** camelCase (`renderThread`, `pushLog`).
- **Section comments** at the top of every file and above each logical block.
- Keep the visual language consistent — match the spacing, type, and idioms of
  the surrounding code rather than introducing a new pattern.

## Design system (do not drift from these)

- **Palette:** near-black `--bg: #080b10`, surface `#111318`, border `#1e2230`,
  text `#e8eaf0` / muted `#8b92a5`. Single brand accent: **electric blue
  `--accent: #3d8ef0`**. Status colors (`--ok` emerald, `--warn` amber,
  `--err` coral) are **functional only** — dashboard state, never decoration.
- **Type:** `--font-display` Syne (headings, wordmark), `--font-body` DM Sans
  (prose), `--font-mono` IBM Plex Mono (system voice: labels, data, Caden's
  chat name, status lines). Do **not** introduce Inter, Roboto, Arial, or
  Space Grotesk.
- **Motion:** subtle and purposeful — fades, gentle pulses, the ambient hero
  signal. Nothing flashy. The system should feel calm and in control.
- **Signature:** the landing hero is a *live readout of Caden's presence* (the
  console + the oscilloscope canvas in `nav.js`). Keep boldness concentrated
  there; keep everything else quiet.

## File map

| File | Owns |
|------|------|
| `assets/css/global.css` | Tokens, reset, base type, shared components (buttons, auth card, toast, status dot, focus, scrollbars, reduced-motion) |
| `assets/css/landing.css` | Top nav, hero, capability grid, CTA, footer |
| `assets/css/app.css` | **Shared authenticated shell** (`.app-shell`, `.rail`, `.icon-btn`, off-canvas) **+ chat** (thread, composer) |
| `assets/css/dashboard.css` | Dashboard content (stat cards, agents, tasks, logs, notifications) — layers on the shell from `app.css` |
| `assets/js/auth.js` | localStorage auth, `requireAuth()`, `login()`, `logout()`, `cadenPath()` |
| `assets/js/nav.js` | Landing behaviour: auth-aware links, scroll reveals, live console, ambient signal |
| `assets/js/chat.js` | Chat render + send + mocked replies |
| `assets/js/dashboard.js` | Dashboard render + live simulation + toasts |

> Note: the dashboard loads `app.css` for the shared rail/shell, then
> `dashboard.css` for its own content. If you change the shell, check both
> `app.html` and `dashboard.html`.

## Auth

Hardcoded for Phase 1 in `auth.js` (`admin` / `caden2025`, flag in
`localStorage["caden_auth"]`). Protected pages call `requireAuth()` at the very
top of their JS before rendering. When the backend arrives, swap the credential
check and the stored flag for a server-issued token — keep the function
signatures (`login`, `requireAuth`, `logout`, `isAuthed`) so callers don't change.

## Where the backend connects (the seams)

These are the only places that should change when wiring the real server. Keep
them isolated.

- **`chat.js` → `pickReply()` / `sendMessage()`**: replace the local reply pool
  with a call to the orchestrator's conversation endpoint. The render, typing
  indicator, and scroll logic stay as-is.
- **`dashboard.js` → render + `startSimulation()`**: replace `AGENTS`, `TASKS`,
  `NOTIFICATIONS`, and the simulated log stream with live telemetry (poll or
  websocket). The render functions and toast/action handlers stay as-is.
- **`auth.js` → `login()` / `requireAuth()`**: replace with token auth.

## Running + deploying

- **Run locally:** `npx serve .` or `python3 -m http.server 8000`, then open
  `http://localhost:8000`. Serve the folder (don't just `file://` open) so the
  auth redirects resolve correctly.
- **Deploy:** push to `main`; `.github/workflows/deploy.yml` publishes to GitHub
  Pages. Pages **Source** must be set to **GitHub Actions** in repo settings.

## Before you finish a change

- Check it on a narrow viewport (≤480px) and a wide one.
- Tab through interactive elements — focus must be visible.
- Confirm the auth gate still redirects (`app.html`/`dashboard.html` →
  `login.html` when signed out).
- No console errors. No hard-coded colors. No new dependencies.
