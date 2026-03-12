import express from "express";
import cors from "cors";
import todoRoutes from "./routes/todos";
import authRoutes from "./routes/auth";

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

app.use(express.json());

// Routes
app.use("/todos", todoRoutes);
app.use("/auth", authRoutes);

export default app;
