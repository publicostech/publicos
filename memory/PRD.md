# CivicTrack Portal — PRD

## Original Problem Statement
Build a modern, scalable civic-tech web platform called **CivicTrack Portal** where every citizen can report local problems publicly and transparently. The platform should function like a combination of social reporting + governance analytics + public accountability dashboard. Citizens post issues (potholes, garbage, water, streetlights, drainage, corruption, pollution, etc.) with photos, GPS, urgency. Officials (ward → mandal → district → state → national) get dashboards with heatmaps, trends, SLA tracking. Super admin moderates. Vision: tomorrow every Indian city on one transparent platform with clear analytics showing which state performs how.

> Scope clarified by user: **Build the UI/UX pages only for now** — beautiful, engaging, public-facing. No backend/auth/real maps/AI. All data mocked.

## User Choices
- UI/UX only with mocked data
- Modern government-grade trust design (deep navy + saffron + emerald India accents)
- Static stylized India SVG map (no API key)
- Multi-language switcher (EN / HI / TE)
- Recharts for dashboard analytics

## Architecture
- **Frontend**: React 19 (CRA) + react-router-dom 7, Tailwind 3, shadcn/ui, Recharts, Framer Motion, Lucide icons, Sonner toasts
- **Design system**: Fraunces serif headings + Manrope body + JetBrains Mono for data. Civic Navy `#0A192F`, Saffron `#FF9933`, Emerald `#138808` on warm cream `#FAF9F6`.
- **Data**: All mocked in `/app/frontend/src/lib/mockData.js` (13 civic categories, 12 issues, 16 states, platform stats, monthly trends, state leaderboard, dept efficiency, top contributors)
- **i18n**: React context in `/app/frontend/src/lib/i18n.js` (EN/HI/TE — currently covers nav, hero, status, common)
- **Backend**: Untouched default FastAPI (no new endpoints needed)

## User Personas
1. **Citizen** — reports issues, upvotes, comments, tracks resolution, builds reputation
2. **Government Official** — ward/mandal/district officer; reviews queue, updates status, uploads resolution proof
3. **Super Admin** — moderates content, manages departments/categories/geography, verifies officials

## Pages Implemented (UI-only)
- `/` **Landing** — Hero, live ticker, bento stats, 3-step how-it-works, trending issue cards, map teaser, cities grid, citizen leaderboard, final CTA
- `/feed` **Public Feed** — search, collapsible filters (category/status/state/urgency), sort tabs (Latest/Trending/Nearby/Resolved/Critical), issue card grid
- `/submit` **Report Issue** — 5-step wizard (Category → Details → Media → Location → Review) with GPS auto-detect and anonymous toggle
- `/map` **Map View** — stylized India SVG with pulsing state markers, Density/Resolution toggle, category layer filters, state drill-down panel
- `/dashboard` **Analytics** — KPI cards, Reported-vs-Resolved bar chart, category pie, state leaderboard, dept SLA bar, avg-closure line, export buttons (PDF/Excel/CSV)
- `/issue/:id` **Issue Detail** — photo carousel, timeline, public audit log, comments (post works), status, action bar (support/share/flag)
- `/profile` **Citizen Profile** — avatar header, reputation stats, badges grid, tabs (My reports / Following / Notifications)
- `/admin` **Super Admin** — KPIs + tabs (Moderation queue with approve/reject / Users / Departments / Categories / Geography)
- `/official` **Official Panel** — queue list, issue detail pane, status select, assign dropdown, remark textarea, Update/Proof/Escalate buttons

## Shared Components
- `Header` — glassmorphic sticky, tricolor accent bar, logo, nav, language dropdown, Report Issue CTA, mobile hamburger
- `Footer` — trust badges, 4-column nav, civic promise
- `IssueCard` — photo, status badge, category chip, upvote button, comments/shares
- `IndiaMap` — simplified SVG outline + state centroid markers with density/resolution coloring and hover tooltips
- `StatusBadge`, `CategoryIcon` / `CategoryChip`

## What's Been Implemented (Feb 24, 2026)
- ✅ All 9 pages built with data-testid coverage
- ✅ Tricolor-accented gov-grade design system (Fraunces + Manrope + JetBrains Mono)
- ✅ 13 civic categories with Lucide icons and color coding
- ✅ Live pulse ticker, bento stat grid, leaderboards
- ✅ Stylized India map with 18 state markers, 2 color modes, drill-down
- ✅ 6 Recharts visualisations (bar, line, pie, horizontal bar)
- ✅ Language switcher EN / HI / TE (nav + hero + status labels)
- ✅ Multi-step submit wizard with validation, anonymous reporting, GPS mock
- ✅ Admin moderation queue with approve/reject toasts
- ✅ Official queue + status update flow
- ✅ Stale-closure bug fix in Submit wizard (functional setState)

## What's Been Implemented (Feb 24, 2026 — v2 Leaflet)
- ✅ react-leaflet 5 + leaflet 1.9 added, OSM tile layer rendering
- ✅ Custom divIcon pulsing markers colour-coded by status, state-aggregate pins, heat circles
- ✅ 3-mode toggle on /map: Issues / By state / Heat
- ✅ 'Near me' button using navigator.geolocation on /map
- ✅ Real browser geolocation on /submit GPS button with Nominatim reverse-geocode (auto-fills address/pincode/city/state)
- ✅ LocationPreview mini-map on /submit step 4 and every /issue/:id detail page
- ✅ All 12 mock issues now have lat/lng coordinates
- ✅ Testing agent iter-2: 100% pass, 0 console errors

## Known Limitations (by design, UI-only phase)
- All data is mocked client-side (no API calls)
- No real auth/OTP/social login
- GPS is simulated; real browser geolocation not wired
- Hindi/Telugu translations only cover nav + hero + status (page bodies remain English)
- Map is stylized SVG, not real Mapbox/Leaflet
- File uploads are mock-only
- Export buttons show toasts but don't generate real files

## Prioritized Backlog
### P0 (next phase to make it functional)
- FastAPI backend: Issue model + CRUD, upload to object storage, user auth (JWT or Emergent Google), comments, upvotes
- Real geolocation (browser API) + reverse geocoding
- Backend seed script to ingest mock data into MongoDB
- Protected routes for Admin/Official panels

### P1
- Integrate Leaflet + OpenStreetMap for real map
- Full i18n coverage across all pages
- AI auto-classification (OpenAI/Claude via Emergent LLM key)
- Real file upload to object storage
- Push/email/SMS notifications
- PDF/Excel report generation
- WebSocket live feed & live ticker

### P2
- Duplicate issue detection
- Sentiment analysis on comments
- Predictive hotspot modelling
- WhatsApp integration for updates
- CAPTCHA + spam prevention
- SLA escalation engine with email
- SaaS billing for municipalities

## Next Tasks
1. Wire up backend CRUD + MongoDB schema for issues, users, comments, upvotes
2. Add JWT or Emergent Google auth
3. Replace mocked data with real API fetch
4. Integrate real map library
5. Expand translations to full page coverage
