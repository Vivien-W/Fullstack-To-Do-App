import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../db.js";
const router = express.Router();
// JWT Secret aus env
const JWT_SECRET = process.env.JWT_SECRET || "supergeheim";
// Registrierung
router.post("/register", async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res
                .status(400)
                .json({ error: "Username and password required" });
        }
        // prüfen, ob Benutzername schon existiert
        const existing = await pool.query("SELECT * FROM users WHERE username=$1", [username]);
        if (existing.rows.length > 0) {
            return res.status(400).json({ error: "Username already exists" });
        }
        // Passwort hashen
        const hashed = await bcrypt.hash(password, 10);
        // Benutzer einfügen
        const result = await pool.query("INSERT INTO users (username, password) VALUES ($1, $2) RETURNING user_id, username, password", [username, hashed]);
        res.status(201).json({
            user_id: result.rows[0].user_id,
            username: result.rows[0].username,
        });
    }
    catch (err) {
        console.error("❌ Fehler bei /register:", err.message);
        res.status(500).json({ error: err.message });
    }
});
// Login
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res
                .status(400)
                .json({ error: "Username and password required" });
        }
        const userResult = await pool.query("SELECT * FROM users WHERE username=$1", [username]);
        if (userResult.rows.length === 0) {
            return res.status(400).json({ error: "User not found" });
        }
        const user = userResult.rows[0];
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            return res.status(401).json({ error: "Invalid password" });
        }
        const token = jwt.sign({ user_id: user.user_id }, JWT_SECRET, {
            expiresIn: "1h",
        });
        res.status(200).json({ token });
    }
    catch (err) {
        console.error("❌ Fehler bei /login:", err.message);
        res.status(500).json({ error: err.message });
    }
});
export default router;
//# sourceMappingURL=auth.js.map