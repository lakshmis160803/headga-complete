import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import crypto from "crypto";
import { sendOtpEmail } from "../utils/sendOtp.js";

const pendingRegistrations = new Map();

const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.ACCESS_SECRET,
    {
      expiresIn: "15m",
    }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
    },
    process.env.REFRESH_SECRET,
    {
      expiresIn: "14d",
    }
  );
};

export const preRegister = async (req, res) => {
  try {
    let { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        msg: "All fields required",
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    const exists = await User.findOne({
      email: cleanEmail,
    });

    if (exists) {
      return res.status(400).json({
        msg: "Email already exists",
      });
    }

    const hashed = await bcrypt.hash(password, 10);

    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const otpHash = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");

    pendingRegistrations.set(cleanEmail, {
      name,
      email: cleanEmail,
      password: hashed,
      otpHash,
      expiresAt: Date.now() + 5 * 60 * 1000,
    });

    await sendOtpEmail(cleanEmail, otp);

    return res.status(200).json({
      msg: "OTP sent",
      email: cleanEmail,
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      msg: "Server error",
    });
  }
};

export const verifyRegisterOtp = async (
  req,
  res
) => {

  try {

    const { email, otp } = req.body;

    const cleanEmail =
      email.trim().toLowerCase();

    const pending =
      pendingRegistrations.get(cleanEmail);

    if (!pending) {
      return res.status(400).json({
        msg: "No pending registration found",
      });
    }

    if (Date.now() > pending.expiresAt) {

      pendingRegistrations.delete(cleanEmail);

      return res.status(400).json({
        msg: "OTP expired",
      });
    }

    const hashedOtp = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");

    if (hashedOtp !== pending.otpHash) {
      return res.status(400).json({
        msg: "Invalid OTP",
      });
    }

    const user = await User.create({
      name: pending.name,
      email: pending.email,
      password: pending.password,
    });

    pendingRegistrations.delete(cleanEmail);

    const accessToken =
      generateAccessToken(user);

    const refreshToken =
      generateRefreshToken(user);

    user.refreshToken = refreshToken;

    await user.save();

    res

      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 15 * 60 * 1000,
      })

      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge:
          7 * 24 * 60 * 60 * 1000,
      })

      .status(201)

      .json({
        msg: "Registered successfully",

        user: {
          id: user._id,
          name: user.name,
          role: user.role,
        },
      });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      msg: "Server error",
    });
  }
};

export const login = async (req, res) => {
  try {
    console.log("LOGIN START");

    const { email, password } = req.body;

    const cleanEmail = email.trim().toLowerCase();

    console.log("SEARCHING USER");

    const user = await User.findOne({
      email: cleanEmail,
    });

    console.log("USER FOUND");

    if (!user) {
      return res.status(400).json({
        msg: "User not found",
      });
    }

    if (user.blocked) {
      return res.status(403).json({
        msg: "This account is blocked by admin.",
      });
    }

    if (user.password === "google-auth-user") {
      return res.status(400).json({
        msg: "Please use Google to sign in.",
      });
    }

    console.log("CHECKING PASSWORD");

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    console.log("PASSWORD CHECKED");

    if (!isMatch) {
      return res.status(400).json({
        msg: "Invalid credentials",
      });
    }

    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const otpHash = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");

    user.otpHash = otpHash;
    user.otpExpires = Date.now() + 5 * 60 * 1000;

    console.log("SAVING USER");

    await user.save();

    console.log("USER SAVED");

    console.log("SENDING OTP");

    await sendOtpEmail(user.email, otp);

    console.log("OTP SENT");

    return res.json({
      msg: "OTP sent",
      email: user.email,
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);

    res.status(500).json({
      msg: "Server error",
    });
  }
};

export const verifyOtp = async (req, res) => {

  try {

    const { email, otp } = req.body;

    const cleanEmail =
      email.trim().toLowerCase();

    const user = await User.findOne({
      email: cleanEmail,
    });

    if (!user) {
      return res.status(400).json({
        msg: "User not found",
      });
    }

    if (
      !user.otpExpires ||
      user.otpExpires < Date.now()
    ) {
      return res.status(400).json({
        msg: "OTP expired",
      });
    }

    const hashedOtp = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");

    if (hashedOtp !== user.otpHash) {
      return res.status(400).json({
        msg: "Invalid OTP",
      });
    }

    const accessToken =
      generateAccessToken(user);

    const refreshToken =
      generateRefreshToken(user);

    user.refreshToken = refreshToken;

    user.otpHash = undefined;
    user.otpExpires = undefined;

    await user.save();

    res

      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 15 * 60 * 1000,
      })

      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge:
          7 * 24 * 60 * 60 * 1000,
      })

      .json({
        msg: "Login successful",

        user: {
          id: user._id,
          name: user.name,
          role: user.role,
        },
      });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      msg: "Server error",
    });
  }
};

export const refreshAccessToken = async (
  req,
  res
) => {

  try {

    const refreshToken =
      req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        msg: "No refresh token",
      });
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_SECRET
    );

    const user = await User.findById(
      decoded.id
    );

    if (!user) {
      return res.status(404).json({
        msg: "User not found",
      });
    }

    if (
      user.refreshToken !== refreshToken
    ) {
      return res.status(403).json({
        msg: "Invalid refresh token",
      });
    }

    const newAccessToken =
      generateAccessToken(user);

    res

      .cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 15 * 60 * 1000,
      })

      .json({
        msg: "Access token refreshed",
      });

  } catch (err) {

    console.error(err);

    return res.status(403).json({
      msg: "Refresh failed",
    });
  }
};

export const googleCallback = async (
  req,
  res
) => {

  try {

    const accessToken =
      generateAccessToken(req.user);

    const refreshToken =
      generateRefreshToken(req.user);

    req.user.refreshToken =
      refreshToken;

    await req.user.save();

    res
.cookie("accessToken", accessToken, {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  maxAge: 15 * 60 * 1000,
})

.cookie("refreshToken", refreshToken, {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  maxAge: 7 * 24 * 60 * 60 * 1000,
})
      .redirect(
        req.user.role === "admin"
          ?"https://headga-complete.vercel.app/admin"
          : "https://headga-complete.vercel.app/"
      );

  } catch (err) {

    console.error(err);

   
      res.redirect("https://headga-complete.vercel.app/login");
    
  }
};

export const logout = async (req, res) => {

  try {

    const refreshToken =
      req.cookies.refreshToken;

    if (refreshToken) {

      await User.findOneAndUpdate(
        { refreshToken },
        { refreshToken: null }
      );
    }

    res

      .clearCookie("accessToken", {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        path: "/",
      })

      .clearCookie("refreshToken", {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        path: "/",
      })

      .json({
        msg: "Logged out successfully",
      });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      msg: "Logout failed",
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("name role avatar");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json({
      id: user._id,
      name: user.name,
      role: user.role,
      avatar: user.avatar,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name } = req.body;
    const avatar = req.file?.path || req.body.avatar;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, avatar },
      { new: true }
    ).select("name avatar role");

    res.json({
      msg: "Profile updated",
      user: { id: user._id, name: user.name, avatar: user.avatar, role: user.role },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};