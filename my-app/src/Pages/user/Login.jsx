import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useWishlist } from "./WishlistContext";
import { useAuth } from "../../context/AuthContext.jsx";

function Login() {
  const [login, setLogin] = useState(true);
  const { setUser } = useAuth();
  // const { setUserId } = useWishlist();
  const navigate = useNavigate();

  const [userdata, setUserdata] = useState({
    name: "",
    email: "",
    password: "",
    confirmpassword: "",
  });

  const emptyUser = { name: "", email: "", password: "", confirmpassword: "" };

  const [showLoginOtp, setShowLoginOtp] = useState(false);
  const [loginOtp, setLoginOtp] = useState("");

  const [showSignupOtp, setShowSignupOtp] = useState(false);
  const [signupOtp, setSignupOtp] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserdata((prev) => ({ ...prev, [name]: value }));
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
    if (!regex.test(password)) {
      toast.error("Password must have 8+ chars, 1 uppercase, 1 lowercase, 1 number, 1 special character");
      return false;
    }
    return true;
  };

  const validateEmail = (email) => {
    if (!email.toLowerCase().endsWith("@gmail.com")) {
      toast.error("Email must be a valid @gmail.com address");
      return false;
    }
    return true;
  };

  const handleTabSwitch = (isLogin) => {
    setLogin(isLogin);
    setUserdata(emptyUser);
    setShowLoginOtp(false);
    setLoginOtp("");
    setShowSignupOtp(false);
    setSignupOtp("");
  };

  // ─────────────────────────────────────────
  // LOGIN → Send OTP
  // ─────────────────────────────────────────
  const handleLoginSubmit = async () => {
    try {
      await axios.post("https://headga-backend.onrender.com/api/auth/login",  {
        email: userdata.email.trim(),
        password: userdata.password,
      },
  {
    withCredentials: true,
  }
);
      toast.success("OTP sent to your email");
      setShowLoginOtp(true);
    } catch (err) {
      toast.error(err.response?.data?.msg || "Login failed");
    }
  };

  // ─────────────────────────────────────────
  // LOGIN → Verify OTP
  // ─────────────────────────────────────────
  const verifyLoginOtpHandler = async () => {
    if (!loginOtp) return toast.error("Please enter OTP");
    try {
      const res = await axios.post(
  "https://headga-backend.onrender.com/api/auth/verify-otp",
        { email: userdata.email.trim(), otp: loginOtp },
        { withCredentials: true }
      );
   setUser({ id: res.data.user.id, name: res.data.user.name, role: res.data.user.role });
      toast.success("Login successful");
      res.data.user.role === "admin" ? navigate("/admin") : navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.msg || "OTP verification failed");
    }
  };

  // ─────────────────────────────────────────
  // SIGNUP → Send OTP
  // ─────────────────────────────────────────
  const handleSignupSubmit = async () => {
    if (!validateEmail(userdata.email)) return;
    if (!validatePassword(userdata.password)) return;
    if (userdata.password !== userdata.confirmpassword) {
      return toast.error("Passwords do not match");
    }
    try {
await axios.post("https://headga-backend.onrender.com/api/auth/pre-register", {
        name: userdata.name,
        email: userdata.email.trim(),
        password: userdata.password,
      },
  {
    withCredentials: true,
  }
);
      toast.success("OTP sent to your email");
      setShowSignupOtp(true);
    } catch (err) {
      toast.error(err.response?.data?.msg || "Signup failed");
    }
  };

  // ─────────────────────────────────────────
  // SIGNUP → Verify OTP
  // ─────────────────────────────────────────
  const verifySignupOtpHandler = async () => {
    if (!signupOtp) return toast.error("Please enter OTP");
    try {
      const res = await axios.post(
  "https://headga-backend.onrender.com/api/auth/verify-register-otp",
        { email: userdata.email.trim(), otp: signupOtp },
        { withCredentials: true }
      );
     setUser({ id: res.data.user.id, name: res.data.user.name, role: res.data.user.role });
      toast.success("Account created! Welcome!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.msg || "OTP verification failed");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    login ? handleLoginSubmit() : handleSignupSubmit();
  };

  // ─────────────────────────────────────────
  // GOOGLE LOGIN
  // ─────────────────────────────────────────
  const handleGoogleLogin = () => {
    window.location.href =
  "https://headga-backend.onrender.com/api/auth/google";
  };

  // ─────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────
  return (
    <div className="relative min-h-screen flex justify-center items-center bg-black overflow-hidden">

      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40 blur-sm scale-110"
        style={{
          backgroundImage:
            "url('https://cdn.shopify.com/s/files/1/0548/8849/7221/files/Artboard_3_e62dab35-b7c1-483e-a195-aa0f83225f50.jpg?v=1766997342')",
        }}
      />

      {/* Card */}
      <div className="w-[430px] p-8 rounded-2xl relative z-10 bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.8)] text-white">

        {/* Title */}
        <div className="flex justify-center mb-4">
          <h2 className="text-3xl font-semibold">{login ? "Login" : "Sign Up"}</h2>
        </div>

        {/* Tab Toggle */}
        <div className="relative flex h-12 mb-6 rounded-full overflow-hidden bg-white/10 backdrop-blur-md border border-white/20">
          <button
            type="button"
            onClick={() => handleTabSwitch(true)}
            className={`w-1/2 text-lg font-medium z-10 ${login ? "text-white" : "text-gray-300"}`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => handleTabSwitch(false)}
            className={`w-1/2 text-lg font-medium z-10 ${!login ? "text-white" : "text-gray-300"}`}
          >
            Sign Up
          </button>
          <div
            className={`absolute top-0 h-full w-1/2 rounded-full bg-white/20 transition-all duration-300 ${
              login ? "left-0" : "left-1/2"
            }`}
          />
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>

          {/* Signup: Name */}
          {!login && (
            <input
              type="text"
              name="name"
              value={userdata.name}
              onChange={handleChange}
              placeholder="Name"
              required
              className="w-full p-3 border border-white/20 rounded-lg bg-white/10 text-white placeholder-gray-400"
            />
          )}

          {/* Email */}
          <input
            type="email"
            name="email"
            value={userdata.email}
            onChange={handleChange}
            placeholder="Email Address"
            required
            className="w-full p-3 border border-white/20 rounded-lg bg-white/10 text-white placeholder-gray-400"
          />

          {/* Password */}
          <input
            type="password"
            name="password"
            value={userdata.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="w-full p-3 border border-white/20 rounded-lg bg-white/10 text-white placeholder-gray-400"
          />

          {/* Signup: Confirm Password */}
          {!login && (
            <input
              type="password"
              name="confirmpassword"
              value={userdata.confirmpassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              required
              className="w-full p-3 border border-white/20 rounded-lg bg-white/10 text-white placeholder-gray-400"
            />
          )}

          {/* Login OTP Block */}
          {login && showLoginOtp && (
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Enter OTP sent to your email"
                value={loginOtp}
                onChange={(e) => setLoginOtp(e.target.value)}
                className="w-full p-3 border border-white/20 rounded-lg bg-white/10 text-white placeholder-gray-400"
              />
              <button
                type="button"
                onClick={verifyLoginOtpHandler}
                className="w-full p-3 rounded-full font-semibold text-white bg-green-600 hover:bg-green-700 transition-all"
              >
                Verify & Login
              </button>
            </div>
          )}

          {/* Signup OTP Block */}
          {!login && showSignupOtp && (
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Enter OTP sent to your email"
                value={signupOtp}
                onChange={(e) => setSignupOtp(e.target.value)}
                className="w-full p-3 border border-white/20 rounded-lg bg-white/10 text-white placeholder-gray-400"
              />
              <button
                type="button"
                onClick={verifySignupOtpHandler}
                className="w-full p-3 rounded-full font-semibold text-white bg-green-600 hover:bg-green-700 transition-all"
              >
                Verify & Create Account
              </button>
            </div>
          )}

          {/* Submit Button — hidden after OTP shown */}
          {!(login && showLoginOtp) && !showSignupOtp && (
            <button
              type="submit"
              className="w-full p-3 rounded-full font-semibold text-white bg-black/40 hover:bg-black/60 transition-all"
            >
              {login ? "Login" : "Sign Up"}
            </button>
          )}

          {/* Google Login */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-white/20 rounded-xl hover:bg-white/10 transition-all"
          >
            <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
            <span className="text-white font-medium">Continue with Google</span>
          </button>

          {/* Tab Switch Link */}
          <div className="text-center text-gray-300">
            {login ? "Don't have an account?" : "Already have an account?"}
            <button
              type="button"
              onClick={() => handleTabSwitch(!login)}
              className="text-white ml-1 underline"
            >
              {login ? "Sign Up" : "Login"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default Login;