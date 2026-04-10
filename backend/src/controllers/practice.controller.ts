import { Request, Response } from "express";
import { PracticeService } from "../services/practice.service";

export class PracticeController {
  private service = new PracticeService();

  getQuestions = async (req: Request, res: Response) => {
    try {
      const difficulty = req.query["difficulty"] as string | undefined;
      const category   = req.query["category"]   as string | undefined;
      const filter: any = {};
      if (difficulty) filter.difficulty = difficulty;
      if (category)   filter.category   = category;
      const questions = await this.service.getQuestions(filter);
      res.json({ success: true, data: questions });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  };

  getQuestion = async (req: Request, res: Response) => {
    try {
      const q = await this.service.getQuestionById(req.params["id"] as string);
      res.json({ success: true, data: q });
    } catch (err: any) {
      res.status(404).json({ success: false, message: err.message });
    }
  };

  /** POST /practice/run — execute code, return per-test results, no DB write */
  run = async (req: Request, res: Response) => {
    try {
      const { questionId, code, language } = req.body;
      const result = await this.service.runCode(questionId, code, language);
      res.json({ success: true, data: result });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  };

  /** POST /practice/submit — run + save only if all tests pass */
  submit = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      const { questionId, code, language } = req.body;
      const result = await this.service.submitCode(userId, questionId, code, language);
      res.json({ success: true, data: result });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  };

  getMySubmissions = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      const submissions = await this.service.getUserSubmissions(userId);
      res.json({ success: true, data: submissions });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  };

  getLeaderboard = async (_req: Request, res: Response) => {
    try {
      const board = await this.service.getLeaderboard();
      res.json({ success: true, data: board });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  };

  createQuestion = async (req: Request, res: Response) => {
    try {
      const q = await this.service.createQuestion(req.body);
      res.status(201).json({ success: true, data: q });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  };
}
