const jwt = require("jsonwebtoken");
const User = require("../schemas/user.model");

const Authentication = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, "token");
    const user = await User.findOne({ email: decoded.email }).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    req.user = user;
    next()
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token", error });
  }
};

module.exports = Authentication;
