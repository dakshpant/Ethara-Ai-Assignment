import express from "express";

import { authMiddleware } from "../middleware/auth.middleware.js";

import { roleMiddleware } from "../middleware/role.middleware.js";

const router = express.Router();

router.get(
  "/protected",
  authMiddleware,
  async (req, res) => {
    res.status(200).json({
      message: "Protected route accessed",
      user: req.user,
    });
  }
);

router.get(
  "/admin",
  authMiddleware,
  roleMiddleware("ADMIN"),
  async (req, res) => {
    res.status(200).json({
      message: "Welcome Admin",
    });
  }
);

router.get(
  "/member",
  authMiddleware,
  roleMiddleware("ADMIN", "MEMBER"),
  async (req, res) => {
    res.status(200).json({
      message: "Member route accessed",
    });
  }
);

export default router;