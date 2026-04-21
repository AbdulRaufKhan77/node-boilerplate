const router = require("express").Router();

const userRouter = require("./users");
const songsRouter = require('./songs');
const albumRouter = require("./album");

router.use("/users", userRouter);
router.use("/songs", songsRouter);
router.use("/albums", albumRouter);
module.exports = router;
