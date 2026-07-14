const mongoose = require("mongoose");
const Album = require("../schemas/album.model");
const Song = require("../schemas/songs.model");
const User = require("../schemas/user.model");

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
  const { title, artist, releaseDate, genres, isPublic } = req.body;
  const coverUrl = req.file ? req.file.path : null;
  try {
    const newAlbum = new Album({
      title,
      artist,
      releaseDate,
      genres,
      coverUrl,
      userId: req.user._id,
      isPublic: isPublic === true || isPublic === "true",
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
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { favouriteAlbums: albumId } },
      { new: true },
    ).select("-password");
    res.json({ message: "Album added to favourites", user });
  } catch (error) {
    res.status(500).json({ message: "Error adding favourite album", error });
  }
};

// Get a single album with its songs (owner or public only)
const getAlbumById = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.isValidObjectId(id)) {
      return res.status(404).json({ message: "Album not found" });
    }
    const album = await Album.findById(id).populate("userId", "name role");
    if (!album) {
      return res.status(404).json({ message: "Album not found" });
    }
    const isOwner = album.userId && album.userId._id.equals(req.user._id);
    if (!album.isPublic && !isOwner) {
      return res.status(404).json({ message: "Album not found" });
    }
    const songs = await Song.find({ albumId: album._id });
    res.json({ album, songs });
  } catch (error) {
    res.status(500).json({ message: "Error fetching album", error });
  }
};

module.exports = {
  getAlbums,
  addAlbum,
  addFavouriteAlbum,
  getAlbumById,
};
