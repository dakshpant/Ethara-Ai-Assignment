import express from "express";

import {
  createTask,
  getTasks,
  updateTaskStatus,
  deleteTask,
} from "../../controllers/task/task.controller.js";

import { authMiddleware } from "../../middleware/auth.middleware.js";

import { roleMiddleware } from "../../middleware/role.middleware.js";

const router = express.Router();


// CREATE TASK
router.post(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  createTask
);


// GET TASKS
router.get(
  "/",
  authMiddleware,
  getTasks
);


// UPDATE TASK
router.patch(
  "/:id",
  authMiddleware,
  updateTaskStatus
);


// DELETE TASK
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  deleteTask
);

export default router;