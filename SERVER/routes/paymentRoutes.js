import express from "express";
import { createRazorpayOrder, verifyPayment } from "../controllers/paymentController.js";
import { verifyToken} from "../middlewares/authMiddleware.js"; // your existing auth middleware

const router = express.Router();

router.post("/create-order", verifyToken, createRazorpayOrder);
router.post("/verify", verifyToken, verifyPayment);

export default router;