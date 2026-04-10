import { Request, Response } from "express";
import { RoadmapService } from "../services/roadmap.service";

export class RoadmapController {
  private service = new RoadmapService();

  getAll = async (_req: Request, res: Response) => {
    try {
      const roadmaps = await this.service.getAllRoadmaps();
      res.json({ success: true, data: roadmaps });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const roadmap = await this.service.getRoadmapById(req.params["id"] as string);
      res.json({ success: true, data: roadmap });
    } catch (err: any) {
      res.status(404).json({ success: false, message: err.message });
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const roadmap = await this.service.createRoadmap(req.body);
      res.status(201).json({ success: true, data: roadmap });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  };

  updateProgress = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      const { roadmapId, completedTopics } = req.body;
      const progress = await this.service.updateProgress(userId, roadmapId, completedTopics);
      res.json({ success: true, data: progress });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  };

  getMyProgress = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      const progress = await this.service.getUserProgress(userId);
      res.json({ success: true, data: progress });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  };

  getRecommendation = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      const roadmapId = req.params["roadmapId"] as string;
      const result = await this.service.getAIRecommendation(userId, roadmapId);
      res.json({ success: true, data: result });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  };
}
