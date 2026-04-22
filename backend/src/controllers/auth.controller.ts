import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

export class AuthController {
  private service = new AuthService();

  register = async (req: Request, res: Response) => {
    try {
      const { name, email, password, college, yearOfStudy, address } = req.body;
      const result = await this.service.register(name, email, password, college, yearOfStudy, address);
      res.status(201).json({ success: true, data: result });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const result = await this.service.login(email, password);
      res.json({ success: true, data: result });
    } catch (err: any) {
      res.status(401).json({ success: false, message: err.message });
    }
  };

  googleCallback = async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      if (!user) throw new Error("Authentication failed");
      
      const token = this.service.generateToken(user);
      const frontendUrl = (process.env.CLIENT_URL || process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/+$/, "");
      
      // Redirect back to frontend with the token
      res.redirect(`${frontendUrl}/auth/callback?token=${token}`);
    } catch (err: any) {
      const frontendUrl = (process.env.CLIENT_URL || process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/+$/, "");
      res.redirect(`${frontendUrl}/auth?error=${encodeURIComponent(err.message)}`);
    }
  };

  me = async (req: Request, res: Response) => {
    try {
      const payload = (req as any).user;
      // Fetch fresh user to get all fields
      const user = await this.service['userRepo'].findById(payload.id); // hacky access to repo, better to add findUser to service
      if (!user) throw new Error("User not found");
      
      res.json({ success: true, data: { id: user.id, name: user.name, email: user.email, role: user.role, college: user.college, yearOfStudy: user.yearOfStudy, address: user.address, bio: user.bio, github: user.github, linkedin: user.linkedin, website: user.website } });
    } catch (err: any) {
      res.status(401).json({ success: false, message: err.message });
    }
  };

  updateProfile = async (req: Request, res: Response) => {
    try {
      const payload = (req as any).user;
      const result = await this.service.updateProfile(payload.id, req.body);
      res.json({ success: true, data: result.user });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  };
}
