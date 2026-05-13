// routes/adminRoutes.js

import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import { getAdminStats,
    getUsers,
  blockUnblockUser,
  deleteUser,
 } from "../controllers/adminController.js";

const router = express.Router();

router.get("/stats", verifyToken, isAdmin, getAdminStats);
router.get(
  "/users",
  verifyToken,isAdmin,
  getUsers
);

router.patch(
  "/users/:id",
  verifyToken,isAdmin,
  blockUnblockUser
);

router.delete(
  "/users/:id",
  verifyToken,isAdmin,
  deleteUser
);
export default router;