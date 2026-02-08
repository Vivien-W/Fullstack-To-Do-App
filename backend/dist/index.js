"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const todos_js_1 = __importDefault(require("./routes/todos.js"));
const auth_js_1 = __importDefault(require("./routes/auth.js"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: true, // erlaubt Requests von allen Origins
    credentials: true,
}));
app.use(express_1.default.json());
// Routes
app.use("/todos", todos_js_1.default);
app.use("/auth", auth_js_1.default);
// Server nur starten, wenn NICHT Testmodus
if (process.env.NODE_ENV !== "test") {
    const PORT = Number(process.env.PORT) || 5000;
    app.listen(PORT, () => console.log(`🚀 Server läuft im ${process.env.NODE_ENV} Modus auf Port ${PORT}`));
}
// Für Supertest / Vitest Export
exports.default = app;
//# sourceMappingURL=index.js.map