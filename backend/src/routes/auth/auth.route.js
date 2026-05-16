import express from "express";

import {
  signup,
  login,
  getUsers,
} from "../../controllers/auth/auth.controller.js";

import { authMiddleware }
from "../../middleware/auth.middleware.js";
import { roleMiddleware } from "../../middleware/role.middleware.js"

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.get(
  "/users",
  authMiddleware,
  roleMiddleware("ADMIN"),
  getUsers,
);

export default router;