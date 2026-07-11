# System Architecture

## High-Level Architecture
The application follows a modular Next.js architecture with server-rendered pages and route handlers. The UI is composed of React components and the backend logic is implemented through Next.js API routes and shared library modules.

```text
Client Browser
  -> Next.js App Router Pages / Components
  -> API Routes (src/app/api)
  -> Shared Libraries (src/lib)
  -> MySQL Database
  -> Cloudinary / Email / Google OAuth / External services
```

## Frontend Architecture
- Built with Next.js 16 and React 19
- Uses the App Router under `src/app`
- Reusable UI components live under `src/components`
- Theme and auth context are managed in `src/context`
- Tailwind CSS is used for styling
- Framer Motion and GSAP are used for animations

## Backend Architecture
- API routes are implemented in `src/app/api`
- Authentication and authorization logic lives in `src/lib/auth.ts`
- Database access uses a MySQL connection pool in `src/lib/db.ts`
- Shared business logic sits in `src/lib` and route handlers coordinate data access

## Database Architecture
- MySQL is the primary relational database
- Core tables include users, courses, applications, blogs, testimonials, portfolio, and LMS tables
- Schema files are stored in `src/lib/schema.sql` and `src/lib/lms-schema.sql`
- SQL setup helpers are available in `scripts/`

## External Services and Integrations
- Google OAuth via NextAuth
- Cloudinary for media upload and storage
- Nodemailer for email delivery
- Optional external deployment targets such as Vercel or traditional servers

## Authentication and Authorization Flow
1. Users authenticate through login, registration, or Google OAuth.
2. Password-based auth uses bcrypt and JWT.
3. NextAuth manages Google sign-in and session information.
4. Protected routes and API actions rely on token or session validation.
