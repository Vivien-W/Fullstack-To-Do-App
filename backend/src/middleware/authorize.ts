import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

// 🔹 Typ für das JWT Payload (wie dein Token aussieht)
interface JwtPayload {
  user_id: number;
  iat?: number;
  exp?: number;
}

// 🔹 Express Request um "user" erweitern
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export default function authorize(
  req: Request,
  res: Response,
  next: NextFunction
): Response | void {
  // ✅ Testmodus überspringt Auth
  if (process.env.NODE_ENV === "test") {
    req.user = { user_id: 1 };
    return next();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Malformed token" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.user = decoded;
    next();
  } catch (err) {
    console.error("❌ Auth error:", err);
    return res.status(403).json({ error: "Invalid token" });
  }
}
