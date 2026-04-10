import { Request, Response } from "express";
import { InterviewService } from "../services/interview.service";

export class InterviewController {
  private service = new InterviewService();

  startSession = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      const { role, category, difficulty, questionCount } = req.body as Record<string, string | number>;
      const parsedQuestionCount =
        typeof questionCount === "number"
          ? questionCount
          : typeof questionCount === "string" && questionCount.trim() !== ""
          ? Number(questionCount)
          : undefined;

      const result = await this.service.startSession(userId, role as string, category as string, difficulty as string, parsedQuestionCount);
      res.status(201).json({ success: true, data: result });
    } catch (err: any) {
      const message = err.message ?? "Unable to start interview session";
      const status = /invalid|does not match/i.test(message) ? 400 : 500;
      res.status(status).json({ success: false, message });
    }
  };

  submitAnswer = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      const { sessionId, questionId, responseText } = req.body as Record<string, string>;
      const result = await this.service.submitAnswer(userId, sessionId, questionId, responseText);
      res.json({ success: true, data: result });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  };

  completeSession = async (req: Request, res: Response) => {
    try {
      const sessionId = req.params["sessionId"] as string;
      const result = await this.service.completeSession(sessionId);
      res.json({ success: true, data: result });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  };

  getSessions = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      const sessions = await this.service.getUserSessions(userId);
      res.json({ success: true, data: sessions });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  };

  getSessionDetails = async (req: Request, res: Response) => {
    try {
      const session = await this.service.getSessionDetails(req.params["sessionId"] as string);
      res.json({ success: true, data: session });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  };
}
