const Song = require("../schemas/songs.model");
const Album = require("../schemas/album.model");

// Get songs by album ID
const getSongs = async (req, res) => {
  const { albumId } = req.query;
  try {
    const songs = await Song.find({ albumId });
    res.json(songs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching songs", error });
  }
};

// Create a new song
const addSongs = async (req, res) => {
  const { title, artist, albumId, isPublic } = req.body;
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

    const newSong = await Song.create({
      title,
      artist,
      userId: req.user._id,
      albumId,
      isPublic: isPublic === true || isPublic === "true",
    });
    res.status(201).json(newSong);
  } catch (error) {
    res.status(500).json({ message: "Error creating song", error });
  }
};

module.exports = {
  getSongs,
  addSongs,
};
