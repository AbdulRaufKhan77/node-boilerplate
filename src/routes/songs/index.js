const songsRouter = require("express").Router();
const Authentication = require("../../middlewares");
const Song = require("../../schemas/songs.model");
const Album = require("../../schemas/album.model");

songsRouter.get("/getSongs", Authentication, async (req, res) => {
  const { albumId } = req.query;
  try {
    const songs = await Song.find({ albumId });
    res.json(songs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching songs", error });
  }
});

songsRouter.post("/addSongs", Authentication, async (req, res) => {
  const { title, artist, albumId } = req.body;
  try {
    if (!title || !artist || !albumId) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const album = await Album.findOne({
      _id: albumId,
      userId: req.user._id,
    });

    if (!album) {
      return res.status(404).json({ message: "Album not found" });
    }

    // 4. Create song
    const newSong = await Song.create({
      title,
      artist,
      userId: req.user._id,
      albumId,
    });
    res.status(201).json(newSong);
  } catch (error) {
    res.status(500).json({ message: "Error creating song", error });
  }
});


module.exports = songsRouter;
