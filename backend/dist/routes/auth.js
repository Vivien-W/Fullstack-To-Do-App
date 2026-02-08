"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_js_1 = __importDefault(require("../db.js"));
const router = express_1.default.Router();
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
        const existing = await db_js_1.default.query("SELECT * FROM users WHERE username=$1", [username]);
        if (existing.rows.length > 0) {
            return res.status(400).json({ error: "Username already exists" });
        }
        // Passwort hashen
        const hashed = await bcrypt_1.default.hash(password, 10);
        // Benutzer einfügen
        const result = await db_js_1.default.query("INSERT INTO users (username, password) VALUES ($1, $2) RETURNING user_id, username, password", [username, hashed]);
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
        const userResult = await db_js_1.default.query("SELECT * FROM users WHERE username=$1", [username]);
        if (userResult.rows.length === 0) {
            return res.status(400).json({ error: "User not found" });
        }
        const user = userResult.rows[0];
        const valid = await bcrypt_1.default.compare(password, user.password);
        if (!valid) {
            return res.status(401).json({ error: "Invalid password" });
        }
        const token = jsonwebtoken_1.default.sign({ user_id: user.user_id }, JWT_SECRET, {
            expiresIn: "1h",
        });
        res.status(200).json({ token });
    }
    catch (err) {
        console.error("❌ Fehler bei /login:", err.message);
        res.status(500).json({ error: err.message });
    }
});
exports.default = router;
//# sourceMappingURL=auth.js.map