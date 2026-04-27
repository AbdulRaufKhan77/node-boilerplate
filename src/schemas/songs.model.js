const mongoose = require("mongoose");
const { Schema } = mongoose;

const songSchema = new Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  album: { type: String },
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  isPublic: { type: Boolean, default: false },
  albumId: { type: Schema.Types.ObjectId, ref: "Album", index: true },
});

const Song = mongoose.model("Song", songSchema);
module.exports = Song;
