import { Schema, model } from "mongoose";
import { IInterviewSession } from "../interfaces";

const InterviewSessionSchema = new Schema<IInterviewSession>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    role: { type: String, required: true },
    status: { type: String, enum: ["active", "completed", "abandoned"], default: "active" },
    questions: [{ type: Schema.Types.ObjectId, ref: "Question" }],
  },
  { timestamps: true }
);

export const InterviewSessionModel = model<IInterviewSession>("InterviewSession", InterviewSessionSchema);
