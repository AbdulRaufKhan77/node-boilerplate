const albumRouter = require("express").Router();
const Authentication = require("../../middlewares");
const storage = require("../../middlewares/multerUpload");
const { getAlbums, addAlbum } = require("../../controllers/albumController");

albumRouter.get("/getAlbums", Authentication, getAlbums);

albumRouter.post(
  "/addAlbum",
  storage.upload.single("coverImage"),
  Authentication,
  addAlbum,
);

module.exports = albumRouter;
