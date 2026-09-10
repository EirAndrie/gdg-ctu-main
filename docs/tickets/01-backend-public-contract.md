# 01: Backend public contract + drift fixes

Blocked by: none

## What to build
- Public GETs: /public/team, /public/events?scope=upcoming|past|featured|recent, /public/partners, /public/gallery/albums + /featured, /public/content (+:sectionKey). Published/active-only, safe fields.
- GET /health (replace GET /admins probe).
- Drift fixes: /auth/sync path, updatedBy Clerk-string, requireAuth 403 inactive with tech-officer message, 5MB multer guard.

## Acceptance
- Anon API 401, inactive 403, ?scope cutoff uses endAt, featured max 3.
- Spec: docs/admin-cms-spec.md S5.

