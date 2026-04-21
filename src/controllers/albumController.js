const Album = require("../../schemas/album.model");

// Get all albums for the authenticated user
const getAlbums = async (req, res) => {
  try {
    const albums = await Album.find({ userId: req.user._id });
    res.json(albums);
  } catch (error) {
    res.status(500).json({ message: "Error fetching albums", error });
  }
};

// Create a new album
const addAlbum = async (req, res) => {
  const { title, artist, releaseDate } = req.body;
  const coverUrl = req.file ? req.file.path : null;
  try {
    const newAlbum = new Album({
      title,
      artist,
      releaseDate,
      coverUrl,
      userId: req.user._id,
    });
    await newAlbum.save();
    res.status(201).json(newAlbum);
  } catch (error) {
    res.status(400).json({ message: "Error creating album", error });
  }
};

module.exports = {
  getAlbums,
  addAlbum,
};
