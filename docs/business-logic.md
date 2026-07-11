# Core Business Logic

## Course Enrollment Workflow
1. A visitor explores public course pages.
2. They submit an application through the course application flow.
3. The application is stored in the `applications` table with a pending status.
4. Admins review and update the status to approved, rejected, or under review.

## User Authentication Flow
- New users register and receive a verification email.
- Verified accounts can sign in.
- Password reset requests create a token and send a reset email.

## LMS Learning Flow
- Course phases and weeks are organized in the LMS schema.
- Students progress through videos, notes, and assignments.
- Progress is tracked in `student_progress` and `enrollment_phase_progress`.

## Media Upload Flow
- Images and documents are uploaded through API routes.
- Files are stored via Cloudinary and referenced by database records.

## Admin Content Management
- Admin routes allow management of users, courses, blogs, testimonials, portfolio items, and trusted brands.
- Content changes are persisted directly to the MySQL database.
