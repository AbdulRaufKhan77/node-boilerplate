const userRouter = require("express").Router();
const User = require("../../schemas/user.model");
const jwt = require("jsonwebtoken");

const Authentication = require("../../middlewares/index");

// Route to get all users
userRouter.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
});

// Route to create a new user
userRouter.post("/addUser", async (req, res) => {
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
});

userRouter.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const jwtToken = jwt.sign({ email }, "token", { expiresIn: "1h" });
    const newUser = new User({ name, email, password, role });
    await newUser.save();
    res.status(201).json({
      message: "User registered successfully",
      user: newUser,
      token: jwtToken,
    });
  } catch (error) {
    res.status(400).json({ message: "Error registering user", error });
  }
});

userRouter.get("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.find({ email, password });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const jwtToken = jwt.sign({ email }, "token", { expiresIn: "1h" });
    res.json({ message: "Login successful", user, token: jwtToken });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
});

userRouter.get("/profile", Authentication, async (req, res) => {
  res.json({ message: "Welcome!", user: req.user });
});

userRouter.get("/admin", Authentication, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden: Admins only" });
  }
  res.json({ message: "Welcome, Admin!", user: req.user });
});




module.exports = userRouter;
