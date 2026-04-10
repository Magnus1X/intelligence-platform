export const INTERVIEW_ROLES = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Data Scientist",
  "DevOps Engineer",
  "Mobile Developer",
] as const;

export type InterviewRole = (typeof INTERVIEW_ROLES)[number];

export const INTERVIEW_DIFFICULTIES = ["easy", "medium", "hard"] as const;
export type InterviewDifficulty = (typeof INTERVIEW_DIFFICULTIES)[number];
export const INTERVIEW_RESPONSE_TYPES = ["written", "choice"] as const;
export type InterviewResponseType = (typeof INTERVIEW_RESPONSE_TYPES)[number];
export const INTERVIEW_MIN_QUESTION_COUNT = 3;
export const INTERVIEW_MAX_QUESTION_COUNT = 10;

export const INTERVIEW_CATEGORY_DETAILS = {
  javascript: {
    label: "JavaScript",
    description: "Core JavaScript, async behavior, closures, and browser-side problem solving.",
  },
  "html-css": {
    label: "HTML & CSS",
    description: "Semantic markup, responsive layouts, accessibility, and styling decisions.",
  },
  react: {
    label: "React",
    description: "Components, hooks, state flow, rendering behavior, and performance tradeoffs.",
  },
  "frontend-system-design": {
    label: "Frontend System Design",
    description: "Large-scale UI architecture, caching, performance budgets, and client state.",
  },
  "backend-fundamentals": {
    label: "Backend Fundamentals",
    description: "Service boundaries, validation, HTTP behavior, and backend architecture basics.",
  },
  databases: {
    label: "Databases",
    description: "Data modeling, indexing, transactions, consistency, and query design.",
  },
  apis: {
    label: "APIs",
    description: "REST and GraphQL design, auth, versioning, pagination, and contracts.",
  },
  "system-design": {
    label: "System Design",
    description: "Scalability, resilience, caching, queues, and distributed-system tradeoffs.",
  },
  frontend: {
    label: "Frontend",
    description: "Client-side architecture, rendering flow, forms, and experience design.",
  },
  backend: {
    label: "Backend",
    description: "Server-side logic, auth, APIs, validation, and reliability patterns.",
  },
  "python-data": {
    label: "Python for Data",
    description: "Python data workflows, notebooks, wrangling, and analysis tooling.",
  },
  statistics: {
    label: "Statistics",
    description: "Probability, hypothesis testing, experimentation, and interpretation.",
  },
  "machine-learning": {
    label: "Machine Learning",
    description: "Modeling choices, metrics, training tradeoffs, and production thinking.",
  },
  "sql-analytics": {
    label: "SQL & Analytics",
    description: "SQL exploration, aggregations, joins, and business-facing data analysis.",
  },
  "linux-networking": {
    label: "Linux & Networking",
    description: "Shell fluency, operating systems, networking basics, and troubleshooting.",
  },
  "cloud-infrastructure": {
    label: "Cloud Infrastructure",
    description: "Cloud services, networking, infrastructure as code, and deployment patterns.",
  },
  "ci-cd": {
    label: "CI/CD",
    description: "Pipelines, release safety, automation, rollout strategy, and delivery reliability.",
  },
  observability: {
    label: "Observability",
    description: "Logging, metrics, tracing, alerts, incidents, and debugging production issues.",
  },
  "mobile-fundamentals": {
    label: "Mobile Fundamentals",
    description: "App lifecycle, state, performance, UX constraints, and device-aware design.",
  },
  "android-ios": {
    label: "Android / iOS",
    description: "Platform APIs, native behaviors, permissions, and mobile platform tradeoffs.",
  },
  "mobile-system-design": {
    label: "Mobile System Design",
    description: "Offline sync, local storage, caching, mobile data flow, and scale concerns.",
  },
  "testing-release": {
    label: "Testing & Release",
    description: "QA strategy, crash debugging, store submissions, release management, and monitoring.",
  },
  behavioral: {
    label: "Behavioral",
    description: "Communication, ownership, conflict handling, prioritization, and collaboration.",
  },
} as const;

export type InterviewCategory = keyof typeof INTERVIEW_CATEGORY_DETAILS;

export const INTERVIEW_CATEGORIES = Object.keys(INTERVIEW_CATEGORY_DETAILS) as InterviewCategory[];

export const INTERVIEW_CATEGORIES_BY_ROLE: Record<InterviewRole, InterviewCategory[]> = {
  "Frontend Developer": ["javascript", "html-css", "react", "frontend-system-design", "behavioral"],
  "Backend Developer": ["backend-fundamentals", "databases", "apis", "system-design", "behavioral"],
  "Full Stack Developer": ["frontend", "backend", "databases", "system-design", "behavioral"],
  "Data Scientist": ["python-data", "statistics", "machine-learning", "sql-analytics", "behavioral"],
  "DevOps Engineer": ["linux-networking", "cloud-infrastructure", "ci-cd", "observability", "behavioral"],
  "Mobile Developer": ["mobile-fundamentals", "android-ios", "mobile-system-design", "testing-release", "behavioral"],
};

export function isInterviewRole(value: string): value is InterviewRole {
  return INTERVIEW_ROLES.includes(value as InterviewRole);
}

export function isInterviewDifficulty(value: string): value is InterviewDifficulty {
  return INTERVIEW_DIFFICULTIES.includes(value as InterviewDifficulty);
}

export function isInterviewQuestionCount(value: number): boolean {
  return Number.isInteger(value) && value >= INTERVIEW_MIN_QUESTION_COUNT && value <= INTERVIEW_MAX_QUESTION_COUNT;
}

export function isInterviewCategory(value: string): value is InterviewCategory {
  return INTERVIEW_CATEGORIES.includes(value as InterviewCategory);
}

export function isInterviewCategoryForRole(role: InterviewRole, category: string): category is InterviewCategory {
  return INTERVIEW_CATEGORIES_BY_ROLE[role].includes(category as InterviewCategory);
}
