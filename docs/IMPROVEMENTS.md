# IPMC Website — Complete Improvements Log

Everything done to this codebase, in one place, organized by category.
Each item says what was wrong, what was changed, and which file(s).

---

## 1. Deployment & Routing

| Issue | Fix | File(s) |
|---|---|---|
| `/contact` (and every other client-side route) 404'd on Vercel | Added SPA rewrite config | `client/vercel.json` |
| Admin app had the same 404 risk on every route | Same fix | `admin/vercel.json` |
| Admin app had no route for `/` at all \u2014 blank page if deployed to its own domain | Added `/` \u2192 `/admin` redirect + catch-all | `admin/src/App.jsx` |

## 2. Backend Reliability

| Issue | Fix | File(s) |
|---|---|---|
| Contact form silently hung with zero error/log when SMTP wasn't configured \u2014 the actual root cause of "contact form doesn't work" | Email sending moved off the critical response path (fire-and-background), SMTP transporter given real timeouts, graceful skip when unconfigured | `server/utils/emailService.js`, `server/services/contactService.js` |
| Same blocking-email pattern existed in newsletter signup | Same fix | `server/services/newsletterService.js` |
| No `trust proxy` setting \u2014 unreliable IP detection behind any reverse proxy/load balancer | Added `app.set('trust proxy', 1)` | `server/server.js` |
| Unhandled promise rejections / uncaught exceptions could crash the process with zero log trace | Added global handlers logging via structured logger | `server/server.js` |
| Password-reset emails would link to `localhost` in production if `ADMIN_URL` was unset | Safe fallback + warning log | `server/services/authService.js` |
| CORS only accepted one hardcoded origin, no support for multiple domains or Vercel preview URLs | Accepts a `CORS_ORIGIN` comma-separated list, auto-allows `*.vercel.app` for this project | `server/server.js` |
| No gzip/brotli compression on API responses | Added `compression` middleware | `server/server.js` |
| No protection against MongoDB operator-injection via query/body | Added `express-mongo-sanitize` | `server/server.js` |
| No graceful shutdown \u2014 deploys/restarts could drop in-flight requests | Added SIGTERM/SIGINT handling | `server/server.js` |
| Every log was an unstructured `console.log` string \u2014 not parseable by any log aggregator | Replaced with structured JSON logging (Winston) across the entire backend | `server/utils/logger.js` + 7 other files |

## 3. Admin App

| Issue | Fix | File(s) |
|---|---|---|
| Default admin credentials (`admin@ipmc-ng.com / admin123`) displayed publicly on the login page | Removed | `admin/src/pages/AdminLogin.jsx` |
| No request timeout, no network-vs-server error distinction in admin's API client | Hardened to match the public site's fix | `admin/src/services/api.js` |
| Forgot/reset password: backend routes existed, admin had zero UI for them \u2014 a locked-out admin had no recovery path | Built both pages, wired routes + API methods, added the login-page link | `admin/src/pages/ForgotPassword.jsx`, `ResetPassword.jsx`, `App.jsx`, `services/api.js` |
| Endpoint audit: all 40+ admin\u2192server API calls checked | Verified every call matches a real route + method \u2014 no mismatches found | \u2014 |

## 4. UX: Broken Interactions

| Issue | Fix | File(s) |
|---|---|---|
| Blog cards/links did nothing when the backend was unreachable (empty state, no fallback) | Added fallback blog content (6 real posts, original write-ups) used automatically whenever the API is empty/unreachable | `client/src/data/blogPosts.js`, `Blog.jsx`, `BlogPost.jsx` |
| `alert()` used for all form feedback \u2014 jarring, blocks the page, looks unfinished | Replaced everywhere with `react-toastify` toasts | `Contact.jsx`, `ProposalRequest.jsx`, `NewsletterPopup.jsx`, `App.jsx` |
| Newsletter popup had no keyboard focus trap \u2014 Tab could silently escape into hidden page content behind the overlay | Added focus trap, Escape-to-close, initial focus on open, `role="dialog"`/`aria-modal` | `NewsletterPopup.jsx` |
| Mobile nav menu didn't lock background scroll | Fixed | `Navbar.jsx` |

## 5. Visual Design System

Full rationale in `docs/DESIGN_SYSTEM.md`. Applied via a token remap in
`tailwind.config.cjs`, so every existing component (`bg-primary-900`,
`text-accent-500`, etc.) inherited the new palette without per-component edits:

- **Palette**: Ink (#0B1830), Signal (#2451C4), Brass (#C8862B), Verified
  green (#15803D, used sparingly) \u2014 replacing the previous generic
  blue/amber combination
- **Type**: Fraunces (display/headlines only) + IBM Plex Sans (body/UI,
  an engineering-house grotesk) + IBM Plex Mono for every stat and data
  figure site-wide \u2014 a consistent signal that numbers here are measured
  facts
- **Signature elements**: the "Tick-Rule" (a measurement-tick section
  divider, applied to the hero/footer boundaries) and the "Stamp Mark"
  (a verification seal, reserved for real certifications)
- Fonts switched from a render-blocking `@import` in CSS to a proper
  `<link>` in `index.html` with `display=swap` (also a performance fix)

**Not yet done**: full page-by-page visual rebuilds (hero imagery,
illustration style, dark-mode variants for every component). The
foundations are in place; applying them to every remaining page/section is
the natural next step if wanted.

## 6. Content Accuracy

All placeholder content replaced with real data extracted directly from
ipmc-ng.com: phone number, email, three office addresses, capability/nav
structure, leadership team (names + roles), hero messaging, blog post
titles/dates, footer service list. Team member photo URLs extracted
(11/11 found) \u2014 download blocked by this sandbox's lack of internet
access; script + instructions included (`scripts/ipmc-team-images/`).

## 7. CI / Process

| Issue | Fix | File(s) |
|---|---|---|
| Zero automated checks \u2014 a broken commit could ship silently | Added a GitHub Actions workflow: builds client + admin, boots the server against a real MongoDB and hits a live endpoint | `.github/workflows/ci.yml` |

---

## What's still genuinely open (not done, and why)

- **No test suite** \u2014 the CI above catches build/boot failures, not logic
  regressions. Adding real unit/integration tests (Vitest for client,
  Jest+Supertest for server) is a substantial separate task.
- **Admin auth tokens in `localStorage`** (XSS-readable) \u2014 moving to
  httpOnly cookies is a real architectural change (server-side sessions,
  CSRF handling, cross-subdomain cookie config) since client/admin/server
  are three separately deployed apps.
- **Dead `JWT_REFRESH_*` config** \u2014 defined but no refresh-token endpoint
  implemented anywhere.
- **Hotlinked Unsplash hero images** \u2014 fragile for production; a fallback
  gradient was added earlier, but self-hosting optimized images (webp/avif)
  is still worth doing.
- **No error monitoring** (Sentry or equivalent) wired to the new
  structured logger \u2014 straightforward to add once you have an account/DSN.
- **Full page-by-page redesign** using the new design tokens \u2014 foundations
  are wired in, but hero/about/services/blog page layouts haven't been
  individually rebuilt around them yet.
- **Team photos not actually downloaded** \u2014 sandbox has no internet access
  for binary downloads; URLs extracted and a working script provided
  instead (see section 6).

Tell me which of these to tackle next, in priority order, and I'll keep going.

---

## Round 2 — Full page redesign pass, test suite, cookie auth, Docker

### 8. Design tokens applied further

Applied `.stat-figure` (mono, tabular numerals — the design system's
signature "this number is measured" signal) to the remaining stat displays
that were still using the old serif treatment: `WhyChooseUs.jsx`,
`AboutSection.jsx`, and the milestone years in `About.jsx`.

**Still open**: full page-by-page layout rebuilds (hero imagery direction,
illustration style, dark-mode variants) haven't been done — this was a
targeted token-consistency pass, not a ground-up redesign of every page.

### 9. Real test suite

**Server** (`server/tests/`, Jest + Supertest + `mongodb-memory-server`):
- `health.test.js` — health check, empty-state services list, structured 404s
- `contact.test.js` — **regression test for the exact production bug that
  was fixed**: asserts the contact form saves the message and responds
  quickly even with zero SMTP configuration, plus validation edge cases
  (missing field, short message, invalid email)
- `auth.test.js` — the full cookie-auth flow: login sets an httpOnly
  cookie + readable CSRF cookie, wrong password is rejected, `/me` works
  from the cookie alone with no Authorization header, a state-changing
  request **without** the CSRF header is correctly rejected with 403,
  logout actually clears the session

Refactored `server.js` to export the Express `app` separately from calling
`.listen()` (guarded by `require.main === module`), and `config/db.js` to
skip auto-connecting when `NODE_ENV=test`, since tests manage their own
in-memory MongoDB connection. This is what makes the app testable with
Supertest in the first place — it wasn't before.

**Client** (`client/src/**/*.test.{js,jsx}`, Vitest + Testing Library):
- `data/blogPosts.test.js` — the fallback blog data has unique slugs,
  lookup by slug works, unknown slugs return `null`, related-posts
  excludes the current post and respects the limit
- `components/UI/LoadingSpinner.test.jsx` — component smoke test

Run with `npm test` in either `client/` or `server/`. Wired into CI (see
below) so these run on every push automatically.

**Still open**: this is meaningful coverage of the areas that actually broke
in production, not exhaustive coverage of the whole app (e.g. the admin
CRUD pages, blog/service detail pages, and most form validation paths
still have no tests).

### 10. Admin auth hardening — cookie-based sessions

The JWT no longer lives in `localStorage` (readable by any JS on the page,
including anything injected via XSS). It's now in an **httpOnly cookie**
that page JavaScript literally cannot read.

- `server/utils/authCookies.js` — sets the auth cookie (httpOnly) and a
  separate CSRF cookie (deliberately *not* httpOnly, since the frontend
  needs to read and echo it back)
- `server/middleware/csrf.js` — double-submit CSRF check: any
  state-changing request authenticated via the cookie must also carry a
  matching `X-CSRF-Token` header, which a forged cross-site request can't
  produce even though the browser auto-attaches the cookie
- `middleware/auth.js` — now accepts either an `Authorization` header
  (API clients/scripts) or the cookie (browser sessions)
- `authController.js` — login/register set the cookies; added a real
  `POST /auth/logout` that clears them
- `admin/src/services/api.js` — every request now sends
  `credentials: 'include'` instead of manually attaching a token from
  localStorage, and attaches the CSRF header on mutating requests
- `admin/src/context/AdminAuth.jsx` — rewritten around asking the server
  "am I logged in?" via `/auth/me` on load, instead of trusting a token
  cached in localStorage

**A correctness bug I caught mid-implementation and fixed**: client/admin
(Vercel) and the server (Render/Railway, etc.) are normally on entirely
different domains, not just subdomains of one site. Browsers only send
`SameSite=Strict` or `Lax` cookies on **same-site** requests — a cross-site
`fetch()` call (exactly what the admin app makes) would have had the
cookie silently dropped, breaking auth completely in your actual
deployment shape. Fixed by using `SameSite=None; Secure` in production
(safe specifically because the CSRF middleware above exists to cover the
gap that setting opens).

**Still open**: no refresh-token rotation (sessions are just a flat
30-day-lived cookie); rate-limiting is applied to `/login` but not
specifically to repeated CSRF failures.

### 11. Dockerized, multi-stage builds

- `client/Dockerfile`, `admin/Dockerfile` — stage 1 builds the Vite app in
  `node:20-alpine`, stage 2 copies only the compiled `dist/` into
  `nginx:alpine`. Final images ship no Node, no source, no
  `node_modules` — just static files and nginx (roughly 25MB vs. several
  hundred MB for a Node-based image).
- `client/nginx.conf`, `admin/nginx.conf` — SPA fallback (`try_files ...
  /index.html`, the container equivalent of the `vercel.json` rewrite),
  gzip, immutable caching for hashed asset filenames, no caching on
  `index.html` so deploys take effect immediately, a `/health` endpoint.
- `server/Dockerfile` — stage 1 installs production-only dependencies,
  stage 2 copies them plus source into a fresh `node:20-alpine`, runs as a
  **non-root user**, includes a real `HEALTHCHECK`.
- `docker-compose.yml` — orchestrates MongoDB + server + client + admin
  together, with a Mongo health check gating server startup, named
  volumes for Mongo data and server uploads, and all the env vars wired
  between services (`CORS_ORIGIN`, `VITE_API_URL` passed as build args
  since Vite bakes them in at build time, etc.).
- `.env.docker.example` — copy to `.env` and run
  `docker compose up --build` to run the entire stack locally in one command.

**Still open**: no production orchestration beyond Compose (no Kubernetes
manifests, no multi-replica setup) — reasonable for a site this size, but
worth knowing if traffic grows enough to need it.

### 12. CI now actually runs the tests

`.github/workflows/ci.yml` updated: `client-build` now runs `npm test`
before building, and a new `server-test` job runs the full Jest suite
against an in-memory MongoDB (no external DB needed) before the existing
`server-boot-check` job (which still boots the real server against a real
MongoDB service container and hits a live endpoint, as a final sanity
check).
