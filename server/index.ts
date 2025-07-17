import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { getUsers, createUser } from "./routes/users";
import { claimPoints, getHistory } from "./routes/claimPoints";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Hello from Express server v2!" });
  });

  app.get("/api/demo", handleDemo);

  // Leaderboard API routes
  app.get("/api/users", getUsers);
  app.post("/api/users", createUser);
  app.post("/api/claim-points", claimPoints);
  app.get("/api/history", getHistory);

  return app;
}
