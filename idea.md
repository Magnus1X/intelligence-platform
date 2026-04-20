# 💡 Project Idea — Intelligence Platform

> **An AI-powered developer growth platform that unifies code analysis, interview preparation, coding practice, and career roadmaps into a single, intelligent ecosystem.**

---

## 1. Problem Statement

Aspiring developers preparing for internships and placements face a fragmented learning landscape:

- **Code review** is manual — students write code but rarely get instant, structured feedback on complexity, anti-patterns, or readability.
- **Interview preparation** lacks realism — most platforms offer static question banks with no timed simulation or AI-driven evaluation.
- **Practice platforms** exist in isolation — solving problems on one site, tracking progress on another, and following roadmaps on a third creates context-switching overhead.
- **Career roadmaps** are generic — a one-size-fits-all checklist doesn't adapt to the individual's current skill level or goal (internship vs. placement).

**There is no single platform that connects all four pillars — Code, Interview, Practice, Roadmap — with a unified AI backbone.**

---

## 2. Proposed Solution

**Intelligence Platform** is a full-stack web application that brings together four core modules under one roof, each powered by Google's Gemini AI:

| Module | What it does |
|---|---|
| **Code Intelligence** | Paste any code snippet → get instant AI analysis: time/space complexity, anti-pattern detection, and a plain-English explanation. |
| **Interview Prep** | Start a role-specific mock interview with a live timer → answer AI-generated questions → receive a score and detailed feedback per answer. |
| **Practice Platform** | Browse curated coding problems by difficulty → write and run solutions in-browser → submit, track progress, and climb the leaderboard. |
| **Roadmap Guidance** | Follow structured internship/placement roadmaps → check off topics as you go → get AI-generated study recommendations for what's next. |

All four modules feed into a **unified dashboard** that aggregates the user's activity, performance trends, and skill growth across the platform.

---

## 3. Core Features

### 3.1 Authentication & Authorization
- JWT-based signup and login with bcrypt-hashed passwords.
- Role-based access control: **User** (student) and **Admin** roles.
- Persistent sessions with token-based authentication middleware.

### 3.2 Code Intelligence Module
- Integrated **Monaco Editor** (the editor behind VS Code) for a professional coding experience.
- **AI Code Analysis**: paste any code and receive:
  - Time complexity (Big-O notation)
  - Space complexity
  - Anti-pattern detection with improvement suggestions
- **AI Code Explanation**: get a beginner-friendly breakdown of what the code does, line by line.

### 3.3 Interview Preparation Module
- **Role Selection**: choose the job role you're preparing for (e.g., Frontend Developer, Backend Engineer, Data Analyst).
- **AI Question Generation**: Gemini generates role-specific interview questions categorized by difficulty and type (technical, behavioral, situational).
- **Timed Mock Sessions**: live countdown timer simulates real interview pressure.
- **AI Evaluation**: each answer is scored (0–10) with detailed feedback covering strengths, weaknesses, and improvement suggestions.
- **Session History**: review past sessions, scores, and feedback at any time.

### 3.4 Practice Platform Module
- **Problem Bank**: curated coding problems with descriptions, constraints, sample inputs/outputs, and embedded test cases.
- **In-Browser Code Runner**: write solutions and run them against test cases without leaving the platform.
- **Submission Tracking**: track your solve history, status (Accepted / Wrong Answer / Error), and execution results.
- **Leaderboard**: public ranking of users by problems solved and performance score.
- **Admin Problem Creation**: admin users can add new problems with custom test cases.

### 3.5 Roadmap Module
- **Structured Paths**: pre-built roadmaps for internship preparation and full-time placement.
- **Topic Progress Tracking**: check off individual topics as you complete them; progress bar updates in real time.
- **AI Recommendations**: ask Gemini for personalized study tips based on your current progress and uncovered topics.

### 3.6 Dashboard
- **Stats Cards**: total interview sessions, practice problems solved, roadmap progress percentage, and code analyses performed.
- **Activity Chart**: visual representation of recent platform activity.
- **Quick Actions**: jump directly into any module from the dashboard.

---

## 4. Tech Stack

| Layer | Technology | Why |
|---|---|---|
| **Frontend** | React 19, TypeScript, Tailwind CSS, React Router | Modern SPA with type safety and utility-first styling |
| **Code Editor** | Monaco Editor | VS Code-grade editing experience in the browser |
| **Backend** | Node.js, Express 5, TypeScript | Fast, typed API layer with the latest Express version |
| **Database** | MongoDB + Mongoose ODM | Flexible document model ideal for varied data shapes (questions, sessions, roadmaps) |
| **Authentication** | JWT + bcryptjs | Stateless auth with secure password hashing |
| **AI Engine** | Google Gemini (Generative AI) | Multi-modal, high-quality code understanding and natural language generation |
| **Deployment** | Vercel (frontend) + Render (backend) | Zero-config frontend hosting + managed Node.js backend |

---

## 5. Architecture Overview

The application follows a **layered OOP architecture** adhering to SOLID principles:

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                             │
│   React 19 + TypeScript + Tailwind CSS + Monaco Editor      │
│   Pages: Landing | Auth | Dashboard | Code | Interview      │
│           Practice | Roadmap                                │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTPS (REST API)
┌──────────────────────────▼──────────────────────────────────┐
│                        BACKEND                              │
│                                                             │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────────┐  │
│  │ Controllers  │→│   Services   │→│   Repositories    │  │
│  │ (HTTP layer) │  │ (Business    │  │ (Data access      │  │
│  │              │  │  logic)      │  │  layer)           │  │
│  └─────────────┘  └──────┬───────┘  └────────┬──────────┘  │
│                          │                    │             │
│                   ┌──────▼───────┐    ┌───────▼──────────┐  │
│                   │  AI Service  │    │    MongoDB        │  │
│                   │  (Gemini)    │    │    (Mongoose)     │  │
│                   └──────────────┘    └──────────────────┘  │
│                                                             │
│  Middleware: JWT Auth │ Role Guard │ CORS │ Helmet          │
└─────────────────────────────────────────────────────────────┘
```

### Directory Structure

```
backend/src/
├── config/           # Database connection setup
├── constants/        # Application-wide constants
├── controllers/      # HTTP request handlers (SRP)
├── interfaces/       # TypeScript interfaces (ISP)
├── middleware/        # JWT authentication, role-based guards
├── models/           # Mongoose schemas and models
├── repositories/     # Data access layer (SRP, DIP)
├── routes/           # Express route definitions
├── services/         # Business logic layer (OCP, DIP)
└── utils/            # Seed scripts and helpers

frontend/src/
├── components/       # Reusable UI components (Sidebar, Layout)
├── context/          # React Context API (AuthContext)
├── hooks/            # Custom React hooks
├── interfaces/       # TypeScript type definitions
├── pages/            # Page-level components
├── services/         # Axios API client layer
└── utils/            # Utility functions
```

---

## 6. Data Model

```
User ──< InterviewSession ──< Question
                           └──< Answer ──(embedded) Evaluation

User ──< Submission >── PracticeQuestion (embedded TestCases)
User ──< Progress   >── Roadmap (embedded Topics)
```

### Key Entities

| Entity | Description |
|---|---|
| **User** | Stores name, email, hashed password, role (user/admin), and timestamps |
| **InterviewSession** | Tracks a mock interview: role, status (active/completed), linked user |
| **Question** | AI-generated interview question with difficulty and category |
| **Answer** | User's response with AI-assigned score, strengths, weaknesses, and suggestions |
| **PracticeQuestion** | Coding problem with description, constraints, and embedded test cases |
| **Submission** | User's code submission with status, execution results, and timestamps |
| **Roadmap** | Structured learning path with embedded topics and progress tracking |

---

## 7. AI Strategy

### Multi-Key Load Balancing

The platform uses up to **6 Gemini API keys** with intelligent load distribution:

```
GEMINI_API_KEY_1          → Dedicated to code analysis (high priority)
GEMINI_API_KEY_2..6       → Round-robin for question generation + evaluation
```

### Automatic Fallback

If a key hits its rate limit or fails, the system automatically rotates to the next available key — ensuring **zero downtime** on AI features.

### AI Use Cases

| Use Case | Input | Output |
|---|---|---|
| Code Analysis | Source code snippet | Time/space complexity, anti-patterns, suggestions |
| Code Explanation | Source code snippet | Plain-English line-by-line breakdown |
| Question Generation | Role + difficulty + category | Structured interview question |
| Answer Evaluation | Question + user's response | Score (0–10), strengths, weaknesses, suggestions |
| Roadmap Recommendation | Current progress data | Personalized study tips and next steps |

---

## 8. API Design

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | — | Register a new user |
| `POST` | `/api/auth/login` | — | Login and receive JWT |
| `GET` | `/api/auth/me` | ✓ | Get current user profile |
| `GET` | `/api/dashboard/stats` | ✓ | Aggregated user statistics |
| `POST` | `/api/code/analyze` | ✓ | AI code analysis |
| `POST` | `/api/code/explain` | ✓ | AI code explanation |
| `POST` | `/api/interview/sessions` | ✓ | Start a new mock interview |
| `POST` | `/api/interview/answers` | ✓ | Submit and evaluate an answer |
| `PATCH` | `/api/interview/sessions/:id/complete` | ✓ | Mark session as completed |
| `GET` | `/api/interview/sessions` | ✓ | User's session history |
| `GET` | `/api/interview/sessions/:id` | ✓ | Detailed session view |
| `GET` | `/api/practice/questions` | ✓ | List all coding problems |
| `GET` | `/api/practice/questions/:id` | ✓ | Single problem details |
| `POST` | `/api/practice/run` | ✓ | Run code against test cases |
| `POST` | `/api/practice/submit` | ✓ | Submit a solution |
| `GET` | `/api/practice/submissions` | ✓ | User's submission history |
| `GET` | `/api/practice/leaderboard` | — | Public leaderboard |
| `POST` | `/api/practice/questions` | Admin | Create a new problem |
| `GET` | `/api/roadmaps` | ✓ | All available roadmaps |
| `GET` | `/api/roadmaps/:id` | ✓ | Single roadmap details |
| `POST` | `/api/roadmaps/progress` | ✓ | Update topic progress |
| `GET` | `/api/roadmaps/:id/recommend` | ✓ | AI study recommendations |

---

## 9. User Flow

```
┌──────────┐     ┌──────────┐     ┌─────────────┐
│  Landing  │ ──→ │  Auth    │ ──→ │  Dashboard  │
│  Page     │     │ (Login/  │     │  (Hub)      │
└──────────┘     │ Register)│     └──────┬──────┘
                  └──────────┘            │
                                          ├──→ Code Intelligence
                                          ├──→ Interview Prep
                                          ├──→ Practice Platform
                                          └──→ Roadmap Guidance
```

1. **New user** lands on the marketing page → clicks "Get Started" → registers.
2. **Returning user** logs in → lands on the dashboard with activity summary.
3. **From the dashboard**, the user navigates to any of the four modules via the sidebar.
4. **Each module** operates independently but contributes data to the unified dashboard stats.

---

## 10. Deployment Architecture

```
┌───────────────────────┐         ┌───────────────────────┐
│      Vercel            │         │       Render           │
│  (Frontend Hosting)    │  HTTPS  │  (Backend Hosting)     │
│                        │ ──────→ │                        │
│  React SPA             │         │  Node.js + Express 5   │
│  intelligence-platform │         │  intelligence-platform │
│  -ochre.vercel.app     │         │  -1ral.onrender.com    │
└───────────────────────┘         └──────────┬────────────┘
                                              │
                                     ┌────────▼────────┐
                                     │  MongoDB Atlas   │
                                     │  (Cloud DB)      │
                                     └─────────────────┘
```

- **Frontend**: Deployed on Vercel with automatic builds from `main` branch.
- **Backend**: Deployed on Render with `npm install && npm run build` as the build command.
- **Database**: MongoDB Atlas cloud cluster for production persistence.
- **CORS**: Manual CORS middleware reflecting the requesting origin for cross-domain API calls.

---

## 11. Security Considerations

- **Password Hashing**: All passwords are hashed with bcrypt before storage.
- **JWT Tokens**: Stateless authentication with configurable expiry (`JWT_EXPIRES_IN`).
- **Role-Based Guards**: Admin-only routes are protected by a `requireAdmin` middleware.
- **Helmet.js**: HTTP security headers are applied to all responses.
- **Input Validation**: JSON body size is capped at 2MB to prevent abuse.
- **API Key Rotation**: Gemini keys are load-balanced to avoid rate-limit exposure.

---

## 12. Future Scope

- [ ] **Collaborative Code Reviews** — peer-to-peer code review with AI-assisted suggestions.
- [ ] **Real-Time Multiplayer Interviews** — two users can interview each other with AI moderation.
- [ ] **Custom Roadmap Builder** — let users create and share their own learning paths.
- [ ] **Analytics & Insights Dashboard** — deep performance analytics with charts and trends over time.
- [ ] **Mobile Responsive PWA** — progressive web app for on-the-go practice.
- [ ] **OAuth Integration** — Google/GitHub login for frictionless onboarding.
- [ ] **WebSocket Live Sessions** — real-time collaboration in code and interview sessions.

---

*Built with React, Node.js, Express 5, MongoDB, and Google Gemini AI.*
