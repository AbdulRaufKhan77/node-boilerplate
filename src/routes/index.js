const router = require("express").Router();

const userRouter = require("./users");
const songsRouter = require("./songs");
const albumRouter = require("./album");
const eventRouter = require("./events");

router.use("/users", userRouter);
router.use("/songs", songsRouter);
router.use("/albums", albumRouter);
router.use("/events", eventRouter);
module.exports = router;
