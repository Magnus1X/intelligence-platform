import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { IUserPayload } from "../interfaces";

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ success: false, message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as IUserPayload;
    (req as any).user = decoded;
    next();
  } catch {
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if ((req as any).user?.role !== "admin") {
    return res.status(403).json({ success: false, message: "Admin access required" });
  }
  next();
};
