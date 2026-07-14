/**
 * @swagger
 * /api/songs:
 *   get:
 *     summary: Get all songs
 *     responses:
 *       200:
 *         description: Success
 */

const albumRouter = require("express").Router();
const Authentication = require("../../middlewares");
const storage = require("../../middlewares/multerUpload");
const {
  getAlbums,
  addAlbum,
  addFavouriteAlbum,
  getAlbumById,
} = require("../../controllers/albumController");

albumRouter.get("/getAlbums", Authentication, getAlbums);
albumRouter.post(
  "/addAlbum",
  Authentication,
  storage.upload.single("coverImage"),
  addAlbum,
);
albumRouter.post("/addFavouriteAlbum", Authentication, addFavouriteAlbum);
// Keep last so it doesn't shadow the named routes above
albumRouter.get("/:id", Authentication, getAlbumById);

module.exports = albumRouter;
