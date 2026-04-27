const albumRouter = require("express").Router();
const Authentication = require("../../middlewares");
const storage = require("../../middlewares/multerUpload");
const {
  getAlbums,
  addAlbum,
  addFavouriteAlbum,
} = require("../../controllers/albumController");

albumRouter.get("/getAlbums", Authentication, getAlbums);
albumRouter.post(
  "/addAlbum",
  storage.upload.single("coverImage"),
  Authentication,
  addAlbum,
);
albumRouter.post("/addFavouriteAlbum", Authentication, addFavouriteAlbum);

module.exports = albumRouter;
