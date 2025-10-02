const userRouter = require("express").Router();
const User = require("../../schemas/user.model");
const jwt = require("jsonwebtoken");

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
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const jwtToken = jwt.sign({ email }, "token", { expiresIn: "1h" });
    console.log("JWT Token:", jwtToken);
    const newUser = new User({ name, email, password });
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

userRouter.get("/profile", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, "token");
    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token", error });
  }
});

module.exports = userRouter;
