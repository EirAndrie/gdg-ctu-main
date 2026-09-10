# 02: Backend new fields + partners + gallery extension

Blocked by: 01

## What to build
- events: registrationUrl (https when enabled), is_featured, display_order, is_active.
- team_members: roleTitle required max80, dept trio nullable, is_featured.
- New partners table + protected CRUD + public GET (tier, display_order).
- media_collections -> albums (eventId?, date, is_active, is_featured) + items is_featured.
- Run db:generate, review migration (roleTitle NOT NULL backfill).

## Acceptance
- Migrations apply clean, tier order platinum>gold>silver>community.
- Spec: docs/admin-cms-spec.md S4.5, S4.6, S10.1.

