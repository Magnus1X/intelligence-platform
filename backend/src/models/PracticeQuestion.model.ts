import { Schema, model } from "mongoose";
import { IPracticeQuestion } from "../interfaces";

const TestCaseSchema  = new Schema({ input: String, expectedOutput: String, isHidden: { type: Boolean, default: false } }, { _id: false });
const ExampleSchema   = new Schema({ input: String, output: String, explanation: String }, { _id: false });

const PracticeQuestionSchema = new Schema<IPracticeQuestion>({
  title:            { type: String, required: true },
  description:      { type: String, required: true },
  difficulty:       { type: String, enum: ["easy", "medium", "hard"], required: true },
  category:         { type: String, required: true },
  tags:             [String],
  constraints:      [String],
  examples:         [ExampleSchema],
  hints:            [String],
  testCases:        [TestCaseSchema],
  starterCode:      { type: Map, of: String, default: {} },
  acceptanceRate:   { type: Number, default: 0 },
  totalSubmissions: { type: Number, default: 0 },
  totalAccepted:    { type: Number, default: 0 },
});

export const PracticeQuestionModel = model<IPracticeQuestion>("PracticeQuestion", PracticeQuestionSchema);
