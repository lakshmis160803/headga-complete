export const isAdmin = (req, res, next) => {
  console.log("USER IN ADMIN:", req.user);

  if (req.user.role !== "admin") {
    return res.status(403).json({ msg: "Admin only" });
  }

  next();
};