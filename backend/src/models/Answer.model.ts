import { Schema, model } from "mongoose";
import { IAnswer } from "../interfaces";

const EvaluationSchema = new Schema(
  {
    aiScore: Number,
    strengths: String,
    weaknesses: String,
    suggestions: String,
  },
  { _id: false }
);

const AnswerSchema = new Schema<IAnswer>(
  {
    questionId: { type: Schema.Types.ObjectId, ref: "Question", required: true },
    sessionId: { type: Schema.Types.ObjectId, ref: "InterviewSession", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    responseText: { type: String, required: true },
    score: { type: Number, default: 0 },
    feedback: { type: String, default: "" },
    evaluation: { type: EvaluationSchema, default: null },
  },
  { timestamps: true }
);

export const AnswerModel = model<IAnswer>("Answer", AnswerSchema);
