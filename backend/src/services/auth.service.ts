import jwt from "jsonwebtoken";
import { UserRepository } from "../repositories/user.repository";
import { IUser, IUserPayload } from "../interfaces";

export class AuthService {
  private userRepo = new UserRepository();

  async register(
    name: string,
    email: string,
    password: string,
    college?: string,
    yearOfStudy?: string,
    address?: string
  ): Promise<{ token: string; user: Partial<IUser> }> {
    const existing = await this.userRepo.findByEmail(email);
    if (existing) throw new Error("Email already registered");

    const user = await this.userRepo.create({ name, email, password, college, yearOfStudy, address });
    const token = this.signToken({ id: user.id, email: user.email, role: user.role, name: user.name, college: user.college, yearOfStudy: user.yearOfStudy, address: user.address });
    return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role, college: user.college, yearOfStudy: user.yearOfStudy, address: user.address } };
  }

  async login(email: string, password: string): Promise<{ token: string; user: Partial<IUser> }> {
    const user = await this.userRepo.findByEmail(email);
    if (!user || !(await user.comparePassword(password))) throw new Error("Invalid credentials");

    const token = this.signToken({ id: user.id, email: user.email, role: user.role, name: user.name, college: user.college, yearOfStudy: user.yearOfStudy, address: user.address });
    return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role, college: user.college, yearOfStudy: user.yearOfStudy, address: user.address } };
  }

  private signToken(payload: IUserPayload): string {
    return jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    } as jwt.SignOptions);
  }
}
