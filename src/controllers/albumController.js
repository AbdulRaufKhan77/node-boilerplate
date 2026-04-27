const Album = require("../schemas/album.model");

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

const addFavouriteAlbum = async (req, res) => {
  const { albumId } = req.body;
  try {
    if (!albumId) {
      return res.status(400).json({ message: "Album ID is required" });
    }
    const album = await Album.findById(albumId);
    if (!album) {
      return res.status(404).json({ message: "Album not found" });
    }
    req.user.favouriteAlbums.push(albumId);
    await req.user.save();
    res.json({ message: "Album added to favourites", user: req.user });
  } catch (error) {
    res.status(500).json({ message: "Error adding favourite album", error });
  }
};

module.exports = {
  getAlbums,
  addAlbum,
  addFavouriteAlbum,
};
