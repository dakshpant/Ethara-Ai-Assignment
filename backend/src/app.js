import express from "express";
import cors from "cors";

import { errorMiddleware }
from "./middleware/error.middleware.js";

import authRoutes from "./routes/auth/auth.route.js";
import projectRoutes from "./routes/project/project.routes.js";
import taskRoutes from "./routes/task/task.routes.js";
import dashboardRoutes
from "./routes/dashboard/dashboard.routes.js";

const app = express();

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(express.json());


// Health Route
app.get("/", (req, res) => {
  res.json({
    message: "API is running",
  });
});


// Routes
app.use("/api/auth", authRoutes);

app.use("/api/projects", projectRoutes);

app.use("/api/tasks", taskRoutes);

app.use("/api/dashboard", dashboardRoutes);


// 404 Route
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});


// Error Middleware
app.use(errorMiddleware);

export default app;