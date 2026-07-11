# Installation and Setup Guide

## Prerequisites
- Node.js 20 or newer
- npm or pnpm
- MySQL 8.x
- A mail provider or SMTP credentials
- Cloudinary credentials for media uploads
- Google OAuth credentials for Google sign-in

## Environment Variables
Create a `.env.local` file in the project root with the following variables:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_PORT=3306
DB_NAME=dreammore

JWT_SECRET=your_jwt_secret
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

EMAIL_HOST=smtp.example.com
EMAIL_PORT=465
EMAIL_SECURE=true
EMAIL_USER=your_email
EMAIL_PASSWORD=your_password
EMAIL_FROM=DreamMore <no-reply@example.com>
```

## Dependency Installation
```bash
npm install
```

## Database Setup
1. Create a MySQL database named `dreammore`.
2. Import the schema from `src/lib/schema.sql`.
3. Import LMS schema from `src/lib/lms-schema.sql` if LMS features are required.
4. Optionally run scripts under `scripts/` for additional tables.

## Running the Project
### Development
```bash
npm run dev
```
Open `http://localhost:3000`.

### Production Build
```bash
npm run build
npm run start
```
