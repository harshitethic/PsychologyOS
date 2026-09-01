# Psychology Student OS

A full-stack psychology learning platform built to help a friend with their college psychology coursework.

I wanted to build something more useful than a basic notes website, so I turned the idea into a complete student-focused platform with structured study material, revision tools, exams, progress tracking, community features, authentication, and an AI tutor.

This project was also an opportunity to experiment with building and deploying a real-world full-stack application from end to end.

> **Note:** This is an independent educational software project and is not affiliated with any university or institution.

## Features

- 📚 Structured psychology topics and study notes
- 🧠 Quick explanations and detailed notes
- 🔑 Key terms and important concepts
- 👨‍🔬 Psychologists and their contributions
- 📝 Exam-focused revision material
- 🃏 Flashcards
- ❓ Practice MCQs
- 📊 Mock exams and progress tracking
- 🔎 Study-content search
- 👤 Student profiles
- 👥 Student community
- 💬 Feedback system
- 🤖 AI psychology tutor
- 🔐 Student authentication
- 🛠️ Admin dashboard and moderation

## AI Tutor

The development version uses [Ollama](https://ollama.com/) for local LLM inference.

The AI route sends the student's question and relevant conversation context to a locally running Ollama model. This means the standard local setup does not require a paid AI API.

### Recommended model

```env
OLLAMA_MODEL=qwen2.5:3b
```

You can use another model supported by your Ollama installation.

## Tech Stack

### Frontend

- Next.js 15
- React
- TypeScript
- CSS
- Lucide React

### Backend

- Next.js App Router
- Next.js API routes
- Prisma ORM
- SQLite
- bcryptjs

### AI

- Ollama
- Local LLM inference

## Requirements

- Node.js 20+
- npm
- Git
- Ollama

## Installation

Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
cd psychology-student-os
```

Install dependencies:

```bash
npm install
```

Generate the Prisma client:

```bash
npx prisma generate
```

Create your environment file:

```bash
cp .env.example .env
```

Then edit `.env` with your own local values.

Example:

```env
DATABASE_URL="file:./dev.db"

SESSION_SECRET="replace-with-a-long-random-secret"

ADMIN_USERNAME="admin"
ADMIN_SESSION_SECRET="replace-with-another-long-random-secret"

OLLAMA_MODEL="qwen2.5:3b"
```

## Database setup

Push the Prisma schema:

```bash
npx prisma db push
```

Seed the psychology content:

```bash
npm run db:seed
```

## Run the AI tutor

Start Ollama:

```bash
ollama serve
```

In another terminal, download the recommended model:

```bash
ollama pull qwen2.5:3b
```

## Run the application

Development:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

Production build:

```bash
npm run build
```

Production server:

```bash
npm run start
```

## Project structure

```text
psychology-student-os/
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
│
├── components/
│   ├── AITutorChat.tsx
│   ├── AdminClient.tsx
│   └── Sidebar.tsx
│
├── lib/
│   ├── auth.ts
│   └── prisma.ts
│
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
│
├── public/
├── scripts/
├── next.config.ts
├── package.json
└── README.md
```

## Authentication

The application includes:

- Student signup and login
- Username/email login
- Password hashing with bcrypt
- HTTP-only session cookies
- Logout
- Password recovery flow
- Admin authentication
- Admin password management
- Account moderation

## Database

The default setup uses Prisma with SQLite, keeping local development simple without requiring a separate database server.

The database stores application data including:

- users
- subjects
- units
- topics
- flashcards
- MCQs
- exam attempts
- progress
- AI conversations
- psychologists
- community messages
- feedback

## AI conversation memory

The AI tutor stores conversation history in the database and uses recent conversation context when answering questions.

The current implementation keeps tutor conversations for approximately seven days.

## Security

This project is primarily an educational and learning project.

Before using it as a large public production service, additional security hardening should be considered:

- rate limiting
- stricter request validation
- abuse prevention for AI endpoints
- production database configuration
- centralized logging and monitoring
- stronger session management
- production secret management
- additional automated tests

### Never commit secrets

Do not commit:

```text
.env
.env.local
.env.production
```

Do not put API tokens, passwords, private keys, or other credentials in source code.

## Environment variables

Use `.env.example` as the template for local configuration.

Example:

```env
DATABASE_URL="file:./dev.db"
SESSION_SECRET="replace-me"
ADMIN_USERNAME="admin"
ADMIN_SESSION_SECRET="replace-me"
OLLAMA_MODEL="qwen2.5:3b"
```

Generate strong random secrets for real deployments.

## Deployment

The application can run on a standard Linux VPS without a GPU.

The web application itself does not require GPU hardware. Local AI inference through Ollama does not require a GPU either, although model performance depends heavily on the available CPU, RAM, and model size.

The AI layer can also be adapted to an external inference provider if desired.

## Why this project exists

The original goal was practical: help a friend with college psychology coursework.

Instead of stopping at a collection of notes, I used the project to explore how a real student platform could be designed and built, including:

- persistent data
- authentication
- educational content
- quizzes and exams
- progress tracking
- search
- community features
- administration
- local AI integration
- production deployment

## Project status

This is an independently developed project and may continue to evolve.

It is primarily intended as a learning project and an example of full-stack application development.

## Disclaimer

Psychology Student OS is an educational study tool.

Its content and AI responses are intended for learning and revision and should not be treated as professional psychological, medical, diagnostic, or clinical advice.

## License

Choose and add a license if you want others to reuse or modify the project.

For example:

```text
MIT License
```

If you use the MIT License, add the standard MIT `LICENSE` file to the repository.
