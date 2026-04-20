const router = require("express").Router();

const userRouter = require("./users");
const songsRouter = require('./songs');

router.use("/users", userRouter);
router.use("/songs", songsRouter);

module.exports = router;
