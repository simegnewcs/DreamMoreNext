# Database Documentation

## Database Overview
The platform uses MySQL as its primary relational database. Connection pooling is managed through `src/lib/db.ts`.

## Core Tables

### `users`
Stores user accounts, authentication values, roles, and profile data.

### `courses`
Stores course catalog information including title, description, pricing, duration, category, and status.

### `applications`
Tracks course application submissions and review state.

### `blogs`
Stores published blog posts and content metadata.

### `testimonials`
Stores public testimonial records.

### `portfolio`
Stores portfolio project items.

## LMS Tables
The LMS schema adds:
- `course_phases`
- `weekly_content`
- `class_videos`
- `class_notes`
- `assignments`
- `student_progress`
- `enrollment_phase_progress`

## Relationships
- `applications.course_id` references `courses.id`
- `applications.user_id` references `users.id`
- `modules.course_id`, `outcomes.course_id`, `requirements.course_id`, `technologies.course_id`, and `faqs.course_id` all reference `courses.id`
- LMS tables are linked through course phase, week, and content relationships

## Migration Process
- SQL schema files are stored in `src/lib/schema.sql` and `src/lib/lms-schema.sql`
- Helper scripts in `scripts/` can be used to create additional tables
- New database changes should be captured as SQL migrations and documented
