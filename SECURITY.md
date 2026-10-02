# Security Policy

PsychologyOS includes authentication, sessions, user-generated data, administration features, and a local AI integration. Security reports are welcome and should be handled carefully.

## Supported code

The project currently develops from the `main` branch and does not publish a formal long-term support matrix. Security fixes should target the latest code unless a release-specific issue is explicitly identified.

## Reporting a vulnerability

Please do **not** publish exploit details, credentials, session tokens, private user data, or proof-of-concept payloads in a public issue.

Preferred reporting flow:

1. Use GitHub private vulnerability reporting if it is enabled for this repository.
2. If private reporting is unavailable, open a minimal public issue that says you have a security concern and need a private contact channel. Do not include exploit details in that issue.
3. Include the affected component, impact, reproduction steps, and any safe mitigation information in the private report.

Good reports make it easier to reproduce and fix the issue without exposing users.

## Areas that deserve extra care

Changes touching these areas should receive additional review:

- signup, login, logout, and password recovery
- student and admin session handling
- authorization checks and account moderation
- Prisma/database queries and migrations
- community/user-generated content
- AI tutor APIs and persisted conversations
- environment variables and secret loading
- file or network access introduced by future features

## Secrets

Never commit credentials or production secrets.

Local secret files such as the following should stay outside source control:

```text
.env
.env.local
.env.production
```

Use long random values for session secrets and separate admin secrets from normal user-session secrets.

## Security expectations for contributions

- Validate and constrain untrusted input at API boundaries.
- Enforce authorization server-side; UI hiding is not authorization.
- Avoid exposing sensitive error details to clients.
- Use secure, HTTP-only cookies for authenticated sessions.
- Keep dependencies current and review security-impacting upgrades.
- Do not log passwords, session tokens, recovery tokens, or private conversation content.
- Treat AI output as untrusted application content and never as an authorization decision.
- Add regression coverage for security-sensitive fixes when practical.

## Scope note

PsychologyOS is an educational project, not a clinical or diagnostic system. Security fixes should protect application and user data without presenting AI-generated psychology content as professional medical advice.
