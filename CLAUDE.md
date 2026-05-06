# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Wedding gift wishlist app ("Chabar") with RSVP functionality. Guests confirm attendance before viewing the gift list, and can mark items as purchased. An admin panel allows full CRUD on gift items and viewing the guest list.

## Commands

Install all dependencies (root + both workspaces):
```
npm run install:all
```

Update all dependencies across all workspaces:
```
npm update && npm update --prefix frontend && npm update --prefix backend
```

Run both backend and frontend in dev mode (concurrently):
```
npm run dev
```

Run individually:
```
npm run dev --prefix backend   # Express on port 3001
npm run dev --prefix frontend  # Vite on port 5173
```

Build frontend for production:
```
npm run build --prefix frontend
```

There are no tests or linters configured.

## Architecture

The project is split into two independent npm workspaces managed from the root via `concurrently`.

**Backend** (`backend/`) — Node.js + Express, CommonJS. Runs on port 3001.
- `server.js` — all API routes; no router abstraction.
- `database.js` — flat-file JSON store. Data lives in `backend/data/db.json` (gift items) and `backend/data/guests.json` (RSVP list), created on first run from a hardcoded `SEED` array.
- Admin authentication is a simple `x-admin-password` header checked against `process.env.ADMIN_PASSWORD` (default: `chabar2024`).
- The `migrate()` function in `database.js` handles schema evolution on read (adds missing fields to existing records).

**Frontend** (`frontend/`) — React 18 + Vite, ES modules.
- `App.jsx` orchestrates the three top-level views: `rsvp` → `gifts` (public) and `admin` (triggered via `?admin` query param).
- RSVP state is persisted to `localStorage` (`chabar_rsvp`); admin session password is stored in `sessionStorage`.
- Vite proxies `/api/*` to `http://localhost:3001` in dev mode, so the frontend uses relative `/api` paths everywhere.
- No state management library — all state lives in `App.jsx` and is passed down as props.

**Item data model:**
```
{ id, name, emoji, description, category, quantity, quantityReceived, purchased, purchaseLinks[] }
```
`purchased` is derived (`quantityReceived >= quantity`) and recalculated on every write.

**API routes summary:**
| Method | Path | Auth |
|--------|------|------|
| GET | `/api/items` | public |
| PATCH | `/api/items/:id/toggle` | public |
| POST | `/api/items` | admin |
| PUT | `/api/items/:id` | admin |
| DELETE | `/api/items/:id` | admin |
| GET | `/api/admin/verify` | admin |
| POST | `/api/rsvp` | public |
| GET | `/api/rsvp` | admin |
