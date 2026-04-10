import { Request, Response } from "express";
import { CodeService } from "../services/code.service";

export class CodeController {
  private service = new CodeService();

  analyze = async (req: Request, res: Response) => {
    try {
      const { code, language } = req.body;
      const result = await this.service.analyze(code, language);
      res.json({ success: true, data: result });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  };

  explain = async (req: Request, res: Response) => {
    try {
      const { code, language } = req.body;
      const result = await this.service.explain(code, language);
      res.json({ success: true, data: result });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  };
}
