# Deployment Guide

## Build Process
Run the following before deployment:

```bash
npm install
npm run build
```

## Production Deployment Steps
1. Set production environment variables on the host.
2. Ensure the database is reachable and schema is applied.
3. Run the production server with `npm run start` or use a process manager.
4. Configure reverse proxy and TLS if required.

## Server Requirements
- Node.js runtime
- MySQL database
- Environment variables configured securely
- Static/media storage configured for uploads

## CI/CD
If a CI/CD pipeline is introduced, recommended steps are:
- install dependencies
- run linting and build checks
- run database migrations or schema validation
- deploy to the target environment
