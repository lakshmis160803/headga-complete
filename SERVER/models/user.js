import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    index: true
  },

  password: {
    type: String,
    required: false,  // ← changed: Google users have no password
    default: null
  },

  googleId: {
    type: String,
    default: null     // ← new: stores Google profile ID
  },

  avatar: {
    type: String,
    default: null     // ← new: stores Google profile picture URL
  },

  otpHash: String,

  otpExpires: Date,

  otpAttempts: {
    type: Number,
    default: 0
  },

  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },

  blocked: {
    type: Boolean,
    default: false
  },

refreshToken: {
  type: String,
  default: null
}

}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", userSchema);