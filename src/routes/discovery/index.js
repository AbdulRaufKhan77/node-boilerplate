const discoveryRouter = require("express").Router();
const {
  getFeed,
  getPublicAlbums,
  getTrending,
  search,
} = require("../../controllers/discoverController");

// GET /api/discover/feed — Mixed public feed (no auth required)
discoveryRouter.get("/feed", getFeed);

// GET /api/discover/albums — All public albums (no auth required)
discoveryRouter.get("/albums", getPublicAlbums);

// GET /api/discover/trending — Top users by follower count (no auth required)
discoveryRouter.get("/trending", getTrending);

// GET /api/discover/search?q=keyword — Search users, albums, songs (no auth required)
discoveryRouter.get("/search", search);

module.exports = discoveryRouter;
