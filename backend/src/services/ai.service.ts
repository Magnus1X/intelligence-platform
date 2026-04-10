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
  private codeAnalysisKeys: string[];
  private questionGenKeys: string[];
  private questionKeyIndex = 0;

  constructor() {
    this.codeAnalysisKeys = [process.env.GEMINI_API_KEY_1!].filter(Boolean);
    this.questionGenKeys = [
      process.env.GEMINI_API_KEY_2!,
      process.env.GEMINI_API_KEY_3!,
      process.env.GEMINI_API_KEY_4!,
      process.env.GEMINI_API_KEY_5!,
      process.env.GEMINI_API_KEY_6!,
    ].filter(Boolean);
  }

  private getNextQuestionKey(): string {
    const key = this.questionGenKeys[this.questionKeyIndex % this.questionGenKeys.length];
    this.questionKeyIndex++;
    return key;
  }

  private async callGemini(apiKey: string, prompt: string): Promise<string> {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    return result.response.text();
  }

  private async callWithFallback(keys: string[], prompt: string): Promise<string> {
    for (const key of keys) {
      try {
        return await this.callGemini(key, prompt);
      } catch {
        continue;
      }
    }
    throw new Error("All AI API keys exhausted or failed.");
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

    const raw = await this.callWithFallback(this.codeAnalysisKeys, prompt);
    const cleaned = raw.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
  }

  async generateQuestions(
    role: InterviewRole,
    category: InterviewCategory,
    difficulty: InterviewDifficulty,
    count = 5
  ): Promise<IQuestionGenerationResult[]> {
    const key = this.getNextQuestionKey();
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

    const raw = await this.callGemini(key, prompt);
    const cleaned = raw.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
  }

  async evaluateAnswer(question: string, answer: string, responseType: InterviewResponseType): Promise<IEvaluationResult> {
    const key = this.getNextQuestionKey();
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

    const raw = await this.callGemini(key, prompt);
    const cleaned = raw.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
  }

  async explainCode(code: string, language: string): Promise<string> {
    const key = this.getNextQuestionKey();
    const prompt = `Explain this ${language} code in simple terms for a beginner. Be concise.\n\n${code}`;
    return this.callGemini(key, prompt);
  }

  async generateText(prompt: string): Promise<string> {
    return this.callWithFallback(
      [...this.questionGenKeys, ...this.codeAnalysisKeys],
      prompt
    );
  }
}

export const aiService = new AIService();
