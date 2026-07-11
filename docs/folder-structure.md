# Folder and File Structure

## Root Level
- `src/app` – application routes, pages, and API handlers
- `src/components` – reusable React UI components organized by feature area
- `src/context` – shared React context providers such as theme and instructor context
- `src/lib` – core utilities, database helpers, auth helpers, and configuration modules
- `src/types` – TypeScript type definitions
- `public` – static assets and uploaded media folders
- `scripts` – database setup and migration utilities
- `docs` – project documentation

## Important Directories

### `src/app`
Contains the App Router pages and next API endpoints.
- `src/app/page.tsx` – home page
- `src/app/api` – server-side API routes organized by domain
- `src/app/(feature)/page.tsx` – top-level feature pages

### `src/components`
Organize UI by feature:
- `components/home` – marketing page sections
- `components/academy` – academy and course UI
- `components/lms` – LMS experience components
- `components/admin` – admin dashboard interfaces

### `src/lib`
Core backend and shared helpers:
- `db.ts` – MySQL connection pool
- `auth.ts` – JWT and password authentication helpers
- `email.ts` – mail sending utilities
- `cloudinary.ts` – media upload helper
- `schema.sql` and `lms-schema.sql` – SQL schema definitions

### `public/uploads`
Stores uploaded assets by domain such as LMS notes, payments, portfolio, and team images.

## Recommended Locations for New Features
- New user-facing pages: `src/app/<feature>/page.tsx`
- New API endpoints: `src/app/api/<feature>/route.ts`
- New reusable UI: `src/components/<feature>/`
- New shared logic: `src/lib/`
- New database tables: `src/lib/schema.sql` and related migration scripts
