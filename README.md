# Intelligence Platform

A full-stack AI-powered developer platform for code analysis, interview preparation, coding practice, and structured learning roadmaps.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Tailwind CSS, Monaco Editor |
| Backend | Node.js, Express 5, TypeScript (OOP) |
| Database | MongoDB + Mongoose ODM |
| Auth | JWT (jsonwebtoken + bcryptjs) |
| AI | Google Gemini (multi-key, load-balanced) |

---

## Architecture

```
backend/src/
├── interfaces/       # TypeScript interfaces (SOLID: ISP)
├── models/           # Mongoose schemas
├── repositories/     # Data access layer (SRP)
├── services/         # Business logic (OCP, DIP)
├── controllers/      # HTTP handlers (SRP)
├── middleware/       # JWT auth, role guard
├── routes/           # Express router
├── config/           # DB connection
└── utils/            # Seed script

frontend/src/
├── context/          # AuthContext (React Context API)
├── services/         # Axios API client
├── components/layout # Sidebar layout
└── pages/            # Dashboard, Code, Interview, Practice, Roadmap
```

---

## Features

- **Auth** — JWT signup/login, role-based (user/admin), bcrypt hashed passwords
- **Code Intelligence** — Monaco Editor, AI complexity analysis, anti-pattern detection, code explanation
- **Interview Prep** — AI-generated questions by role/category/difficulty, timer-based mock sessions, AI evaluation with score + feedback
- **Practice Platform** — Coding problems with test cases, submission tracking, leaderboard
- **Roadmap** — Internship & placement paths, topic progress tracking, AI recommendations
- **Multi-key AI** — Load-balanced Gemini keys with automatic fallback

---

## Setup

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Google Gemini API key(s) — [Get one free](https://aistudio.google.com/app/apikey)

### 1. Backend

```bash
cd backend
npm install
cp .env .env.local   # edit with your values
```

Edit `.env`:
```
MONGO_URI=mongodb://localhost:27017/intelligence_platform
JWT_SECRET=your_secret_here
GEMINI_API_KEY_1=your_key_for_code_analysis
GEMINI_API_KEY_2=your_key_for_questions
# Add up to GEMINI_API_KEY_6 for load balancing
```

```bash
npm run seed    # populate DB with roadmaps + practice questions
npm run dev     # starts on http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev     # starts on http://localhost:5173
```

The Vite dev server proxies `/api` → `http://localhost:5000`.

---

## API Reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | — | Register user |
| POST | `/api/auth/login` | — | Login |
| GET | `/api/auth/me` | ✓ | Current user |
| POST | `/api/code/analyze` | ✓ | AI code analysis |
| POST | `/api/code/explain` | ✓ | AI code explanation |
| POST | `/api/interview/sessions` | ✓ | Start interview session |
| POST | `/api/interview/answers` | ✓ | Submit + evaluate answer |
| PATCH | `/api/interview/sessions/:id/complete` | ✓ | Complete session |
| GET | `/api/interview/sessions` | ✓ | User's session history |
| GET | `/api/practice/questions` | ✓ | List problems |
| POST | `/api/practice/submit` | ✓ | Submit solution |
| GET | `/api/practice/leaderboard` | — | Top scores |
| GET | `/api/roadmaps` | ✓ | All roadmaps |
| POST | `/api/roadmaps/progress` | ✓ | Update progress |
| GET | `/api/roadmaps/:id/recommend` | ✓ | AI recommendation |

---

## Data Models

```
User ──< InterviewSession ──< Question
                          └──< Answer ──(embedded) Evaluation

User ──< Submission >── PracticeQuestion (embedded TestCases)
User ──< Progress >── Roadmap (embedded Topics)
```

---

## AI Key Strategy

```
GEMINI_API_KEY_1          → Code analysis (dedicated)
GEMINI_API_KEY_2..6       → Question generation + evaluation (round-robin)
```

All calls use automatic fallback: if one key fails, the next is tried.
