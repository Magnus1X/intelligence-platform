import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import { IUser } from "../interfaces";

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, minlength: 6 },
    authProvider: { type: String, enum: ["local", "google"], default: "local" },
    googleId: { type: String },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    college: { type: String, trim: true },
    yearOfStudy: { type: String, trim: true },
    address: { type: String, trim: true },
    bio: { type: String, trim: true },
    github: { type: String, trim: true },
    linkedin: { type: String, trim: true },
    website: { type: String, trim: true },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

UserSchema.methods.comparePassword = async function (candidate: string) {
  if (!this.password) return false;
  return bcrypt.compare(candidate, this.password);
};

export const UserModel = model<IUser>("User", UserSchema);
