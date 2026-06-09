# PublicOS — PRD

## 1. Original problem statement
Build a modern, scalable civic-tech web platform where citizens can report local civic problems publicly and transparently. Public issue feeds, role-based dashboards (citizen / official / admin), real maps with geolocation reporting, upvoting & commenting, admin moderation, two-step closure verification, and per-jurisdiction Official role.

## 2. Personas
- **Citizen** — reports issues, supports/comments, requests closure on their own reports.
- **Official** — government officer at state/district level. Sees only issues within their jurisdiction. Can change workflow status and rule on closure requests for issues in their area.
- **Admin (super)** — full moderation queue, promotes/revokes officials, decides closures everywhere, sees analytics.

## 3. Core requirements (delivered)
- Public landing with India choropleth map + live issue ticker
- Auth: Email/Password (JWT, bcrypt) + Google OAuth (Emergent-managed) + Resend password reset (15 min token)
- Real Leaflet + OpenStreetMap maps with Nominatim reverse geocoding
- Issue lifecycle: `submitted → under_review → assigned → in_progress → resolved / rejected`
- **Two-step closure**: citizen requests closure (status `closure_requested`) → admin/official approves (`closed`) or rejects (reopens to previous status)
- **Object storage** for real photo attachments (multipart upload → public file URL)
- **Official role** with state/district jurisdiction, dedicated `/official` portal
- **AI classify** category suggestion from title+description (GPT-4o-mini via Emergent LLM key)
- Multi-language UI scaffolding: English / Hindi / Telugu (nav, hero, common, status, feed, submit) with localStorage persistence

## 4. Implemented this session (Feb 2026)
| Date | Item |
|---|---|
| 2026-02-09 | Real photo uploads via Emergent object storage; `/api/upload` + `/api/files/{id}` |
| 2026-02-09 | Citizen→Admin closure workflow (`closure_requested` status, decision endpoint, audit-trail timeline) |
| 2026-02-09 | Official role + portal (`/official`), `/api/admin/officials/{assign,revoke}`, jurisdiction-scoped `/api/official/{me,issues,issues/{id}/status}` |
| 2026-02-09 | ResetPassword token pre-validation on mount via `POST /api/auth/reset-password/validate` |
| 2026-02-09 | AI category classifier `POST /api/ai/classify` |
| 2026-02-09 | i18n expansion (feed/submit/common keys) + localStorage persistence |

## 5. Backlog
### P1
- Allow officials to comment / message reporters within the portal
- Email notifications to citizens on status changes (Resend)
- Bulk closure approve/reject for admins

### P2
- Expand HI/TE translations to remaining marketing pages
- Duplicate-issue detection (geohash + embedding similarity)
- AI-summary of long descriptions on admin queue
- Image moderation safety filter on upload
- Map clustering when feed gets dense
- CSV / JSON export of issues for journalists

### Refactor
- Split `backend/server.py` into `routes/{auth,issues,admin,official,storage}.py` + `models/`. Currently ~1060 lines.

## 6. Tech stack
- React + Tailwind + shadcn UI + Plus Jakarta Sans + Leaflet
- FastAPI + Motor + PyJWT + bcrypt + Resend + emergentintegrations (object storage + LLM)
- MongoDB

## 7. Key endpoints (current)
- Auth: `POST /api/auth/{register,login,google,forgot-password,reset-password,reset-password/validate}` · `GET /api/auth/me`
- Issues: `GET/POST /api/issues` · `GET /api/issues/{id}` · `POST /api/issues/{id}/{upvote,comments,request-closure}`
- Storage: `POST /api/upload` · `GET /api/files/{file_id}`
- AI: `POST /api/ai/classify`
- Admin: `POST /api/admin/issues/{id}/{approve,reject,status,closure-decision}` · `GET /api/admin/{issues,users,analytics,officials}` · `POST /api/admin/officials/{assign,revoke}`
- Official: `GET /api/official/{me,issues}` · `POST /api/official/issues/{id}/status`
