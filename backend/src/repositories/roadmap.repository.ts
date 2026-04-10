import { RoadmapModel } from "../models/Roadmap.model";
import { ProgressModel } from "../models/Roadmap.model";
import { IRoadmap, IProgress } from "../interfaces";

export class RoadmapRepository {
  async findAll(): Promise<IRoadmap[]> {
    return RoadmapModel.find();
  }

  async findById(id: string): Promise<IRoadmap | null> {
    return RoadmapModel.findById(id);
  }

  async create(data: Partial<IRoadmap>): Promise<IRoadmap> {
    return RoadmapModel.create(data);
  }

  async findProgress(userId: string, roadmapId: string): Promise<IProgress | null> {
    return ProgressModel.findOne({ userId, roadmapId });
  }

  async upsertProgress(userId: string, roadmapId: string, completedTopics: string[]): Promise<IProgress> {
    return ProgressModel.findOneAndUpdate(
      { userId, roadmapId },
      { completedTopics },
      { upsert: true, new: true }
    ) as unknown as IProgress;
  }

  async findAllProgress(userId: string): Promise<IProgress[]> {
    return ProgressModel.find({ userId }).populate("roadmapId");
  }
}
