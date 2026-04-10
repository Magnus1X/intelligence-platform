import { Schema, model } from "mongoose";
import { IRoadmap, IProgress } from "../interfaces";

const TopicSchema = new Schema(
  { title: String, description: String, resources: [String], order: Number },
  { _id: false }
);

const RoadmapSchema = new Schema<IRoadmap>({
  title: { type: String, required: true },
  type: { type: String, enum: ["internship", "placement"], required: true },
  topics: [TopicSchema],
});

const ProgressSchema = new Schema<IProgress>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    roadmapId: { type: Schema.Types.ObjectId, ref: "Roadmap", required: true },
    completedTopics: [String],
  },
  { timestamps: true }
);

export const RoadmapModel = model<IRoadmap>("Roadmap", RoadmapSchema);
export const ProgressModel = model<IProgress>("Progress", ProgressSchema);
