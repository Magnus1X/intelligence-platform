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

  me = async (req: Request, res: Response) => {
    res.json({ success: true, data: (req as any).user });
  };
}
