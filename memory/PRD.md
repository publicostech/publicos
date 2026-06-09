# PublicOS — PRD

## 1. Original problem statement
Build a modern, scalable civic-tech web platform where citizens can report local civic problems publicly and transparently. Public issue feeds, role-based dashboards (citizen / official / admin), real maps with geolocation reporting, upvoting & commenting, admin moderation, two-step closure verification, and per-jurisdiction Official role. Pre-launch positioning: drop fake numbers; lead with Vision, Mission, Community Participation, Transparency, Accountability, Future Impact.

## 2. Brand promise
"Empowering Citizens. Enabling Accountability." — PublicOS exists to ensure no civic issue goes unnoticed, no citizen voice goes unheard, and every community has the opportunity to create meaningful change through transparency and collective action.

## 3. Personas
- **Citizen** — reports issues, supports/comments, requests closure on their own reports.
- **Official** — government officer at state/district level. Sees only issues within their jurisdiction. Can change workflow status and rule on closure requests.
- **Admin (super)** — full moderation queue, promotes/revokes officials, decides closures everywhere, sees analytics.

## 4. Homepage structure (post Feb 2026 content refactor)
1. **Hero** — "See Your City. Shape Its Future." + rotating mission pillar panel (4 pillars).
2. **Civic Promise ticker** — rotating mission statements (no fake events).
3. **Mission** — "Building India's Most Transparent Civic Network" + 4 cards (Citizen First / Transparent Tracking / Public Accountability / Data-Driven Governance).
4. **How It Works** — Report. Connect. Track. Improve. (4 steps).
5. **Issues That Matter Most** — 8 topic cards (Roads, Lighting, Waste, Water, Traffic, Public Spaces, Environment, Transport).
6. **Growing Together** — coverage section with India choropleth + "Bring PublicOS to Your Community" CTA.
7. **Built for Every Community** — 4 cards (Village / Town Councils / Municipal / Smart Cities).
8. **Community Champions** — 5 recognition categories (pre-launch; "Be among the first").
9. **Final CTA** — "The change you want to see starts with one report." + Report / Join PublicOS.
10. **Footer** — brand promise tagline + Citizens / Governance / Civic Promise columns.

## 5. Core features delivered
- Auth: Email/Password (JWT, bcrypt) + Google OAuth (Emergent) + Resend password reset (15 min token, pre-validated on mount)
- Real Leaflet + OpenStreetMap with Nominatim reverse geocoding + map clustering at scale (react-leaflet-cluster)
- Issue lifecycle: `submitted → under_review → assigned → in_progress → resolved / rejected`
- Two-step closure: `closure_requested` → admin/official `closed` or reopen to previous status
- Object storage for photo attachments (`/api/upload`, `/api/files/{id}`)
- Official role + portal (`/official`) with state/district jurisdiction
- AI category classifier (`POST /api/ai/classify`, GPT-4o-mini via Emergent LLM key)
- Multi-language UI scaffolding EN/HI/TE with localStorage persistence (fully translates Landing, Footer, Map, common, status, feed)

## 6. Changelog
| Date | Item |
|---|---|
| 2026-02-09 | Object storage uploads + Two-step closure workflow |
| 2026-02-09 | Official role + portal, ResetPassword pre-validate, AI classify |
| 2026-02-09 | i18n EN/HI/TE expansion + Map clustering (react-leaflet-cluster) |
| 2026-02-09 | Homepage content refactor — dropped all fabricated civic data; new Mission-led pre-launch copy per user PDF brief |
| 2026-02-09 | Colorful pastel redesign — Topics / How-It-Works / Communities / Champions / Knowledge Hub |
| 2026-02-09 | Founding-citizen waitlist — `POST /api/waitlist`, admin Waitlist tab with city analytics, i18n EN/HI/TE |
| 2026-02-09 | Hero pillar card upgraded — uses 4 custom 3D illustrations (orange/blue/green/purple) as crossfading backgrounds with text floating on left half. Hero layout itself unchanged. |
| 2026-02-09 | 6-item UX revamp — colorful gradient Login/Register, Dashboard "Coming Soon" pre-launch state, Knowledge Hub real photos, How-It-Works mobile tightening, mobile responsiveness pass, hash-aware cross-route waitlist scroll. |
| 2026-02-09 | Login/Register split-screen redesign — dark navy LEFT panel with the user's 3D civic illustration ("Welcome back, citizen." / "Your city is waiting for you."), feature pills (Anonymous / Auditable on login; 90 seconds / Free forever on signup), white form panel on right. Mobile stacks form-first with pastel gradient. |
| 2026-02-09 | Rotating copy variants — Login + Register left panel cycles through 4 distinct headlines/body pairs per page on each visit (lazy useState initializer). Same illustration, fresh conversation every time. |

## 7. Backlog
### P1
- Email notifications to citizens on status changes (Resend)
- Officials can comment / message reporters within the portal
- Bulk closure approve/reject for admins
- Map view: filter/search by city or pincode

### P2
- Knowledge Hub section (articles, success stories, civic guides)
- Image safety moderation on upload
- Duplicate-issue detection (geohash + embedding similarity)
- AI summary of long descriptions for admin queue
- CSV / JSON export of issues for journalists
- Translate map category panel labels to HI/TE
- Pause rotating panel on `prefers-reduced-motion`

### Refactor
- Split `backend/server.py` (~1060 lines) into `routes/{auth,issues,admin,official,storage}.py` + `models/`
- Extract landing sub-components (MissionCard / CommunityCard / ChampionCategory) into `/components/landing/*`

## 8. Tech stack
React + Tailwind + shadcn UI + Plus Jakarta Sans + Leaflet + react-leaflet-cluster · FastAPI + Motor + PyJWT + bcrypt + Resend + emergentintegrations (object storage + LLM) · MongoDB

## 9. Key endpoints
- Auth: `POST /api/auth/{register,login,google,forgot-password,reset-password,reset-password/validate}` · `GET /api/auth/me`
- Issues: `GET/POST /api/issues` · `GET /api/issues/{id}` · `POST /api/issues/{id}/{upvote,comments,request-closure}`
- Storage: `POST /api/upload` · `GET /api/files/{file_id}`
- AI: `POST /api/ai/classify`
- Admin: `POST /api/admin/issues/{id}/{approve,reject,status,closure-decision}` · `GET /api/admin/{issues,users,analytics,officials}` · `POST /api/admin/officials/{assign,revoke}`
- Official: `GET /api/official/{me,issues}` · `POST /api/official/issues/{id}/status`
