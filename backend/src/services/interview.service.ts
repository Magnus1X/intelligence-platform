import { InterviewRepository } from "../repositories/interview.repository";
import {
  type InterviewCategory,
  type InterviewDifficulty,
  type InterviewRole,
  type InterviewResponseType,
  isInterviewCategoryForRole,
  isInterviewDifficulty,
  isInterviewQuestionCount,
  isInterviewRole,
} from "../constants/interview";
import { aiService } from "./ai.service";
import { Types } from "mongoose";
import { IQuestion, IQuestionGenerationResult } from "../interfaces";

export class InterviewService {
  private repo = new InterviewRepository();

  private normalizeGeneratedQuestion(
    question: IQuestionGenerationResult,
    category: InterviewCategory,
    difficulty: InterviewDifficulty
  ) {
    const responseType: InterviewResponseType =
      question.responseType === "choice" &&
      Array.isArray(question.options) &&
      question.options.map((option) => option?.trim()).filter(Boolean).length >= 2
        ? "choice"
        : "written";

    const options =
      responseType === "choice"
        ? question.options
            ?.map((option) => option.trim())
            .filter(Boolean)
            .slice(0, 4) ?? []
        : [];

    return {
      content: question.content.trim(),
      difficulty,
      category,
      responseType,
      options,
    };
  }

  async startSession(userId: string, role: string, category: string, difficulty: string, questionCount = 5) {
    if (!isInterviewRole(role)) {
      throw new Error("Invalid interview role");
    }

    if (!isInterviewDifficulty(difficulty)) {
      throw new Error("Invalid interview difficulty");
    }

    if (!isInterviewQuestionCount(questionCount)) {
      throw new Error("Invalid interview question count");
    }

    if (!isInterviewCategoryForRole(role, category)) {
      throw new Error("Selected interview track does not match the chosen role");
    }

    const validRole = role as InterviewRole;
    const validCategory = category as InterviewCategory;
    const validDifficulty = difficulty as InterviewDifficulty;

    const session = await this.repo.createSession(userId, validRole);

    const generated = await aiService.generateQuestions(validRole, validCategory, validDifficulty, questionCount);
    const normalizedQuestions = generated.map((question) =>
      this.normalizeGeneratedQuestion(question, validCategory, validDifficulty)
    );

    const questions = await this.repo.createQuestions(
      normalizedQuestions.map((q) => ({
        sessionId: session._id as Types.ObjectId,
        content: q.content,
        difficulty: q.difficulty,
        category: q.category as IQuestion["category"],
        responseType: q.responseType,
        options: q.options,
      }))
    );

    await this.repo.addQuestionsToSession(
      session.id,
      questions.map((q) => q._id as Types.ObjectId)
    );

    return { session, questions };
  }

  async submitAnswer(userId: string, sessionId: string, questionId: string, responseText: string) {
    const question = await this.repo.findQuestionById(questionId);
    if (!question) throw new Error("Question not found");

    const evaluationQuestion =
      question.responseType === "choice" && question.options?.length
        ? `${question.content}\nOptions:\n${question.options
            .map((option, index) => `${String.fromCharCode(65 + index)}. ${option}`)
            .join("\n")}`
        : question.content;

    const answer = await this.repo.createAnswer({
      questionId: question._id as Types.ObjectId,
      sessionId: new Types.ObjectId(sessionId),
      userId: new Types.ObjectId(userId),
      responseText,
    });

    const evaluation = await aiService.evaluateAnswer(evaluationQuestion, responseText, question.responseType);

    await this.repo.updateAnswerEvaluation(
      answer.id,
      evaluation.aiScore,
      evaluation.suggestions,
      evaluation
    );

    return { ...evaluation };
  }

  async completeSession(sessionId: string) {
    await this.repo.updateSessionStatus(sessionId, "completed");
    const answers = await this.repo.findAnswersBySession(sessionId);
    const avgScore = answers.reduce((s, a) => s + a.score, 0) / (answers.length || 1);
    return { avgScore, totalAnswers: answers.length, answers };
  }

  async getUserSessions(userId: string) {
    return this.repo.findSessionsByUser(userId);
  }

  async getSessionDetails(sessionId: string) {
    return this.repo.findSessionById(sessionId);
  }
}
