

const router = require("express").Router();


const userRouter = require("./users");
const songsRouter = require("./songs");
const albumRouter = require("./album");
const eventRouter = require("./events");
const discoverRouter = require("./discovery");

router.use("/users", userRouter);
router.use("/songs", songsRouter);
router.use("/albums", albumRouter);
router.use("/events", eventRouter);
router.use("/discover", discoverRouter);
module.exports = router;
