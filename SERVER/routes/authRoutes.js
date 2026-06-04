import express from "express";
import passport from "../controllers/passport.js";

// import { updateProfile } from "../controllers/authController.js";
import { upload } from "../utils/cloudinary.js";
import {
  preRegister,
  verifyRegisterOtp,
  login,
  verifyOtp,
  refreshAccessToken,
  googleCallback,
  logout,
  getMe,
  
} from "../controllers/authcontroller.js";

import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();


router.post("/pre-register", preRegister);

router.post(
  "/verify-register-otp",
  verifyRegisterOtp
);

router.post("/login", login);

router.post("/verify-otp", verifyOtp);

router.post(
  "/refresh",
  refreshAccessToken
);

router.post("/logout", logout);


router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
    prompt: "select_account",
  })
);

router.get(
  "/google/callback",
  
  passport.authenticate("google", {
    failureRedirect:
    "https://headga-complete.vercel.app/login",
    session: false,
  }),
  
  googleCallback
);


router.get(
  "/me",
  verifyToken,
  getMe
);

// router.put("/profile", protect, updateProfile);
router.put("/profile", protect, upload.single("avatar"), updateProfile);
export default router;