const userRouter = require("express").Router();
const Authentication = require("../../middlewares/index");
const {
  getAllUsers,
  register,
  login,
  getProfile,
  getAdmin,
  addFollower,
} = require("../../controllers/usersController");

userRouter.get("/", getAllUsers);
userRouter.post("/register", register);
userRouter.get("/login", login);
userRouter.get("/profile", Authentication, getProfile);
userRouter.get("/admin", Authentication, getAdmin);
userRouter.post("/addFollower/:id", Authentication, addFollower);

module.exports = userRouter;
