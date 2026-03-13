import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import todoRoutes from "./routes/todos.js";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app: Application = express();

app.use(
  cors({
    origin: "*",
    credentials: true,
  }),
);

app.use(express.json());

// Routes
app.use("/todos", todoRoutes);
app.use("/auth", authRoutes);

// Server nur starten, wenn NICHT Testmodus
// if (process.env.NODE_ENV !== "test") {
//  const PORT: number = Number(process.env.PORT) || 5000;
//  app.listen(PORT, () =>
//    console.log(
//      `🚀 Server läuft im ${process.env.NODE_ENV} Modus auf Port ${PORT}`,
//    ),
//  );
// }

// Für Supertest / Vitest Export
export default app;
