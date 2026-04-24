import { Document, Types } from "mongoose";
import type { InterviewCategory, InterviewDifficulty, InterviewResponseType } from "../constants/interview";

// ─── User ────────────────────────────────────────────────────────────────────
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
  college?: string;
  yearOfStudy?: string;
  address?: string;
  createdAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

export interface IUserPayload {
  id: string;
  email: string;
  role: "user" | "admin";
  name?: string;
  college?: string;
  yearOfStudy?: string;
  address?: string;
}

// ─── Interview Session ────────────────────────────────────────────────────────
export interface IInterviewSession extends Document {
  userId: Types.ObjectId;
  role: string;
  status: "active" | "completed" | "abandoned";
  questions: Types.ObjectId[];
  createdAt: Date;
}

// ─── Question ─────────────────────────────────────────────────────────────────
export interface IQuestion extends Document {
  sessionId: Types.ObjectId;
  content: string;
  difficulty: InterviewDifficulty;
  category: InterviewCategory;
  responseType: InterviewResponseType;
  options?: string[];
}

// ─── Answer ───────────────────────────────────────────────────────────────────
export interface IAnswer extends Document {
  questionId: Types.ObjectId;
  sessionId: Types.ObjectId;
  userId: Types.ObjectId;
  responseText: string;
  score: number;
  feedback: string;
  evaluation?: IEvaluationEmbedded;
}

export interface IEvaluationEmbedded {
  aiScore: number;
  strengths: string;
  weaknesses: string;
  suggestions: string;
}

// ─── Practice Question ────────────────────────────────────────────────────────
export interface ITestCase {
  input: string;
  expectedOutput: string;
  isHidden?: boolean;
}

export interface IExample {
  input: string;
  output: string;
  explanation?: string;
}

export interface IPracticeQuestion extends Document {
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  category: string;
  tags: string[];
  constraints: string[];
  examples: IExample[];
  hints: string[];
  testCases: ITestCase[];
  starterCode: Record<string, string>;
  acceptanceRate: number;
  totalSubmissions: number;
  totalAccepted: number;
}

// ─── Submission ───────────────────────────────────────────────────────────────
export interface ISubmission extends Document {
  userId: Types.ObjectId;
  questionId: Types.ObjectId;
  code: string;
  language: string;
  status: "accepted" | "wrong_answer" | "error";
  score: number;
  runtime?: string;
  passedCases: number;
  totalCases: number;
  createdAt: Date;
}

// ─── Roadmap ──────────────────────────────────────────────────────────────────
export interface IRoadmapTopic {
  title: string;
  description: string;
  resources: string[];
  order: number;
}

export interface IRoadmap extends Document {
  title: string;
  type: "internship" | "placement";
  topics: IRoadmapTopic[];
}

// ─── Progress ─────────────────────────────────────────────────────────────────
export interface IProgress extends Document {
  userId: Types.ObjectId;
  roadmapId: Types.ObjectId;
  completedTopics: string[];
  updatedAt: Date;
}

// ─── API Key ──────────────────────────────────────────────────────────────────
export interface IApiKey extends Document {
  key: string;
  purpose: "code-analysis" | "question-generation";
  isActive: boolean;
  usageCount: number;
}

// ─── AI Service ───────────────────────────────────────────────────────────────
export interface ICodeAnalysisResult {
  timeComplexity: string;
  spaceComplexity: string;
  optimizedApproach: string;
  antiPatterns: string[];
  explanation: string;
}

export interface IQuestionGenerationResult {
  content: string;
  difficulty: InterviewDifficulty;
  category: InterviewCategory;
  responseType: InterviewResponseType;
  options?: string[];
}

export interface IEvaluationResult {
  aiScore: number;
  strengths: string;
  weaknesses: string;
  suggestions: string;
}

// ─── Request Extensions ───────────────────────────────────────────────────────
export interface AuthRequest extends Express.Request {
  user?: IUserPayload;
}
