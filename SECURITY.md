# Security Policy

## Supported version

Security fixes target the current `main` branch.

## Reporting a vulnerability

Please do not disclose an exploitable vulnerability, credentials, session cookies, or private user data in a public issue. Include reproduction steps, impact, and sanitized logs.

## Priority areas

PsychologyOS includes authentication, admin functionality, persistent user data, Prisma/SQLite, and a local AI tutor. Security reports are especially useful for:

- authentication or authorization bypasses;
- admin privilege escalation;
- weak or predictable session handling;
- cross-site scripting, CSRF, and unsafe input rendering;
- insecure direct object references;
- database exposure or unsafe Prisma queries;
- leakage of `SESSION_SECRET`, admin secrets, or environment variables;
- AI endpoints exposing stored conversation or user data.

Development defaults should not be reused unchanged on a public deployment.

## Secrets

Use strong unique production secrets and keep `.env` files out of version control.
