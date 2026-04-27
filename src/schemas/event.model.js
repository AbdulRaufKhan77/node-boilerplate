const mongoose = require("mongoose");
const { Schema } = mongoose;

const eventSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  location: { type: String },
  user: { type: Schema.Types.ObjectId, ref: "User" },
  album: [{ type: Schema.Types.ObjectId, ref: "Album" }],
  visibility: {
    type: String,
    enum: ["public", "private"],
    default: "public",
  },
  category: {
    type: String,
    enum: ["release", "concert", "meetup", "party", "other"],
    default: "other",
  },
  virtualLink: { type: String },
  attendees: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  playlist: [
    {
      songId: { type: Schema.Types.ObjectId, ref: "Song" },
      albumId: { type: Schema.Types.ObjectId, ref: "Album" },
    },
  ],
  comments: [
    {
      user: { type: Schema.Types.ObjectId, ref: "User" },
      comment: { type: String },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
