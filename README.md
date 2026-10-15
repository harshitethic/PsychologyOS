# Psychology Student OS

A full-stack psychology learning platform built to make college study more structured, interactive, and practical.

Psychology Student OS goes beyond static notes with study material, revision tools, flashcards, MCQs, mock exams, progress tracking, search, community features, authentication, admin tools, and a locally-powered AI tutor.

> **Note:** This is an independent educational software project and is not affiliated with any university or institution.

## What it includes

- 📚 Structured psychology topics, units, and study notes
- 🧠 Quick explanations, detailed notes, key terms, and concepts
- 👨‍🔬 Psychologists and their contributions
- 📝 Exam-focused revision material
- 🃏 Flashcards and practice MCQs
- 📊 Mock exams and progress tracking
- 🔎 Study-content search
- 👤 Student profiles and community features
- 💬 Feedback system
- 🤖 AI psychology tutor with local LLM support
- 🔐 Student and admin authentication
- 🛠️ Admin dashboard and moderation tools

## AI Tutor

The local development setup uses [Ollama](https://ollama.com/) for LLM inference, so the standard setup does not require a paid AI API.

Recommended model:

```env
OLLAMA_MODEL=qwen2.5:3b
```

Any Ollama-compatible model can be used by changing the environment variable.

## Tech stack

**Frontend**

- Next.js 15
- React 19
- TypeScript
- CSS
- Lucide React
- Framer Motion
- Recharts / React Flow where needed

**Backend**

- Next.js App Router and API routes
- Prisma ORM
- SQLite
- bcryptjs

**AI**

- Ollama
- Local LLM inference

## Requirements

- Node.js 20+
- npm
- Git
- Ollama (only required for the local AI tutor)

## Getting started

Clone the repository:

```bash
git clone https://github.com/harshitethic/PsychologyOS.git
cd PsychologyOS
```

Install dependencies:

```bash
npm install
```

Create your local environment file:

```bash
cp .env.example .env
```

Generate the Prisma client:

```bash
npx prisma generate
```

Push the database schema:

```bash
npx prisma db push
```

Seed the psychology content:

```bash
npm run db:seed
```

Reseeding preserves existing question/card IDs and student history. Changed
resources are added without deleting their predecessors; existing mock papers
keep their questions and order. Read the [seeding and recovery boundaries](docs/curriculum-seeding.md)
before updating an installation with learners.

Start the app:

```bash
npm run dev
```

Open `http://localhost:3000`.

### Environment example

```env
DATABASE_URL="file:./dev.db"
SESSION_SECRET="replace-with-a-long-random-secret"
ADMIN_USERNAME="admin"
ADMIN_SESSION_SECRET="replace-with-another-long-random-secret"
OLLAMA_MODEL="qwen2.5:3b"
```

### Start the local AI tutor

In a separate terminal:

```bash
ollama serve
ollama pull qwen2.5:3b
```

## Useful scripts

```bash
npm run dev          # Start the development server
npm run build        # Generate Prisma client and create a production build
npm run start        # Start the production server
npm run db:push      # Push the Prisma schema to the database
npm run db:seed      # Seed psychology learning content
npm run db:studio    # Open Prisma Studio
npm run verify       # Generate Prisma client and type-check the project
npm run doctor       # Validate key project files and environment configuration
npm run smoke        # Run a local HTTP smoke test against the running app
npm run check        # Run the project's type-checking verification
npm run test:seed-preservation # Exercise reseeding and rollback in disposable SQLite
npm run test:http-auth # After build: verify real HTTP auth against disposable SQLite
```

## Project structure

```text
PsychologyOS/
├── app/
│   ├── api/
│   ├── ai/
│   ├── dashboard/
│   ├── exams/
│   ├── community/
│   ├── profile/
│   ├── psychologists/
│   ├── revision/
│   ├── search/
│   ├── semesters/
│   ├── topics/
│   ├── login/
│   └── signup/
├── components/
│   ├── AITutorChat.tsx
│   ├── AdminClient.tsx
│   └── Sidebar.tsx
├── lib/
│   ├── auth.ts
│   └── prisma.ts
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── public/
├── screenshots/
├── scripts/
├── .github/
│   └── workflows/
│       └── ci.yml
├── next.config.ts
├── package.json
└── README.md
```

## Authentication and data

The app includes student signup/login, username or email login, bcrypt password hashing, HTTP-only sessions, password recovery, admin authentication, and account moderation.

The default Prisma + SQLite setup keeps local development simple. The database can store users, subjects, units, topics, flashcards, MCQs, exam attempts, progress, AI conversations, psychologists, community messages, and feedback.

AI tutor conversations are persisted so recent conversation context can be reused during tutoring sessions. The current implementation keeps tutor conversations for approximately seven days.

## Verification and CI

The repository includes lightweight local checks plus GitHub Actions CI. Every push to `main` and every pull request runs dependency installation, the project verification/type-check step, and the project doctor check.

For local verification:

```bash
npm run check
npm run doctor
```

For a running local server:

```bash
npm run smoke
```

## Security notes

This project is primarily an educational/full-stack development project. Before operating it as a large public service, add production-grade rate limiting, stricter request validation, AI abuse prevention, centralized logging, stronger session management, secure secret management, and more comprehensive automated tests.

Production HTTP tests now verify student identity boundaries and admin session
revocation after password changes or account deletion. See the
[authentication design, reproduction and remaining limits](docs/http-authentication.md).
Deploying this session-format update requires existing admins to sign in again.

Never commit secrets such as:

```text
.env
.env.local
.env.production
```

Do not put API tokens, passwords, private keys, or other credentials into source code.

## Deployment

The web application can run on a standard Linux VPS. The local AI layer can run through Ollama, with performance depending on the chosen model and available CPU/RAM (and GPU when available).

For production deployments, use a production-appropriate database and secret-management strategy rather than relying on local SQLite defaults.

## Why this project exists

The original goal was simple: build a genuinely useful study tool for college psychology coursework.

It became a practical full-stack project covering persistent data, authentication, educational content, exams, progress tracking, search, community features, administration, local AI integration, and deployment workflows.

## Disclaimer

Psychology Student OS is an educational study tool. Its content and AI responses are intended for learning and revision and should not be treated as professional psychological, medical, diagnostic, or clinical advice.

## Screenshots

### Landing page
![PsychologyOS landing page](screenshots/home.png)

### Authentication
![PsychologyOS login](screenshots/login.png)

### Student dashboard
![PsychologyOS dashboard](screenshots/dashboard.png)

### Topic learning
![PsychologyOS topic view](screenshots/topic.png)

### AI psychology tutor
![PsychologyOS AI tutor](screenshots/ai-tutor.png)

### Student community
![PsychologyOS community](screenshots/community.png)

### Mock exams
![PsychologyOS mock exams](screenshots/mock-exams.png)


### Admin credential setup (security)

Run admin setup explicitly with a **unique** password rather than relying on
the insecure defaults found in earlier versions:

```bash
ADMIN_USERNAME=admin ADMIN_PASSWORD='a-unique-long-private-password' npm run admin:setup
```

The command writes only `ADMIN_PASSWORD_HASH` and a fresh
`ADMIN_SESSION_SECRET` into the local ignored `.env`, preserving other entries.
It uses a private, exclusive temporary file and atomic rename, refuses existing
`.env` symlinks, and never prints the password or session secret. The legacy
`npm run admin:local` command now uses the same secure provisioner. Run it
from the project root. On systems without `O_NOFOLLOW`, use a supported
filesystem/platform for credential provisioning.

**Important:** Run credential setup before an initial admin login. Existing
database admin accounts keep their stored password hash; rewriting `.env`
does not silently reset that account. Change an existing password using the
admin password workflow or a carefully planned database recovery procedure.

Production requires a strong `ADMIN_SESSION_SECRET`; a missing or short secret
now fails closed rather than using a predictable shared key. Development uses
a random in-process fallback, which expires sessions on restart. Never publish
`.env`, session cookies, database files or administrative credentials.
