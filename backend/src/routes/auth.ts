import express, { Request, Response, Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../db.js";

const router: Router = express.Router();

// JWT Secret aus env
const JWT_SECRET = process.env.JWT_SECRET || "supergeheim";

// 🧩 Typen
interface User {
  user_id: number;
  username: string;
  password: string;
}

interface JWTPayload {
  user_id: number;
}

interface AuthRequestBody {
  username?: string;
  password?: string;
}

// Registrierung
router.post(
  "/register",
  async (req: Request<{}, {}, AuthRequestBody>, res: Response) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res
          .status(400)
          .json({ error: "Username and password required" });
      }

      // prüfen, ob Benutzername schon existiert
      const existing = await pool.query<User>(
        "SELECT * FROM users WHERE username=$1",
        [username],
      );

      if (existing.rows.length > 0) {
        return res.status(400).json({ error: "Username already exists" });
      }

      // Passwort hashen
      const hashed = await bcrypt.hash(password, 10);

      // Benutzer einfügen
      const result = await pool.query<User>(
        "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING user_id, username, password",
        [username, hashed],
      );

      res.status(201).json({
        user_id: result.rows[0]!.user_id,
        username: result.rows[0]!.username,
      });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

// Login
router.post(
  "/login",
  async (req: Request<{}, {}, AuthRequestBody>, res: Response) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res
          .status(400)
          .json({ error: "Username and password required" });
      }

      const userResult = await pool.query<User>(
        "SELECT * FROM users WHERE username=$1",
        [username],
      );

      if (userResult.rows.length === 0) {
        return res.status(400).json({ error: "User not found" });
      }

      const user = userResult.rows[0]!;
      const valid = await bcrypt.compare(password, user.password);

      if (!valid) {
        return res.status(401).json({ error: "Invalid password" });
      }

      const token = jwt.sign(
        { user_id: user!.user_id } as JWTPayload,
        JWT_SECRET,
        {
          expiresIn: "1h",
        },
      );

      res.status(200).json({ token });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

export default router;
