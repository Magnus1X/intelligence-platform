import { Schema, model } from "mongoose";
import { INTERVIEW_CATEGORIES, INTERVIEW_DIFFICULTIES, INTERVIEW_RESPONSE_TYPES } from "../constants/interview";
import { IQuestion } from "../interfaces";

const QuestionSchema = new Schema<IQuestion>({
  sessionId: { type: Schema.Types.ObjectId, ref: "InterviewSession", required: true },
  content: { type: String, required: true },
  difficulty: { type: String, enum: INTERVIEW_DIFFICULTIES, required: true },
  category: {
    type: String,
    enum: INTERVIEW_CATEGORIES,
    required: true,
  },
  responseType: {
    type: String,
    enum: INTERVIEW_RESPONSE_TYPES,
    required: true,
    default: "written",
  },
  options: {
    type: [String],
    default: undefined,
  },
});

export const QuestionModel = model<IQuestion>("Question", QuestionSchema);
