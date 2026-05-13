import express from "express";
import {
  createOrder,
  getOrders,
  getOrdersadmin,
  updateOrderStatus,
  deleteOrder
} from "../controllers/orderController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, createOrder);
router.get("/", verifyToken, getOrders);
router.get("/adminorders", verifyToken, getOrdersadmin);
router.patch("/:id", verifyToken, updateOrderStatus);
router.delete("/:id", verifyToken, deleteOrder);

export default router;