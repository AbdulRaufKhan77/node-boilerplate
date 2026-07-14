const userRouter = require("express").Router();
const Authentication = require("../../middlewares/index");
const {
  getAllUsers,
  register,
  login,
  getProfile,
  getAdmin,
  addFollower,
  getUserById,
} = require("../../controllers/usersController");


// swagger documentation for user routes
/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     responses:
 *       200:
 *         description: Success
 *
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *
 * /api/users/login:
 *   post:
 *     summary: Login a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *
 * /api/users/profile:
 *   get:
 *     summary: Get user profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *
 * /api/users/admin:
 *   get:
 *     summary: Get admin access
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 * /api/users/addFollower/{id}:
 *   post:
 *     summary: Add a follower to a user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Follower added successfully
 */ 


userRouter.get("/", getAllUsers);
userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.get("/profile", Authentication, getProfile);
userRouter.get("/admin", Authentication, getAdmin);
userRouter.post("/addFollower/:id", Authentication, addFollower);
// Keep last so it doesn't shadow the named routes above
userRouter.get("/:id", getUserById);

module.exports = userRouter;
