import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// JWT verification middleware
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const token:any = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, "your_jwt_secret_key") as any;
    (req as any).user = decoded;  
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

// Admin middleware
export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const user:any = (req as any).user;
  if (user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Forbidden: Admins only" });
  }
  next();
};
