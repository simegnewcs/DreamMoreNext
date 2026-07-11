# Development Guidelines

## Coding Standards
- Use TypeScript for new code.
- Prefer reusable components and shared logic in `src/lib` or `src/components`.
- Follow existing naming patterns and folder organization.
- Keep API routes focused on request validation and business logic coordination.

## Naming Conventions
- Files and folders use lowercase and hyphenation where appropriate.
- React components use PascalCase.
- Utility functions use camelCase.
- Route handlers are named `route.ts`.

## Best Practices
- Validate request inputs before database access.
- Handle errors gracefully and return clear JSON responses from API routes.
- Keep secrets in `.env.local` and never commit them to source control.
- Prefer small, focused modules over large monolithic files.

## Git Workflow Recommendations
- Create a feature branch for each change.
- Keep commits focused and descriptive.
- Open pull requests with a brief summary and testing notes.
- Ensure the app builds successfully before merging.
