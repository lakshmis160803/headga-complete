import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../models/Order.js";
import dotenv from "dotenv";
dotenv.config();
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: Math.round(amount * 100), // Razorpay expects paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create Razorpay order" });
  }
};


export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderData, 
    } = req.body;

   
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, msg: "Payment verification failed" });
    }

    const order = await Order.create({
      user: req.user.id,
      items: orderData.items,
      totalAmount: orderData.totalAmount,
      status: "placed",
      paymentMethod: "online",
      paymentStatus: "paid",
      shipping: orderData.shipping,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
    });

    res.json({ success: true, order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Payment verification error" });
  }
};
