const songsRouter = require("express").Router();
const Authentication = require("../../middlewares");
const Song = require("../../schemas/songs.model");
const Album = require("../../schemas/album.model");
// const storage = require("../../misongArrayddlewares/multerUpload");

songsRouter.get("/getSongs", Authentication, async (req, res) => {
  try {
    const songs = await Song.find({ userId: req.user._id });
    res.json(songs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching songs", error });
  }
});

songsRouter.post("/addSongs", Authentication, async (req, res) => {
  const { title, artist, albumId } = req.body;

  try {
    // 1. Validate required fields
    if (!title || !artist || !albumId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // 2. Check album exists + belongs to user
    const album = await Album.findOne({
      _id: albumId,
      userId: req.user._id,
    });

    if (!album) {
      return res.status(404).json({ message: "Album not found" });
    }

    // 3. Safe file handling
    const fileUrl = req.file?.path || null;

    // 4. Create song
    const newSong = await Song.create({
      title,
      artist,
      fileUrl,
      userId: req.user._id,
      albumId,
    });

    res.status(201).json(newSong);
  } catch (error) {
    res.status(500).json({ message: "Error creating song", error });
  }
});

module.exports = songsRouter;
