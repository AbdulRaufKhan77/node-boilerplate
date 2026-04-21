const userRouter = require("express").Router();
const Authentication = require("../../middlewares/index");
const {
  getAllUsers,
  addUser,
  register,
  login,
  getProfile,
  getAdmin,
} = require("../../controllers/usersController");

// Route to get all users
userRouter.get("/", getAllUsers);

// Route to create a new user
userRouter.post("/addUser", addUser);

// Route to register a new user
userRouter.post("/register", register);

// Route to login
userRouter.get("/login", login);

// Route to get user profile
userRouter.get("/profile", Authentication, getProfile);

// Route to get admin access
userRouter.get("/admin", Authentication, getAdmin);

module.exports = userRouter;
