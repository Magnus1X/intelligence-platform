import { Schema, model } from "mongoose";
import { ISubmission } from "../interfaces";

const SubmissionSchema = new Schema<ISubmission>(
  {
    userId:       { type: Schema.Types.ObjectId, ref: "User", required: true },
    questionId:   { type: Schema.Types.ObjectId, ref: "PracticeQuestion", required: true },
    code:         { type: String, required: true },
    language:     { type: String, required: true },
    status:       { type: String, enum: ["accepted", "wrong_answer", "error"], required: true },
    score:        { type: Number, default: 0 },
    runtime:      { type: String },
    passedCases:  { type: Number, default: 0 },
    totalCases:   { type: Number, default: 0 },
  },
  { timestamps: true }
);

// One index to quickly find a user's best submission per question
SubmissionSchema.index({ userId: 1, questionId: 1, status: 1 });

export const SubmissionModel = model<ISubmission>("Submission", SubmissionSchema);
