import { RoadmapRepository } from "../repositories/roadmap.repository";
import { aiService } from "./ai.service";
import { IRoadmap } from "../interfaces";

export class RoadmapService {
  private repo = new RoadmapRepository();

  async getAllRoadmaps() {
    return this.repo.findAll();
  }

  async getRoadmapById(id: string) {
    const r = await this.repo.findById(id);
    if (!r) throw new Error("Roadmap not found");
    return r;
  }

  async createRoadmap(data: Partial<IRoadmap>) {
    return this.repo.create(data);
  }

  async updateProgress(userId: string, roadmapId: string, completedTopics: string[]) {
    return this.repo.upsertProgress(userId, roadmapId, completedTopics);
  }

  async getUserProgress(userId: string) {
    return this.repo.findAllProgress(userId);
  }

  async getAIRecommendation(userId: string, roadmapId: string) {
    const roadmap  = await this.repo.findById(roadmapId);
    const progress = await this.repo.findProgress(userId, roadmapId);
    if (!roadmap) throw new Error("Roadmap not found");

    const completed = progress?.completedTopics ?? [];
    const remaining = roadmap.topics.filter((t) => !completed.includes(t.title));
    const nextTopic = remaining[0];

    if (!nextTopic) return { recommendation: "You have completed all topics! Great job. 🎉" };

    const prompt = `A student is learning "${roadmap.title}". They have completed: ${completed.length ? completed.join(", ") : "nothing yet"}.
The next topic is "${nextTopic.title}" — ${nextTopic.description}.
Give a 2-sentence motivational tip and practical study advice for this topic.`;

    const recommendation = await aiService.generateText(prompt);
    return { recommendation, nextTopic };
  }
}
