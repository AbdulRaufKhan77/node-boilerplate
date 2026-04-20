const mongoose = require("mongoose");
const { Schema } = mongoose;

const albumSchema = new Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  releaseDate: { type: Date },
  coverUrl: { type: String },
  userId: { type: Schema.Types.ObjectId, ref: "User" },
});

const Album = mongoose.model("Album", albumSchema);
module.exports = Album;
