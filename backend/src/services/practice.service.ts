import { PracticeRepository } from "../repositories/practice.repository";
import { CodeRunnerService } from "./code-runner.service";
import { IPracticeQuestion } from "../interfaces";

export class PracticeService {
  private repo   = new PracticeRepository();
  private runner = new CodeRunnerService();

  async getQuestions(filter: Partial<{ difficulty: string; category: string }> = {}) {
    return this.repo.findAllQuestions(filter);
  }

  async getQuestionById(id: string) {
    const q = await this.repo.findQuestionById(id);
    if (!q) throw new Error("Question not found");
    return q;
  }

  /** Run code against test cases — does NOT save a submission */
  async runCode(questionId: string, code: string, language: string) {
    const question = await this.repo.findQuestionById(questionId);
    if (!question) throw new Error("Question not found");
    return this.runner.run(code, language, question.testCases as any);
  }

  /** Submit — only saves if all test cases pass */
  async submitCode(userId: string, questionId: string, code: string, language: string) {
    const question = await this.repo.findQuestionById(questionId);
    if (!question) throw new Error("Question not found");

    const runResult = this.runner.run(code, language, question.testCases as any);

    const status = runResult.error
      ? "error"
      : runResult.passed
      ? "accepted"
      : "wrong_answer";

    const score = runResult.passed ? 100 : 0;

    const submission = await this.repo.createSubmission({
      userId: userId as any,
      questionId: question._id as any,
      code,
      language,
      status,
      score,
    });

    return { submission, runResult };
  }

  async getUserSubmissions(userId: string) {
    return this.repo.findSubmissionsByUser(userId);
  }

  async getLeaderboard() {
    return this.repo.getLeaderboard();
  }

  async createQuestion(data: Partial<IPracticeQuestion>) {
    return this.repo.createQuestion(data);
  }
}
