const songsRouter = require("express").Router();
const Authentication = require("../../middlewares");
const { getSongs, addSongs } = require("../../controllers/songsController");

songsRouter.get("/getSongs", Authentication, getSongs);

songsRouter.post("/addSongs", Authentication, addSongs);

module.exports = songsRouter;
