# Caden

**Always on. Always aware.**

Caden is a personal home AI system built for 24/7 autonomous operation on your own
hardware. This repository is the **web frontend** — the public landing page, the
chat interface, and the admin dashboard.

This is **Phase 1**: a static, dark-first frontend with mocked data and a
client-side auth gate. The Caden backend (orchestrator, sub-agents, scheduler,
local database) runs on local hardware and connects later — the JS files mark
exactly where that integration lands.

## Stack

- Vanilla HTML / CSS / JS — no framework, no build step
- Design-token CSS with a dark-only system
- Google Fonts: **Syne** (display), **DM Sans** (prose), **IBM Plex Mono** (system voice)
- Static hosting on GitHub Pages → self-hosted later

## Pages

| Route | File | Access | Purpose |
|-------|------|--------|---------|
| `/` | `index.html` | Public | Landing page with a live system readout |
| `/login` | `login.html` | Public | Auth gate |
| `/app` | `app.html` | Gated | Chat interface |
| `/dashboard` | `dashboard.html` | Gated | System health, agents, tasks, logs |

**Demo credentials:** `admin` / `caden2025`

## Develop

No build step. Open any `.html` directly, or serve the folder so relative paths
and the auth redirects behave like production:

```
npx serve .
# or
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Project layout

```
caden/
├── index.html          # Landing (public)
├── login.html          # Auth gate
├── app.html            # Chat (gated)
├── dashboard.html      # Admin dashboard (gated)
├── assets/
│   ├── css/
│   │   ├── global.css      # Tokens, reset, shared components
│   │   ├── landing.css     # Landing page
│   │   ├── app.css         # Shared app shell + chat
│   │   └── dashboard.css   # Dashboard content
│   └── js/
│       ├── auth.js         # localStorage auth + guards
│       ├── nav.js          # Landing: reveals, live console, ambient signal
│       ├── chat.js         # Chat UI + mocked replies
│       └── dashboard.js    # Dashboard render + live simulation
└── .github/workflows/deploy.yml
```

## Deploy

Pushing to `main` builds and publishes via GitHub Actions
(`.github/workflows/deploy.yml`). One-time setup: in the repo, go to
**Settings → Pages → Build and deployment → Source** and select
**GitHub Actions**.

## Backend (coming soon)

The Caden brain — orchestrator, sub-agents, scheduler, and local database — runs
on local hardware. API integration with this frontend is in development. The
hand-off points are isolated in `chat.js` (reply layer) and `dashboard.js`
(telemetry/render layer), and auth swaps from a hardcoded check to a
server-issued token in `auth.js`.

See `CLAUDE.md` for conventions when working in this repo with Claude Code.
