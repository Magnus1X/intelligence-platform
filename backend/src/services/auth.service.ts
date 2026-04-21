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
    const token = this.generateToken({ id: user.id, email: user.email, role: user.role, name: user.name, college: user.college, yearOfStudy: user.yearOfStudy, address: user.address, bio: user.bio, github: user.github, linkedin: user.linkedin, website: user.website });
    return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role, college: user.college, yearOfStudy: user.yearOfStudy, address: user.address, bio: user.bio, github: user.github, linkedin: user.linkedin, website: user.website } };
  }

  async login(email: string, password: string): Promise<{ token: string; user: Partial<IUser> }> {
    const user = await this.userRepo.findByEmail(email);
    if (!user || user.authProvider !== "local" || !(await user.comparePassword(password))) throw new Error("Invalid credentials");

    const token = this.generateToken({ id: user.id, email: user.email, role: user.role, name: user.name, college: user.college, yearOfStudy: user.yearOfStudy, address: user.address, bio: user.bio, github: user.github, linkedin: user.linkedin, website: user.website });
    return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role, college: user.college, yearOfStudy: user.yearOfStudy, address: user.address, bio: user.bio, github: user.github, linkedin: user.linkedin, website: user.website } };
  }

  async googleLogin(idToken: string): Promise<{ token: string; user: Partial<IUser>; isNewUser: boolean }> {
    const { OAuth2Client } = require('google-auth-library');
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || "1234567890-mockclientid.apps.googleusercontent.com");
    
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID || "1234567890-mockclientid.apps.googleusercontent.com",
    });
    
    const payload = ticket.getPayload();
    if (!payload || !payload.email) throw new Error("Invalid Google token");
    
    let user = await this.userRepo.findByEmail(payload.email);
    let isNewUser = false;
    
    if (!user) {
      user = await this.userRepo.create({
        name: payload.name || payload.email.split('@')[0],
        email: payload.email,
        authProvider: "google",
        googleId: payload.sub,
        role: "user"
      });
      isNewUser = true;
    } else if (!user.googleId) {
      // Link existing account
      user.googleId = payload.sub;
      user.authProvider = "google";
      await user.save();
    }
    
    const token = this.generateToken({ id: user.id, email: user.email, role: user.role, name: user.name, college: user.college, yearOfStudy: user.yearOfStudy, address: user.address, bio: user.bio, github: user.github, linkedin: user.linkedin, website: user.website });
    return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role, college: user.college, yearOfStudy: user.yearOfStudy, address: user.address, bio: user.bio, github: user.github, linkedin: user.linkedin, website: user.website }, isNewUser };
  }

  async updateProfile(userId: string, data: Partial<IUser>): Promise<{ user: Partial<IUser> }> {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new Error("User not found");

    if (data.name) user.name = data.name;
    if (data.college !== undefined) user.college = data.college;
    if (data.yearOfStudy !== undefined) user.yearOfStudy = data.yearOfStudy;
    if (data.address !== undefined) user.address = data.address;
    if (data.bio !== undefined) user.bio = data.bio;
    if (data.github !== undefined) user.github = data.github;
    if (data.linkedin !== undefined) user.linkedin = data.linkedin;
    if (data.website !== undefined) user.website = data.website;

    await user.save();
    return { user: { id: user.id, name: user.name, email: user.email, role: user.role, college: user.college, yearOfStudy: user.yearOfStudy, address: user.address, bio: user.bio, github: user.github, linkedin: user.linkedin, website: user.website } };
  }

  public generateToken(user: any): string {
    return jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name, college: user.college, yearOfStudy: user.yearOfStudy, address: user.address, bio: user.bio, github: user.github, linkedin: user.linkedin, website: user.website }, process.env.JWT_SECRET!, {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    } as jwt.SignOptions);
  }
}
