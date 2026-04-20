import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  INTERVIEW_CATEGORY_DETAILS,
  type InterviewCategory,
  type InterviewDifficulty,
  type InterviewResponseType,
  type InterviewRole,
} from "../constants/interview";
import {
  ICodeAnalysisResult,
  IQuestionGenerationResult,
  IEvaluationResult,
} from "../interfaces";

class AIService {
  private codeAnalysisKey: string;
  private practiceKey: string;
  private interviewKey: string;
  private roadmapKey: string;

  constructor() {
    this.codeAnalysisKey = process.env.GEMINI_API_KEY_1 || "";
    this.practiceKey = process.env.GEMINI_API_KEY_2 || "";
    this.interviewKey = process.env.GEMINI_API_KEY_3 || "";
    this.roadmapKey = process.env.GEMINI_API_KEY_4 || "";
  }

  private async callGemini(apiKey: string, prompt: string): Promise<string> {
    if (!apiKey) throw new Error("API Key for this feature is missing. Please add it to your .env file.");
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    return result.response.text();
  }

  async analyzeCode(code: string, language: string): Promise<ICodeAnalysisResult> {
    const prompt = `Analyze this ${language} code and respond ONLY with valid JSON (no markdown):
{
  "timeComplexity": "...",
  "spaceComplexity": "...",
  "optimizedApproach": "...",
  "antiPatterns": ["..."],
  "explanation": "..."
}

Code:
\`\`\`${language}
${code}
\`\`\``;

    const raw = await this.callGemini(this.codeAnalysisKey, prompt);
    const cleaned = raw.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
  }

  async generateQuestions(
    role: InterviewRole,
    category: InterviewCategory,
    difficulty: InterviewDifficulty,
    count = 5
  ): Promise<IQuestionGenerationResult[]> {
    const categoryInfo = INTERVIEW_CATEGORY_DETAILS[category];
    const prompt = `Generate ${count} interview questions for a ${role} role.
Track: ${categoryInfo.label}
Focus: ${categoryInfo.description}
Difficulty: ${difficulty}
Respond ONLY with valid JSON array (no markdown):
[{
  "content":"...",
  "difficulty":"${difficulty}",
  "category":"${category}",
  "responseType":"written",
  "options":[]
}]

Rules:
- Every object must use the exact category value "${category}".
- Every object must use the exact difficulty value "${difficulty}".
- Use a mix of question types.
- If count is 2 or more, include at least one "choice" question and at least one "written" question.
- For "choice" questions, provide exactly 4 short answer options in "options".
- For "written" questions, use an empty array for "options".
- "responseType" must be either "choice" or "written".`;

    const raw = await this.callGemini(this.interviewKey, prompt);
    const cleaned = raw.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
  }

  async evaluateAnswer(question: string, answer: string, responseType: InterviewResponseType): Promise<IEvaluationResult> {
    const prompt = `Evaluate this interview answer. Respond ONLY with valid JSON (no markdown):
{
  "aiScore": <0-100>,
  "strengths": "...",
  "weaknesses": "...",
  "suggestions": "..."
}

Question type: ${responseType}
Question: ${question}
Answer: ${answer}`;

    const raw = await this.callGemini(this.interviewKey, prompt);
    const cleaned = raw.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
  }

  async explainCode(code: string, language: string): Promise<string> {
    const prompt = `Explain this ${language} code in simple terms for a beginner. Be concise.\n\n${code}`;
    return this.callGemini(this.practiceKey, prompt);
  }

  async generateText(prompt: string): Promise<string> {
    return this.callGemini(this.roadmapKey, prompt);
  }
}

export const aiService = new AIService();
