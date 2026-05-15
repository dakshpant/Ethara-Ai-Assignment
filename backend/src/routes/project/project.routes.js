import express from "express";

import {
  createProject,
  getProjects,
  addMemberToProject,
} from "../../controllers/project/project.controller.js";

import { authMiddleware } from "../../middleware/auth.middleware.js";

import { roleMiddleware } from "../../middleware/role.middleware.js";

const router = express.Router();


// CREATE PROJECT
router.post(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  createProject
);


// GET PROJECTS
router.get(
  "/",
  authMiddleware,
  getProjects
);


// ADD MEMBER
router.post(
  "/:projectId/members",
  authMiddleware,
  roleMiddleware("ADMIN"),
  addMemberToProject
);

export default router;