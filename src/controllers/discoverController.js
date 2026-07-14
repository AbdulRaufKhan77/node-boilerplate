const Album = require("../schemas/album.model");
const Event = require("../schemas/event.model");
const Song = require("../schemas/songs.model");
const User = require("../schemas/user.model");

// GET /api/discover/feed — Mixed public feed of albums, events, songs
const getFeed = async (req, res) => {
  const pageNum = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (pageNum - 1) * limit;

  try {
    const [feed, total] = await Promise.all([
      Album.aggregate([
        { $match: { isPublic: true } },
        { $lookup: { from: "users", localField: "userId", foreignField: "_id", as: "user" } },
        { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
        {
          $project: {
            type: { $literal: "album" },
            data: "$$ROOT",
            createdAt: 1,
          },
        },
        {
          $unionWith: {
            coll: "events",
            pipeline: [
              { $match: { visibility: "public" } },
              { $lookup: { from: "users", localField: "user", foreignField: "_id", as: "user" } },
              { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
              { $lookup: { from: "albums", localField: "album", foreignField: "_id", as: "album" } },
              {
                $project: {
                  type: { $literal: "event" },
                  data: "$$ROOT",
                  createdAt: 1,
                },
              },
            ],
          },
        },
        {
          $unionWith: {
            coll: "songs",
            pipeline: [
              { $match: { isPublic: true } },
              { $lookup: { from: "users", localField: "userId", foreignField: "_id", as: "user" } },
              { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
              { $lookup: { from: "albums", localField: "albumId", foreignField: "_id", as: "album" } },
              { $unwind: { path: "$album", preserveNullAndEmptyArrays: true } },
              {
                $project: {
                  type: { $literal: "song" },
                  data: "$$ROOT",
                  createdAt: 1,
                },
              },
            ],
          },
        },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
      ]),
      Promise.all([
        Album.countDocuments({ isPublic: true }),
        Event.countDocuments({ visibility: "public" }),
        Song.countDocuments({ isPublic: true }),
      ]).then((counts) => counts.reduce((a, b) => a + b)),
    ]);

    res.json({ page: pageNum, limit, total, feed });
  } catch (error) {
    res.status(500).json({ message: "Error fetching discovery feed", error });
  }
};

// GET /api/discover/albums — All public albums (paginated)
const getPublicAlbums = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const [albums, total] = await Promise.all([
      Album.find({ isPublic: true })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("userId", "name role"),
      Album.countDocuments({ isPublic: true }),
    ]);

    res.json({ page, limit, total, albums });
  } catch (error) {
    res.status(500).json({ message: "Error fetching public albums", error });
  }
};

// GET /api/discover/trending — Top users by followerCount
const getTrending = async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;

  try {
    const trendingUsers = await User.find()
      .sort({ followerCount: -1 })
      .limit(limit)
      .select("name role followerCount favouriteAlbums createdAt")
      .populate("favouriteAlbums", "title artist coverUrl");

    res.json({ trending: trendingUsers });
  } catch (error) {
    res.status(500).json({ message: "Error fetching trending users", error });
  }
};

const search = async (req, res) => {
  const { q } = req.query;

  if (!q || q.trim() === "") {
    return res.status(400).json({ message: "Search query is required" });
  }

  const regex = new RegExp(q, "i"); // case-insensitive search

  try {
    const [users, albums, songs] = await Promise.all([
      User.find({ name: { $regex: regex } }).select(
        "name role followerCount createdAt",
      ),
      Album.find({
        isPublic: true,
        $or: [{ title: { $regex: regex } }, { artist: { $regex: regex } }],
      }).populate("userId", "name"),
      Song.find({
        isPublic: true,
        $or: [{ title: { $regex: regex } }, { artist: { $regex: regex } }],
      })
        .populate("userId", "name")
        .populate("albumId", "title coverUrl"),
    ]);

    res.json({
      query: q,
      results: {
        users,
        albums,
        songs,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error searching", error });
  }
};

module.exports = {
  getFeed,
  getPublicAlbums,
  getTrending,
  search,
};
