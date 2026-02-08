"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = authorize;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";
function authorize(req, res, next) {
    // ✅ Testmodus überspringt Auth
    if (process.env.NODE_ENV === "test") {
        req.user = { user_id: 1 };
        return next();
    }
    const authHeader = req.headers.authorization;
    if (!authHeader)
        return res.status(401).json({ error: "No token provided" });
    const token = authHeader.split(" ")[1];
    if (!token)
        return res.status(401).json({ error: "Malformed token" });
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (err) {
        console.error("❌ Auth error:", err);
        return res.status(403).json({ error: "Invalid token" });
    }
}
//# sourceMappingURL=authorize.js.map