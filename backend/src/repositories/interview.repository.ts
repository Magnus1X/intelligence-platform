import { InterviewSessionModel } from "../models/InterviewSession.model";
import { QuestionModel } from "../models/Question.model";
import { AnswerModel } from "../models/Answer.model";
import { IInterviewSession, IQuestion, IAnswer, IEvaluationEmbedded } from "../interfaces";
import { Types } from "mongoose";

export class InterviewRepository {
  async createSession(userId: string, role: string): Promise<IInterviewSession> {
    return InterviewSessionModel.create({ userId, role });
  }

  async findSessionById(id: string): Promise<IInterviewSession | null> {
    return InterviewSessionModel.findById(id).populate("questions");
  }

  async findSessionsByUser(userId: string): Promise<IInterviewSession[]> {
    return InterviewSessionModel.find({ userId }).sort({ createdAt: -1 });
  }

  async updateSessionStatus(id: string, status: IInterviewSession["status"]): Promise<void> {
    await InterviewSessionModel.findByIdAndUpdate(id, { status });
  }

  async addQuestionsToSession(sessionId: string, questionIds: Types.ObjectId[]): Promise<void> {
    await InterviewSessionModel.findByIdAndUpdate(sessionId, {
      $push: { questions: { $each: questionIds } },
    });
  }

  async createQuestions(questions: Partial<IQuestion>[]): Promise<IQuestion[]> {
    return QuestionModel.insertMany(questions) as unknown as IQuestion[];
  }

  async findQuestionById(id: string): Promise<IQuestion | null> {
    return QuestionModel.findById(id);
  }

  async createAnswer(data: Partial<IAnswer>): Promise<IAnswer> {
    return AnswerModel.create(data);
  }

  async updateAnswerEvaluation(
    answerId: string,
    score: number,
    feedback: string,
    evaluation: IEvaluationEmbedded
  ): Promise<void> {
    await AnswerModel.findByIdAndUpdate(answerId, { score, feedback, evaluation });
  }

  async findAnswersBySession(sessionId: string): Promise<IAnswer[]> {
    return AnswerModel.find({ sessionId }).populate("questionId");
  }
}
