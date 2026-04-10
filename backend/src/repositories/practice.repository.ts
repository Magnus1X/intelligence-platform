import { PracticeQuestionModel } from "../models/PracticeQuestion.model";
import { SubmissionModel } from "../models/Submission.model";
import { IPracticeQuestion, ISubmission } from "../interfaces";

export class PracticeRepository {
  async findAllQuestions(filter: Partial<{ difficulty: string; category: string }> = {}): Promise<IPracticeQuestion[]> {
    return PracticeQuestionModel.find(filter);
  }

  async findQuestionById(id: string): Promise<IPracticeQuestion | null> {
    return PracticeQuestionModel.findById(id);
  }

  async createQuestion(data: Partial<IPracticeQuestion>): Promise<IPracticeQuestion> {
    return PracticeQuestionModel.create(data);
  }

  async createSubmission(data: Partial<ISubmission>): Promise<ISubmission> {
    return SubmissionModel.create(data);
  }

  async findSubmissionsByUser(userId: string): Promise<ISubmission[]> {
    return SubmissionModel.find({ userId }).populate("questionId").sort({ createdAt: -1 });
  }

  async getLeaderboard(): Promise<{ userId: string; totalScore: number; count: number }[]> {
    return SubmissionModel.aggregate([
      { $match: { status: "accepted" } },
      { $group: { _id: "$userId", totalScore: { $sum: "$score" }, count: { $sum: 1 } } },
      { $sort: { totalScore: -1 } },
      { $limit: 20 },
      { $project: { userId: "$_id", totalScore: 1, count: 1, _id: 0 } },
    ]);
  }
}
