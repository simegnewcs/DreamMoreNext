# Configuration Guide

## Environment Configuration
Environment values are loaded from `.env.local` and consumed by modules under `src/lib` and route handlers.

### Core Settings
- `DB_*` values control MySQL connectivity.
- `JWT_SECRET` is used for JWT signing.
- `NEXTAUTH_SECRET` and `NEXTAUTH_URL` are used by NextAuth.
- `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_APP_URL` configure client-side URLs.

## API Endpoints
The app uses internal Next.js API endpoints such as:
- `/api/auth/*` for sign-in, register, password reset, and verification
- `/api/courses` for public course data
- `/api/applications` for course applications
- `/api/blogs`, `/api/team`, `/api/portfolio`, `/api/testimonials` for content APIs
- `/api/admin/*` for administrative operations

## Third-Party Integrations
- Google OAuth: configure `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
- Cloudinary: configure upload storage credentials
- SMTP: configure email delivery settings

## Deployment Configuration
For deployment, make sure:
- environment variables are set in the target platform
- the build process uses `npm run build`
- the app runs behind a production server with Node.js support
- the database is accessible from the hosting environment
