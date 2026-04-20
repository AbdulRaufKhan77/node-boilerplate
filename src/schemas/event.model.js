const mongoose = require("mongoose");
const { Schema } = mongoose;

const eventSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  location: { type: String },
  user: { type: Schema.Types.ObjectId, ref: "User" },
  album: { type: Schema.Types.ObjectId, ref: "Album" },
  eventType: {
    type: String,
    enum: ["public", "private"],
    default: "public",
  },
});

module.exports = mongoose.model("Event", eventSchema);
