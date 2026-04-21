const User = require("../../schemas/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

// Create a new user (with bearer token authentication)
const addUser = async (req, res) => {
  const header = req.headers;
  const auth = header.authorization;
  if (!auth || auth !== "Bearer mysecrettoken") {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const { name, email, password } = req.body;
  try {
    const newUser = new User({ name, email, password });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: "Error creating user", error });
  }
};

// Register a new user
const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const jwtToken = jwt.sign({ email }, "token", { expiresIn: "1h" });
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();
    res.status(201).json({
      message: "User registered successfully",
      user: newUser,
      token: jwtToken,
    });
  } catch (error) {
    res.status(400).json({ message: "Error registering user", error });
  }
};

// Login user
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, password });
    console.log(user);
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const jwtToken = jwt.sign({ email }, "token", { expiresIn: "1h" });
    res.json({ message: "Login successful", user, token: jwtToken });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};

// Get user profile
const getProfile = async (req, res) => {
  res.json({ message: "Welcome!", user: req.user });
};

// Get admin access
const getAdmin = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden: Admins only" });
  }
  res.json({ message: "Welcome, Admin!", user: req.user });
};

module.exports = {
  getAllUsers,
  addUser,
  register,
  login,
  getProfile,
  getAdmin,
};
