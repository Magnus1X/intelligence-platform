import { Request, Response } from "express";
import { SubmissionModel } from "../models/Submission.model";
import { PracticeQuestionModel } from "../models/PracticeQuestion.model";
import { InterviewSessionModel } from "../models/InterviewSession.model";
import { AnswerModel } from "../models/Answer.model";
import { ProgressModel } from "../models/Roadmap.model";
import { UserModel } from "../models/User.model";
import { Types } from "mongoose";

export class DashboardController {
  getStats = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      const uid = new Types.ObjectId(userId);

      const extractQuestionId = (submission: { questionId?: unknown }) => {
        const question = submission.questionId as any;
        if (!question) return null;
        if (typeof question === "string") return question;
        if (question instanceof Types.ObjectId) return question.toString();
        if (typeof question === "object" && question._id) return question._id.toString();
        return null;
      };

      const user = await UserModel.findById(uid).select("name createdAt");
      const isNew = user ? Date.now() - new Date(user.createdAt).getTime() < 10_000 : false;

      // ── All submissions ──
      const allSubmissions = await SubmissionModel.find({ userId: uid })
        .sort({ createdAt: -1 })
        .populate("questionId", "title difficulty category");

      // Solved = unique questionIds with accepted status
      const solvedIds = [
        ...new Set(
          allSubmissions
            .filter((s) => s.status === "accepted")
            .map(extractQuestionId)
            .filter((id): id is string => Boolean(id))
        ),
      ];
      const attemptedIds = [
        ...new Set(
          allSubmissions
            .map(extractQuestionId)
            .filter((id): id is string => Boolean(id))
        ),
      ];

      // Full solved questions with details
      const solvedQuestions = await PracticeQuestionModel.find({
        _id: { $in: solvedIds.map((id) => new Types.ObjectId(id)) },
      }).select("title difficulty category tags");

      // Attempted but not solved
      const unsolvedAttemptedIds = attemptedIds.filter((id) => !solvedIds.includes(id));
      const attemptedQuestions = await PracticeQuestionModel.find({
        _id: { $in: unsolvedAttemptedIds.map((id) => new Types.ObjectId(id)) },
      }).select("title difficulty category tags");

      const diffBreakdown = { easy: 0, medium: 0, hard: 0 };
      const categoryBreakdown: Record<string, number> = {};
      for (const q of solvedQuestions) {
        diffBreakdown[q.difficulty as "easy" | "medium" | "hard"]++;
        categoryBreakdown[q.category] = (categoryBreakdown[q.category] || 0) + 1;
      }

      const totalQuestions = await PracticeQuestionModel.countDocuments();

      // ── All interview sessions ──
      const allSessions = await InterviewSessionModel.find({ userId: uid })
        .sort({ createdAt: -1 })
        .select("role status createdAt");

      const completedSessions = allSessions.filter((s) => s.status === "completed");

      const answers = await AnswerModel.find({ userId: uid });
      const avgScore = answers.length
        ? Math.round(answers.reduce((s, a) => s + (a.score || 0), 0) / answers.length)
        : 0;

      // Category weak areas
      const categoryBreakdownAll = Object.entries(categoryBreakdown);
      const weakAreas = categoryBreakdownAll.length > 0
        ? categoryBreakdownAll.sort((a, b) => a[1] - b[1]).slice(0, 3).map(([c]) => c)
        : [];

      // ── Roadmap progress ──
      const allProgress = await ProgressModel.find({ userId: uid }).populate("roadmapId", "title topics");
      const roadmapProgress = allProgress.map((p) => {
        const roadmap = p.roadmapId as any;
        const total = roadmap?.topics?.length || 0;
        const done  = p.completedTopics.length;
        return { title: roadmap?.title || "Unknown", completed: done, total, pct: total ? Math.round((done / total) * 100) : 0 };
      });

      // ── 14-day activity ──
      const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
      const activity = await SubmissionModel.aggregate([
        { $match: { userId: uid, createdAt: { $gte: twoWeeksAgo } } },
        { $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
          accepted: { $sum: { $cond: [{ $eq: ["$status", "accepted"] }, 1, 0] } },
        }},
        { $sort: { _id: 1 } },
      ]);

      res.json({
        success: true,
        data: {
          isNew,
          userName: user?.name,
          practice: {
            total: totalQuestions,
            solved: solvedIds.length,
            attempted: attemptedIds.length,
            diffBreakdown,
            categoryBreakdown,
            // Full lists for drawer
            solvedQuestions,
            attemptedQuestions,
            allSubmissions: allSubmissions.slice(0, 50),
          },
          interview: {
            totalSessions: allSessions.length,
            completedSessions: completedSessions.length,
            avgScore,
            allSessions,
            weakAreas,
          },
          roadmapProgress,
          activity,
        },
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  };
}
