import express from "express";
import {
  getCart,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart
} from "../controllers/cartController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
const router = express.Router();
router.get("/",verifyToken, getCart);
router.post("/",verifyToken, addToCart);
router.patch("/clear",verifyToken, clearCart);
router.patch("/update",verifyToken, updateQuantity);
router.patch("/remove",verifyToken, removeFromCart);

export default router;